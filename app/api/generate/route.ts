import { NextRequest, NextResponse } from 'next/server'
import { generateMessage } from '../../../lib/agent'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { purpose, recipientRole, tone, context } = body

    // Basic validation
    if (!purpose || !recipientRole || !tone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await generateMessage({
      messageType: 'Cold Email', // Default to Cold Email
      purpose,
      recipientRole,
      tone,
      context: context || '',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating message:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}