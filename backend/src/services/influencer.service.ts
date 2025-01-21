import Influencer from "../models/influencer/influencer.model"
import Claim from "../models/claim/claim.model"
import Category from "../models/category/category.model"
import { IInfluencer } from "../models/influencer/influencer.document"
import { getOpenAIResponse } from "../utils/open-ai-client.util"
import { searchClaims } from "../utils/serf-search.util"
import delay from "../utils/delay"

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
    const claimStats = await Claim.find({ influencerId: influencer._id })

    return {
      ...influencer.toObject(),
      claimStats: claimStats?.length || 0,
      claims: claimStats,
      followersCount: influencer?.followerCount || 0
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
const processInfluencer = async (
  name: string,
  journals: string[],
  analyzeInfluencer: number,
  timeRange: string,
  notes?: string,
  includeRevenueAnalysis?: boolean,
  verifyWithScientificJournals?: boolean
) => {
  try {
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

    const searchResults = await searchClaims(name, analyzeInfluencer, timeRange, verifyWithScientificJournals)

    const batchSize = 5
    const processedData = []

    for (let i = 0; i < searchResults.length; i += batchSize) {
      const batch = searchResults.slice(i, i + batchSize)

      // Calculate a random delay between 1-3 seconds (1000 to 3000 ms) for each batch
      const randomDelay = Math.floor(Math.random() * 2000) + 1000

      // console.log(`Batch ${i} TO ${i + batchSize} PROCESSING DELAY ${randomDelay} ms`)
      await delay(randomDelay)
      // console.log(`Batch ${i} TO ${i + batchSize} STARTED`)

      try {
        const response = await getOpenAIResponse(
          batch,
          name,
          analyzeInfluencer,
          timeRange,
          journals,
          notes,
          includeRevenueAnalysis,
          verifyWithScientificJournals
        )

        if (response) {
          processedData.push(response)
        } else {
          console.error("Failed to analyze claims.")
        }
      } catch (error) {
        console.log(error)
      }
    }

    const firstBatchData = processedData[0]

    const formattedData = {
      influencer: firstBatchData?.influencer,
      influencerCategory: firstBatchData?.influencerCategory,
      timeRange: firstBatchData?.timeRange,
      summary: firstBatchData?.summary,
      followers: firstBatchData?.followers,
      yearlyRevenue: firstBatchData?.yearlyRevenue,
      recommendedProducts: [],
      revenueAnalysis: firstBatchData?.revenueAnalysis,
      claims: processedData?.map((data) => data?.claims)?.flat()
    }

    // const outputFile = "response-pool.json"
    // fs.writeFileSync(outputFile, JSON.stringify(formattedData))

    // const formattedData = JSON.parse(fs.readFileSync("response-pool.json", "utf-8"))

    console.clear()
    // console.log(`FORMATTED DATA`, formattedData)

    const formattedClaims = formattedData?.claims?.map((claim: any) => {
      return {
        influencerId: influencer._id,
        content: claim?.content || ``,
        category: claim?.category || ``,
        platform: claim?.source || ``, // source
        verificationStatus: claim?.verificationStatus || ``,
        confidenceScore: claim?.trustScore, // trustScore
        source: claim?.source?.url || ``
      }
    })

    // Prepare bulk write operations to avoid duplicates
    const claimBulOps = formattedClaims.map((claim: any) => ({
      updateOne: {
        filter: {
          influencerId: claim.influencerId,
          content: claim.content
        },
        update: { $setOnInsert: claim }, // Insert only if the document doesn't exist
        upsert: true // If the document doesn't exist, insert it
      }
    }))

    // Perform the bulk write operation
    const insertedClaims = await Claim.bulkWrite(claimBulOps)

    const tResult = await Claim.aggregate([
      {
        $match: { influencerId: influencer._id } // Match claims by influencerId
      },
      {
        $group: {
          _id: null,
          trustScore: { $avg: "$confidenceScore" } // Calculate average confidenceScore
        }
      }
    ])

    // const claimsCategories: string[] = Array.from(
    //   new Set(formattedClaims.map((claim: { category: string }) => claim?.category))
    // )

    const bulkOps = [formattedData.influencerCategory].map((categoryName: string) => ({
      updateOne: {
        filter: { categoryName }, // Filter by categoryName
        update: { $set: { categoryName } }, // Set the categoryName field
        upsert: true // If the category doesn't exist, insert it
      }
    }))

    const categories = await Category.bulkWrite(bulkOps)

    // Extract the trustScore if available
    const trustScore = tResult.length > 0 ? tResult[0].trustScore : 0

    await Influencer.findOneAndUpdate(
      { _id: influencer._id },
      {
        followerCount: formattedData?.followers?.total || 0,
        yearlyRevenue: formattedData?.yearlyRevenue?.total || 0,
        products: formattedData?.yearlyRevenue?.breakdown?.products || 0,
        trustScore,
        influencerCategory: influencer?.influencerCategory || formattedData?.influencerCategory || ``
      }
    )

    // console.log(`INSERTED Claims ${insertedClaims.insertedCount}`, JSON.stringify(insertedClaims))

    return influencer
  } catch (error) {
    console.log(error)
    return null
  }
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
          verifiedClaims: { $sum: "$claimStats" },
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
