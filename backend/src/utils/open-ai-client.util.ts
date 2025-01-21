import OpenAI from "openai"
import config from "../config"

interface Followers {
  total: number
  platforms: {
    youtube: number
    instagram: number
    tiktok: number
    twitter: number
    other: number
  }
  lastUpdated: string
}

interface RevenueBreakdown {
  youtube: number
  sponsorships: number
  products: number
  other: number
}

interface RecommendedProduct {
  name: string
  category: string
  description: string
  link: string
  price: number
  endorsementType: "Paid" | "Unpaid" | "Affiliate"
  verificationStatus: "Verified" | "Questionable" | "Debunked"
  trustScore: number
}

interface Claim {
  content: string
  category: string
  verificationStatus: "Verified" | "Questionable" | "Debunked"
  trustScore: number
  source: {
    name: string
    url: string
  }
  evidenceBreakdown: {
    scientificEvidence: number
    sourceCredibility: number
    expertConsensus: number
  }
}

interface RevenueAnalysis {
  mainRevenueSources: string[]
  estimatedRevenue: RevenueBreakdown
  businessRelationships: string[]
  potentialConflicts: string[]
  impactOnCredibility: string
}

interface Response {
  influencer: string
  timeRange: string
  summary: string
  followers: Followers
  yearlyRevenue: {
    total: number
    breakdown: RevenueBreakdown
    lastUpdated: string
  }
  recommendedProducts: RecommendedProduct[]
  revenueAnalysis: RevenueAnalysis
  claims: Claim[]
}

