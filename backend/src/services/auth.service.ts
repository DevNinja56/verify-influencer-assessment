import bcrypt from "bcryptjs"
import User from "../models/user/user.model"
import { signJwt } from "../utils/jwt.util"
import { IUser } from "../models/user/user.document"

const register = async (data: {
  username: string
  password: string
}): Promise<{
  token: string
  user: IUser
}> => {
  try {
    const { username, password } = data
    const hashedPassword = await bcrypt.hash(password, 10)
    // Save username and hashedPassword to database
    const newUser = new User({ username, password: hashedPassword })
    await newUser.save()

    const token = signJwt({ id: newUser._id })
    return {
      token,
      user: newUser
    }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

const login = async (data: { username: string; password: string }): Promise<{ token: string; user: IUser }> => {
  try {
    const { username, password } = data
    const user = await User.findOne({ username })

    if (!user) {
      throw new Error("Invalid credentials")
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error("Invalid credentials")
    }

    // Generate a JWT token and return it along with the user object
    const token = signJwt({ id: user._id })

    return {
      token,
      user
    }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export default {
  register,
  login
}
