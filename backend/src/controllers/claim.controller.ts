import { Request, Response } from "express"
import { generalResponse } from "../utils/general-response.util"
import ClaimService from "../services/claim.service"

// Get claims for an influencer with filtering
const getClaimsForInfluencer = async (req: Request, res: Response) => {
  try {
    const data = {
      influencerId: req.params.id,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      status: req.query.status as string,
      category: req.query.category as string,
      sortBy: (req.query.sortBy as string) || "date",
      sortOrder: (req.query.sortOrder as string) || "desc"
    }

    const response = await ClaimService.getClaimsForInfluencer(data)
    generalResponse(res, {
      status: 200,
      message: "Claims fetched successfully",
      data: response
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: "Error fetching claims",
      data: error
    })
  }
}

// Get claim categories
const getClaimCategories = async (req: Request, res: Response) => {
  try {
    const categories = await ClaimService.getClaimCategories()
    generalResponse(res, {
      status: 200,
      message: "Claim categories fetched successfully",
      data: categories
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: "Error fetching claim categories",
      data: error
    })
  }
}

export default {
  getClaimsForInfluencer,
  getClaimCategories
}
