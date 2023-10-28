import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { env } from '@/env.mjs';
import { db } from '@/server/db';
import { notes } from '@/server/db/schema';
import { generateJSON } from '@tiptap/html'
import { config } from '@/components/editor/config';
import { ChatCompletionMessageParam } from 'openai/resources';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_BASE_URL
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

type RequestBody = {
  messages: ChatCompletionMessageParam[]
  channelId: string
}

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, channelId } = (await req.json()) as RequestBody;

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    stream: true,
    messages,
  });
  console.log('>>>>R', response)
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onCompletion: async (completion) => {
      const promptHtml = `<p>${messages[0]?.content}</p>`
      const content = JSON.stringify(generateJSON(promptHtml + completion, config.extensions))
      await db.insert(notes).values({
        type: 'ai',
        content,
        channelId
      })
    }
  });
  console.log('>>>>S', stream)
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
