import { Request, Response } from "express"
import SeedDataService from "../services/seed-data.service"
import { generalResponse } from "../utils/general-response.util"

const seedData = async (_req: Request, res: Response) => {
  try {
    const response = await SeedDataService.seedDatabase()
    if (response) {
      generalResponse(res, {
        status: 201,
        message: "Data seeded successfully"
      })
    }
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: "Error seeding data",
      data: error
    })
  }
}

export default {
  seedData
}
