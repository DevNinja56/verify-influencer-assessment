import { Request, Response } from "express"
import InfluencerService from "../services/influencer.service"
import { generalResponse } from "../utils/general-response.util"

// Get all influencers
const getAllInfluencers = async (_req: Request, res: Response) => {
  try {
    const data = await InfluencerService.getAllInfluencers()
    generalResponse(res, {
      status: 200,
      message: "Influencers fetched successfully",
      data
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: "Error fetching influencers",
      data: error
    })
  }
}

// Get influencer by ID
const getInfluencerById = async (req: Request, res: Response) => {
  try {
    const influencer = await InfluencerService.getInfluencerById(req.params.id)
    generalResponse(res, {
      status: 200,
      message: "Influencer fetched successfully",
      data: influencer
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: "Error fetching influencer",
      data: error
    })
  }
}

// Add new influencer
const addInfluencer = async (req: Request, res: Response) => {
  try {
    const { name, platform } = req.body
    const influencer = await InfluencerService.addInfluencer({
      name,
      platform,
      handle: `@${name.toLowerCase().replace(/\s+/g, "")}`
    })
    generalResponse(res, {
      status: 201,
      message: "Influencer added successfully",
      data: influencer
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: "Error adding influencer",
      data: error
    })
  }
}

// Process influencer data
const processInfluencer = async (req: Request, res: Response) => {
  try {
    const { name, journals, notes } = req.body

    if (!name) {
      generalResponse(res, {
        status: 400,
        message: "Influencer name is required"
      })
      return
    }

    const influencer = await InfluencerService.processInfluencer(name, journals, notes)
    generalResponse(res, {
      status: 200,
      message: "Influencer processed successfully",
      data: influencer
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: "Error processing influencer",
      data: error
    })
  }
}

// Get all influencers with pagination and sorting
const getAllInfluencersName = async (_req: Request, res: Response) => {
  try {
    const data = await InfluencerService.getAllInfluencersName()
    generalResponse(res, {
      status: 200,
      message: "Influencers names fetched successfully",
      data
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: (error as Error).message,
      data: error
    })
  }
}

const influencersAnalytics = async (_req: Request, res: Response) => {
  try {
    const data = await InfluencerService.influencersAnalytics()
    generalResponse(res, {
      status: 200,
      message: "Influencers analytics fetched successfully",
      data
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: (error as Error).message,
      data: error
    })
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