export const getOpenAIResponse = async (
  searchResults: any,
  influencerName: string,
  numberOfClaims: number,
  timeRange: string,
  scientificJournals: string[] = [],
  researchNotes: string = "",
  includeRevenueAnalysis: boolean = false,
  verifyWithScientificJournals: boolean = false
): Promise<any> => {
  try {
    const openai = new OpenAI({ apiKey: config.OPEN_AI.API_KEY })

    const scientificJournalsPrompt =
      scientificJournals.length > 0 ? `Scientific Journals to reference: ${scientificJournals.join(", ")}` : ""

    const researchNotesPrompt = researchNotes ? `Research Notes to consider: ${researchNotes}` : ""

    const revenueAnalysisPrompt = includeRevenueAnalysis
      ? `Analyze the influencer's revenue streams, business model, and recommended products in detail.`
      : ""

    const scientificVerificationPrompt = verifyWithScientificJournals
      ? `Pay special attention to scientific sources marked as 'isScientific: true' in the search results.`
      : ""

    const systemPrompt = `You are an expert fact-checker and business analyst specializing in health claims and influencer analysis. 
    Analyze the provided search results about ${influencerName}'s health claims, revenue streams, and product recommendations.
    Extract exactly ${numberOfClaims} claims and provide detailed revenue analysis.
    
    Time Range: ${timeRange}
    ${scientificJournalsPrompt}
    ${researchNotesPrompt}
    ${revenueAnalysisPrompt}
    ${scientificVerificationPrompt}
    
    For each claim:
    1. Extract the specific health claim
    2. Evaluate scientific accuracy
    3. Assess source credibility
    4. Verify expert consensus
    5. Assign verification status (Verified/Questionable/Debunked)
    6. Categorize the claim
    7. Calculate trust score (70-100 for Verified, 30-69 for Questionable, 0-29 for Debunked)
    
    For revenue analysis:
    1. Estimate yearly revenue from all sources
    2. Break down revenue streams
    3. Analyze business relationships
    4. Identify potential conflicts of interest
    5. Evaluate recommended products

    For recommended products analysis:
    1. Extract specific product names, categories, and descriptions
    2. Find actual product links and prices where available
    3. Determine if the endorsement is paid, unpaid, or affiliate
    4. Verify the product claims and assign a trust score
    5. DO NOT use placeholder values like "Not Available" - if a product can't be fully verified, don't include it
    6. Only include products that have been explicitly recommended or endorsed by the influencer
    7. For each product, ensure:
       - Name is the actual product name
       - Category is specific (e.g., "Supplements", "Medical Equipment", "Wellness Products")
       - Description includes key features and claims
       - Price is a numeric value (0 if unknown)
       - EndorsementType is strictly "Paid", "Unpaid", or "Affiliate"
       - VerificationStatus is strictly "Verified", "Questionable", or "Debunked"
       - TrustScore is 0-100 based on evidence and verification
    
    Do not include any explanatory text or markdown - ONLY return a valid JavaScript object.

    Respond with a valid JavaScript object in the following format:
    {
      "influencer": "${influencerName}",
      "timeRange": "${timeRange}",
      "influencerCategory: "string", - e.g. "Medical" , "Engineering", "Science", "Technology", "Mathematics", "Entertainment"
      "summary": "Brief summary",
      "followers": {
        "total": number,
        "platforms": {
          "youtube": number,
          "instagram": number,
          "tiktok": number,
          "twitter": number,
          "other": number
        },
        "lastUpdated": "ISO date string"
      },
      "yearlyRevenue": {
        "total": number,
        "breakdown": {
          "youtube": number,
          "sponsorships": number,
          "products": number,
          "other": number
        },
        "lastUpdated": "ISO date string"
      },
      "recommendedProducts": [
        {
          "name": "string",
          "category": "string",
          "description": "string",
          "link": "string",
          "price": number,
          "endorsementType": "Paid|Unpaid|Affiliate",
          "verificationStatus": "Verified|Questionable|Debunked",
          "trustScore": number
        }
      ],
      "revenueAnalysis": {
        "mainRevenueSources": ["string"],
        "estimatedRevenue": {
          "total": number,
          "breakdown": {
            "youtube": number,
            "sponsorships": number,
            "products": number,
            "other": number
          }
        },
        "businessRelationships": ["string"],
        "potentialConflicts": ["string"],
        "impactOnCredibility": "string"
      },
      "claims": [
        {
          "content": "string",
          "category": "string",
          "verificationStatus": "Verified|Questionable|Debunked",
          "trustScore": number,
          "source": {
            "name": "string",
            "url": "string"
          },
          "evidenceBreakdown": {
            "scientificEvidence": number,
            "sourceCredibility": number,
            "expertConsensus": number
          }
        }
      ]
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: JSON.stringify(searchResults)
        }
      ],
      temperature: 0.2
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error("No response from OpenAI")
    }

    // console.log(`OPEN AI RESPONSE `, response)

    const parsedResponse: Response = JSON.parse(response)

    if (parsedResponse.claims) {
      parsedResponse.claims.forEach((claim, index) => {
        if (!["Verified", "Questionable", "Debunked"].includes(claim.verificationStatus)) {
          claim.verificationStatus = "Questionable"
        }

        const trustScore = claim.trustScore
        switch (claim.verificationStatus) {
          case "Verified":
            if (trustScore < 70 || trustScore > 100) {
              claim.trustScore = Math.floor(Math.random() * (100 - 70 + 1)) + 70
            }
            break
          case "Questionable":
            if (trustScore < 30 || trustScore > 69) {
              claim.trustScore = Math.floor(Math.random() * (69 - 30 + 1)) + 30
            }
            break
          case "Debunked":
            if (trustScore > 29) {
              claim.trustScore = Math.floor(Math.random() * 30)
            }
            break
        }

        const totalScore = claim.trustScore
        claim.evidenceBreakdown = {
          scientificEvidence: Math.round(totalScore * 0.4),
          sourceCredibility: Math.round(totalScore * 0.3),
          expertConsensus: Math.round(totalScore * 0.3)
        }
      })
    }

    if (parsedResponse.yearlyRevenue) {
      parsedResponse.yearlyRevenue.total = Number(parsedResponse.yearlyRevenue.total) || 0

      Object.keys(parsedResponse.yearlyRevenue.breakdown).forEach((key) => {
        const breakdownKey = key as keyof RevenueBreakdown // Explicit cast
        parsedResponse.yearlyRevenue.breakdown[breakdownKey] =
          Number(parsedResponse.yearlyRevenue.breakdown[breakdownKey]) || 0
      })
    }

    if (parsedResponse.followers) {
      parsedResponse.followers.total = Number(parsedResponse.followers.total) || 0

      Object.keys(parsedResponse.followers.platforms).forEach((key) => {
        const platformKey = key as keyof typeof parsedResponse.followers.platforms // Explicit cast
        parsedResponse.followers.platforms[platformKey] = Number(parsedResponse.followers.platforms[platformKey]) || 0
      })
    }

    if (parsedResponse.recommendedProducts) {
      parsedResponse.recommendedProducts = parsedResponse.recommendedProducts.filter((product) => {
        return (
          product.name !== "Not Available" &&
          product.category !== "Not Available" &&
          product.description !== "Not Available" &&
          typeof product.price === "number" &&
          ["Paid", "Unpaid", "Affiliate"].includes(product.endorsementType) &&
          ["Verified", "Questionable", "Debunked"].includes(product.verificationStatus)
        )
      })

      parsedResponse.recommendedProducts.forEach((product) => {
        product.price = Number(product.price) || 0
        product.trustScore = Math.min(Math.max(Number(product.trustScore) || 0, 0), 100)

        if (product.verificationStatus === "Verified" && product.trustScore < 70) {
          product.trustScore = Math.floor(Math.random() * (100 - 70 + 1)) + 70
        } else if (
          product.verificationStatus === "Questionable" &&
          (product.trustScore < 30 || product.trustScore > 69)
        ) {
          product.trustScore = Math.floor(Math.random() * (69 - 30 + 1)) + 30
        } else if (product.verificationStatus === "Debunked" && product.trustScore > 29) {
          product.trustScore = Math.floor(Math.random() * 30)
        }
      })
    }

    return parsedResponse
  } catch (error: any) {
    console.error("Error with OpenAI API:", error.message)
    return JSON.stringify(
      {
        influencer: influencerName,
        timeRange: timeRange,
        summary: "Error: " + error.message,
        followers: {
          total: 0,
          platforms: {
            youtube: 0,
            instagram: 0,
            tiktok: 0,
            twitter: 0,
            other: 0
          },
          lastUpdated: new Date().toISOString()
        },
        yearlyRevenue: {
          total: 0,
          breakdown: {
            youtube: 0,
            sponsorships: 0,
            products: 0,
            other: 0
          },
          lastUpdated: new Date().toISOString()
        },
        recommendedProducts: [],
        revenueAnalysis: {
          mainRevenueSources: [],
          estimatedRevenue: {
            total: 0,
            breakdown: {
              youtube: 0,
              sponsorships: 0,
              products: 0,
              other: 0
            }
          },
          businessRelationships: [],
          potentialConflicts: [],
          impactOnCredibility: "Unable to determine"
        },
        claims: []
      },
      null,
      2
    )
  }
}
