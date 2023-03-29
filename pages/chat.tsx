import Head from 'next/head'
import { useState } from 'react'
import { useGenerateResult } from '@/hooks/useGenerateResult'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

interface MsgInfo {
  role: string
  msg: string
}

const parseMarkdown = (text: string, streaming = false) => {
  text = text.trim()
  let cursorAdded = false
  // workaround for incomplete code, closing the block if it's not closed
  // First, count occurrences of "```" in the text
  const codeBlockCount = (text.match(/```/g) || []).length
  // If the count is odd and the text doesn't end with "```", add a closing block
  if (codeBlockCount % 2 === 1 && !text.endsWith('```')) {
    if (streaming) {
      text += '█\n```'
      cursorAdded = true
    } else {
      text += '\n```'
    }
  }
  if (codeBlockCount) {
    // make sure the last "```" is on a newline
    text = text.replace(/```$/, '\n```')
  }
  if (streaming && !cursorAdded) {
    text += '█'
  }

  // convert to markdown
  let parsed = marked.parse(text)
  // format Bing's source links more nicely
  // 1. replace "[^1^]" with "[1]" (during progress streams)
  parsed = parsed.replace(/\[\^(\d+)\^]/g, '<strong>[$1]</strong>')
  // 2. replace "^1^" with "[1]" (after the progress stream is done)
  parsed = parsed.replace(/\^(\d+)\^/g, '<strong>[$1]</strong>')

  return DOMPurify.sanitize(parsed)
}

export default function Chat() {
  const [msgList, setMsgList] = useState<MsgInfo[]>([]);
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const { generatedResults, generate } = useGenerateResult()
  
  const send = async () => {
    if (loading) {
      return;
    }
    const list = [...msgList]
    setLoading(true)
    list.push({
      role: 'user',
      msg: inputValue
    })
    setMsgList(list)
    setInputValue('')
    // 请求
    await generate({ userInput: inputValue })
    list.push({
      role: 'assistant',
      msg: generatedResults
    })
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>AI-TOOLS</title>
        <meta name="description" content="AI工具集" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className='pt-8 md:pt-14 lg:pt-24 px-8 md:px-28 lg:px-36'>
        <p className='text-3xl font-medium mb-1'>ChatGPT</p>
        <p className='text-gray-500'>Talk to ChatGPT</p>
        <div className='py-8'>
          {
            msgList?.map((item: MsgInfo, index: number) => {
              return item.role === 'user' ? <div className='flex justify-end gap-2 items-start my-4' key={index}>
                <div className='p-3 rounded-b-lg rounded-tl-lg overflow-auto bg-green-300 text-gray-900 ml-8'>
                  <p>{item.msg}</p>
                </div>
                <div>
                  <img className='w-7 h-7 rounded-full mx-auto border max-w-none' src="/user.svg" alt="" />
                </div>
              </div> : <div className='flex justify-start gap-2 items-start py-1 my-4' key={index}>
                <div>
                  <img className='w-7 h-7 rounded-full mx-auto border max-w-none' src="/robot.svg" alt="" />
                </div>
                <div className='p-3 rounded-b-lg rounded-tr-lg overflow-auto bg-gray-200 text-gray-900 mr-8'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(item.msg),
                    }}></div>
                </div>
              </div>
            })
          }
        </div>
        <div className='relative'>
          <textarea
            placeholder='你有什么想问我的？'
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                send()
                e.preventDefault();
              }
            }}
            className='shadow-md w-full rounded-md py-2 pr-10 pl-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-300 sm:leading-6 outline-none'
          ></textarea>
          <img
            onClick={() => send()}
            className='cursor-pointer w-6 absolute inset-y-0 right-2 top-5 flex items-center'
            src={loading ? '/loading.svg' : '/send.svg'}
            alt=""
          />
        </div>
      </main>
    </>
  )
}
