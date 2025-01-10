import OpenAI from "openai"
import config from "../config"

export const getOpenAIResponse = async (prompt: string): Promise<string | null> => {
  try {
    const openai = new OpenAI({
      apiKey: config.OPEN_AI.API_KEY
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content: " You are an expert at providing structured JSON responses for claim verification tasks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2 // Reduces randomness to ensure a focused response
    })
    return completion.choices[0]?.message?.content || null
  } catch (error) {
    console.error("Error with OpenAI API:", error)
    return null
  }
}
