import { Request, Response } from "express"
import categoryService from "../services/category.service"
import { generalResponse } from "../utils/general-response.util"

const getAllCategoriesController = async (_req: Request, res: Response) => {
  try {
    const data = await categoryService.getAllCategories()
    generalResponse(res, {
      status: 200,
      message: "Categories fetched succesfully",
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

export default { getAllCategoriesController }
