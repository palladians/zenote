import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { env } from '@/env.mjs'

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_BASE_URL
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const content = 'Write one paragraph for given prompt: ' + prompt

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    stream: true,
    messages: [{ role: 'user', content }],
    max_tokens: 2048
  })

  const stream = OpenAIStream(response as never)

  return new StreamingTextResponse(stream)
}
