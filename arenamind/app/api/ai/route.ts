import { NextRequest, NextResponse } from 'next/server'
import { getAIResponse } from '@/lib/llmService'

export async function POST(req: NextRequest) {
  try {
    const { query, context } = await req.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const result = await getAIResponse(query, context || {})

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[AI Route Error]', err)
    return NextResponse.json(
      { error: 'AI gateway temporarily unavailable', details: err.message },
      { status: 500 }
    )
  }
}
