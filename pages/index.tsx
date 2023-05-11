import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useGenerateResult } from '@/hooks/useGenerateResult'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

type MsgInfo = {
  content: string
  role: string
}

const parseMarkdown = (text: string, streaming = false) => {  
  if (!text) {
    return '';
  }
  text = text?.trim()
  let cursorAdded = false
  const codeBlockCount = (text?.match(/```/g) || []).length
  if (codeBlockCount % 2 === 1 && !text?.endsWith('```')) {
    if (streaming) {
      text += '█\n```'
      cursorAdded = true
    } else {
      text += '\n```'
    }
  }
  if (codeBlockCount) {
    text = text?.replace(/```$/, '\n```')
  }
  if (streaming && !cursorAdded) {
    text += '█'
  }

  let parsed = marked.parse(text)
  parsed = parsed.replace(/\[\^(\d+)\^]/g, '<strong>[$1]</strong>')
  parsed = parsed.replace(/\^(\d+)\^/g, '<strong>[$1]</strong>')

  return DOMPurify.sanitize(parsed)
}

export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendMsg, setSendMsg] = useState<string[]>([`接下来请开始面试`])
  const [msgList, setMsgList] = useState<MsgInfo[]>([])
  const { generatedResults, generate } = useGenerateResult()

  useEffect(() => {
    if (loading) return
    
    setLoading(true)
    generate([
      { role: 'system', content: `假设你是一个前端面试官，我是候选人，在前端面试的过程中，面试官需要不断的向面试者提问，问题主要是一些常见的前端开发面试题，如果我回答不会或者不知道之类的意思，或者回答的不对，你需要将正确答案告诉我并且继续问下一道题，每个问题必须不一样。
        以下是一个实例：
        面试官：react中的key的作用是什么？
        接下来，我们就开始模拟面试。
    `},
      { role: 'user', content: `接下来请开始面试`}
    ]).then(() => {
      setTimeout(() => {
        setMsgList([
          { role: 'system', content: `假设你是一个前端面试官，我是候选人，在前端面试的过程中，面试官需要不断的向面试者提问，问题主要是一些常见的前端开发面试题，如果我回答不会或者不知道之类的意思，或者回答的不对，你需要将正确答案告诉我并且继续问下一道题，每个问题必须不一样。
            以下是一个实例：
            面试官：react中的key的作用是什么？
            接下来，我们就开始模拟面试。
          `},
          { role: 'user', content: `接下来请开始面试`},
          { role: 'assistant', content: generatedResults[generatedResults.length - 1] }
        ])
        setLoading(false);
      }, 0)
    }).finally(() => {
      setLoading(false);
    })
  }, [])
  
  const send = async () => {
    if (loading) {
      return;
    }
    const msgs = [...sendMsg] 
    const list = [...msgList]
    setLoading(true)
    msgs.push(inputValue)
    list.push({ role: 'user', content: inputValue })
    setSendMsg(msgs)
    setInputValue('')
    // 反馈
    await generate(list)
    list.push({ role: 'assistant', content: generatedResults[generatedResults.length - 1] })
    console.log(generatedResults[generatedResults.length - 1])
    // list.push({ role: 'system', content: '请继续出题' })
    // 继续
    // await generate(list)
    setMsgList([...list])
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>黑马程序员AI模拟面试</title>
        <meta name="description" content="黑马程序员AI模拟面试" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='pt-8 pb-8 md:pt-14 lg:pt-24 px-8 md:px-28 lg:px-36'>
        <div>
          <img src="/logo.png" alt="" className='mb-4' />
          <span className='text-3xl font-medium mb-1'>黑马程序员AI模拟面试(测试)</span>
        </div>
        <div className='py-8'>
          {/* {
            generatedResults.map((item, index) => {
              return (
                <>
                  <div className='flex justify-start gap-2 items-start py-1 my-4'>
                    <div>
                      <img className='w-7 h-7 rounded-full mx-auto border max-w-none' src="/robot.svg" alt="" />
                    </div>
                    <div className='p-3 rounded-b-lg rounded-tr-lg overflow-auto bg-gray-200 text-gray-900 mr-8'>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(item),
                        }}></div>
                    </div>
                  </div>
                  {sendMsg[index] && <div className='flex justify-end gap-2 items-start my-4'>
                    <div className='p-3 rounded-b-lg rounded-tl-lg overflow-auto bg-green-300 text-gray-900 ml-8'>
                      <p>{sendMsg[index]}</p>
                    </div>
                    <div>
                      <img className='w-7 h-7 rounded-full mx-auto border max-w-none' src="/user.svg" alt="" />
                    </div>
                  </div>}
                </>
              )
            })
          } */}
          {
            sendMsg.map((item, index) => {
              return (
                <>
                  <div className='flex justify-end gap-2 items-start my-4'>
                    <div className='p-3 rounded-b-lg rounded-tl-lg overflow-auto bg-green-300 text-gray-900 ml-8'>
                      <p>{item}</p>
                    </div>
                    <div>
                      <img className='w-7 h-7 rounded-full mx-auto border max-w-none' src="/user.svg" alt="" />
                    </div>
                  </div>
                  {generatedResults[index] && <div className='flex justify-start gap-2 items-start py-1 my-4'>
                    <div>
                      <img className='w-7 h-7 rounded-full mx-auto border max-w-none' src="/robot.svg" alt="" />
                    </div>
                    <div className='p-3 rounded-b-lg rounded-tr-lg overflow-auto bg-gray-200 text-gray-900 mr-8'>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(generatedResults[index]),
                        }}></div>
                    </div>
                  </div>}
                </>
              )
            })
          }
        </div>
        <div className='relative'>
          <textarea
            placeholder='请输入你的答案'
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
