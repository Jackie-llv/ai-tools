import { NextRequest } from 'next/server'
import { OpenAIStream, OpenAIStreamPayload } from '@/utils/OpenAIStream'

export const config = {
  runtime: 'edge',
}

const handler = async (req: NextRequest): Promise<Response> => {
  const params = await req.json()  

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: params,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}

export default handler
