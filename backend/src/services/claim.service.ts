import { PaginatedResponse } from "../interface"
import Claim from "../models/claim/claim.model"
import { IClaim, VerificationStatus } from "../models/claim/claim.document"
import { getOpenAIResponse } from "../utils/open-ai-client.util"
import axios from "axios"

// Get claims for an influencer with filtering
const getClaimsForInfluencer = async (data: {
  influencerId: string
  page: number
  limit: number
  status: string
  category: string
  sortBy: string
  sortOrder: string
}): Promise<PaginatedResponse> => {
  try {
    const { influencerId, page, limit, status, category, sortBy, sortOrder } = data

    const query: any = { influencerId }
    if (status) query.verificationStatus = status
    if (category) query.category = category

    const claims = await Claim.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Claim.countDocuments(query)

    return {
      count,
      data: claims,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      nextPage: page < Math.ceil(count / limit) ? page + 1 : null
    }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

// Get claim categories
const getClaimCategories = async (): Promise<string[]> => {
  try {
    const categories = await Claim.distinct("category")
    return categories
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export default {
  getClaimsForInfluencer,
  getClaimCategories
}