import Influencer from "../models/influencer/influencer.model"
import Claim from "../models/claim/claim.model"
import { IInfluencer } from "../models/influencer/influencer.document"
import { VerificationStatus } from "../models/claim/claim.document"
import { getOpenAIResponse } from "../utils/open-ai-client.util"
import { calculateInfluencerTrustScore } from "../utils/helper-functions.util"

// Get all influencers with pagination and sorting
const getAllInfluencers = async (): Promise<IInfluencer[]> => {
  try {
    const influencers = await Influencer.find({
      trustScore: { $gt: 0 }
    }).sort({ ["trustScore"]: -1 })

    return influencers
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

// Get influencer by ID
const getInfluencerById = async (id: string) => {
  try {
    const influencer = await Influencer.findById(id)
    if (!influencer) {
      throw new Error("Influencer not found")
    }

    // Get claims statistics
    const claimStats = await Claim.aggregate([
      {
        $match: { influencerId: influencer._id }
      },
      {
        $project: {
          content: 1,
          category: 1,
          verificationStatus: 1,
          confidenceScore: 1,
          _id: 1,
          createdAt: 1
        }
      }
    ])

    return {
      ...influencer.toObject(),
      claimStats,
      followersCount: influencer.followerCount
    }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

// Add new influencer
const addInfluencer = async (data: { name: string; platform: string; handle: string }): Promise<IInfluencer> => {
  try {
    const influencer = new Influencer(data)
    const savedInfluencer = await influencer.save()
    return savedInfluencer
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

// Process influencer data
const processInfluencer = async (name: string, journals: string[], notes?: string) => {
  // Find or create the influencer
  let influencer = await Influencer.findOneAndUpdate(
    { name },
    {
      name,
      platform: "Twitter",
      handle: `@${name.toLowerCase().replace(/\s+/g, "")}`
    },
    { upsert: true, new: true }
  )

  // Fetch all claims associated with the influencer
  const claims = await Claim.find({ influencerId: influencer._id })

  const influencerClaims = claims.map((claim) => {
    return {
      content: claim.content,
      verificationStatus: claim.verificationStatus
    }
  })

  // Verif cliams using OpenAI
  const prompt = `
        You are a fact-checking and claim verification expert. 
        I will provide you with an influencer and their claims. Your task is to:
        1. ${
          journals && journals?.length > 0
            ? `Verify each claim by referring to these journals only ${journals.map((j) => `"${j}"`).join(",")}`
            : "Verify each claim by referring to credible sources or journals."
        }
        2. Provide a verification status for each claim, which can be one of the following: "Verified", "Questionable", or "Debunked".
        3. Assign a trust score between 0 and 100, where 100 means highly trustworthy and 0 means not trustworthy.
        ${notes ? `4. Please do the research using these notes in context: "${notes}"` : " "}

        Here is the influencer and their claims:
        ${JSON.stringify({ influencer, influencerClaims })}

        The claims text is in the "content" key.

        Return the result **only** in this JSON format:
        {
          "claims": [
            {
              "content": "The claim content here.",
              "verificationStatus": "verified/questionable/debunked",
              "trustScore": 85
            },
            ...
          ]
        }
        Make sure the response is valid JSON and contains no additional text or explanation.
      `

  const verifiedClaims = await getOpenAIResponse(prompt)
  const parsedResponse = JSON.parse(verifiedClaims || "{}")

  // Initialize stats
  const stats = {
    totalClaims: claims.length,
    verifiedClaims: 0,
    questionableClaims: 0,
    debunkedClaims: 0
  }

  // Calcualte Score Using Weighted Average with Exponential Decay for Debunked Claims
  const trustScore = calculateInfluencerTrustScore(parsedResponse?.claims)

  // map id of that claim
  const idMappedClaims = parsedResponse?.claims.map((claim: any) => {
    let claimId
    const claimFound: any = claims.find((c) => c.content?.trim() === claim.content?.trim())
    if (claimFound) {
      claimId = claimFound._id.toString()
    }

    return {
      ...claim,
      confidenceScore: claim.trustScore,
      id: claimId
    }
  })

  // Update claims
  if (idMappedClaims && idMappedClaims.length > 0) {
    const bulkOperations = idMappedClaims
      .filter((claim: any) => claim.id) // Ensure only claims with an ID are processed
      .map((claim: any) => ({
        updateOne: {
          filter: { _id: claim.id },
          update: {
            verificationStatus: claim.verificationStatus,
            confidenceScore: claim.confidenceScore
          }
        }
      }))

    if (bulkOperations.length > 0) {
      await Claim.bulkWrite(bulkOperations)
    }
  }

  console.log("+++", idMappedClaims, "+++")

  // Process each claim
  for (const claim of parsedResponse?.claims) {
    if (claim.verificationStatus === VerificationStatus.Verified) {
      stats.verifiedClaims++
    } else if (claim.verificationStatus === VerificationStatus.Questionable) {
      stats.questionableClaims++
    } else if (claim.verificationStatus === VerificationStatus.Debunked) {
      stats.debunkedClaims++
    }
  }

  // Update influencer stats
  influencer.trustScore = Math.floor(trustScore)
  influencer.claimStats = stats
  await influencer.save()

  return influencer
}

// Get all influencers name
const getAllInfluencersName = async () => {
  try {
    const data = await Influencer.aggregate([
      {
        $project: {
          _id: 0,
          name: 1
        }
      },
      {
        $sort: {
          name: 1
        }
      },
      {
        $group: {
          _id: null,
          influencers: {
            $push: "$name"
          }
        }
      }
    ])
    return data.length ? data[0].influencers : []
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

// Get influencers analytics
const influencersAnalytics = async () => {
  try {
    // Show Active Influencers, Verified Claims, Average Trust Score
    const data = await Influencer.aggregate([
      {
        $match: {
          trustScore: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          activeInfluencers: { $sum: 1 },
          verifiedClaims: { $sum: "$claimStats.verifiedClaims" },
          averageTrustScore: { $avg: "$trustScore" }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ])
    return data.length ? data[0] : {}
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export default {
  getAllInfluencers,
  getInfluencerById,
  addInfluencer,
  processInfluencer,
  getAllInfluencersName,
  influencersAnalytics
}
