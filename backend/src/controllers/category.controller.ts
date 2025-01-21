import { Request, Response } from "express"
import categoryService from "../services/category.service"
import { generalResponse } from "../utils/general-response.util"

const getAllCategories = async (_req: Request, res: Response) => {
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

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const data = await categoryService.deleteCategory(req.params.id)
    generalResponse(res, {
      status: 200,
      message: "Category deleted successfully",
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

export default { getAllCategories, deleteCategory }
