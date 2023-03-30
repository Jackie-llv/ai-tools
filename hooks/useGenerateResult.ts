import { useState } from 'react'

type params = {
  content: string
  role: string
}

export const useGenerateResult = () => {
  const [generatedResults, setGeneratedResults] = useState<string[]>([])
  async function generate(body: params[]) {
    // setGeneratedResults('')

    body.forEach((item, index) => {
      if (item.role === 'assistant' && !item.content) {
        item.content = generatedResults[index - 1]
      }
    })

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = response.body
    if (!data) {
      return
    }
    
    const reader = data.getReader()
    const decoder = new TextDecoder()
    const list = [...generatedResults]
    let res = ''
    let len = generatedResults.length
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value) 
      res += chunkValue
      list[len] = res
      setGeneratedResults([...list])
    }
  }

  return { generatedResults, generate }
}
