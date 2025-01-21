import { ICategory } from "../models/category/category.document"
import Category from "../models/category/category.model"

const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    const categories = await Category.find({})

    return categories
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export default { getAllCategories }
