import { useState } from 'react'

type params = {
  userInput: string
}

export const useGenerateResult = () => {
  const [generatedResults, setGeneratedResults] = useState<string>('')

  async function generate(body: params) {
    setGeneratedResults('')

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

    console.log(data, '---data');
    
    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)      
      setGeneratedResults((prev) => prev + chunkValue)
    }
  }

  return { generatedResults, generate }
}
