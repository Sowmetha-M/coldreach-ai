import OpenAI from 'openai'
import { z } from 'zod'

// Define the output schema
const MessageSchema = z.object({
  subject: z.string(),
  greeting: z.string(),
  body: z.string(),
  call_to_action: z.string(),
  closing: z.string(),
})

type Message = z.infer<typeof MessageSchema>

// Define the input schema
const InputSchema = z.object({
  messageType: z.string(),
  purpose: z.string(),
  recipientRole: z.string(),
  tone: z.string(),
  context: z.string(),
})

// Initialize OpenAI client with OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
})

// Prompt template
const systemPrompt = `Generate a professional {messageType} for {purpose} to a {recipientRole} with {tone} tone.

Context: {context}

Return ONLY a JSON object with these exact keys:
- subject
- greeting  
- body
- call_to_action
- closing

Example: {"subject":"Application for Software Engineer","greeting":"Dear Hiring Manager,","body":"I am writing to express interest...","call_to_action":"I would welcome the opportunity to discuss...","closing":"Best regards,"}`

// Function to generate the message with retry on validation failure
export async function generateMessage(input: z.infer<typeof InputSchema>): Promise<Message> {
  const maxRetries = 3
  let attempts = 0
  let lastResponse = ''

  while (attempts < maxRetries) {
    try {
      const prompt = systemPrompt
        .replace('{messageType}', input.messageType)
        .replace('{purpose}', input.purpose)
        .replace('{recipientRole}', input.recipientRole)
        .replace('{tone}', input.tone)
        .replace('{context}', input.context)

      console.log('Sending prompt to AI:', prompt)

      const completion = await openai.chat.completions.create({
        model: 'meta-llama/llama-3.2-3b-instruct:free', // More reliable free model
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: 'Generate the message now.' },
        ],
        temperature: 0.7,
        max_tokens: 500, // Limit response length
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from AI')
      }

      console.log('AI response:', response)
      lastResponse = response

      // Parse the JSON response
      let parsed
      try {
        // Try to extract JSON if it's wrapped in code blocks
        let jsonString = response.trim()
        // Remove markdown code blocks (with or without language specifier)
        jsonString = jsonString.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
        parsed = JSON.parse(jsonString)
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response:', response)
        throw new Error(`AI response is not valid JSON. Response: ${response.substring(0, 200)}...`)
      }

      console.log('Parsed result:', parsed)

      const validated = MessageSchema.parse(parsed)

      console.log('Validation successful')
      return validated
    } catch (validationError) {
      attempts++
      console.error(`Attempt ${attempts} failed:`, validationError)
      if (validationError instanceof Error) {
        console.error('Validation error details:', validationError.message)
        // If it's a Zod error, log the issues
        if ('issues' in validationError) {
          console.error('Validation issues:', (validationError as any).issues)
        }
      }
      if (attempts >= maxRetries) {
        const truncatedResponse = lastResponse.length > 200 ? lastResponse.substring(0, 200) + '...' : lastResponse
        throw new Error(`Failed to generate valid message after ${maxRetries} retries. Last AI response: "${truncatedResponse}"`)
      }
    }
  }

  throw new Error('Unexpected error')
}