import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useGenerateResult } from '@/hooks/useGenerateResult'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
// import type { GetServerSideProps } from 'next'

type MsgInfo = {
  content: string
  role: string
}

// export const getServerSideProps: GetServerSideProps<{ id: string }> = async ({ params }) => {
//   const id = params?.id

//   if (!id) {
//     return { notFound: true } as any
//   }

//   return {
//     props: {
//       id,
//     },
//   }
// }

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
      { role: 'system', content: `在前端面试中，一般是面试官会不断的问一些前端相关的面试题，面试者进行回答，如果回答正确，面试官就开始问下一道题，如果回答错误，面试官就会给一个反馈并说出正确答案，然后直接开始问下一道问题。每次提问都需要一道题一道通的问，不能一下子问好几个问题。那么现在你是一个前端面试官，我是面试者，接下来我们就开始来模拟面试`},
      { role: 'user', content: `接下来请开始面试`}
    ]).then(() => {
      setTimeout(() => {
        setMsgList([
          { role: 'system', content: `在前端面试中，一般是面试官会不断的问一些前端相关的面试题，面试者进行回答，如果回答正确，面试官就开始问下一道题，如果回答错误，面试官就会给一个反馈并说出正确答案，然后直接开始问下一道问题。每次提问都需要一道题一道通的问，不能一下子问好几个问题。那么现在你是一个前端面试官，我是面试者，接下来我们就开始来模拟面试`},
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
    const list = [...msgList] // 1-s 2-u 3-a 4-u 5-a 6-u 7-a
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
        <title>AI-INTERVIEW</title>
        <meta name="description" content="AI模拟面试" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className='pt-8 pb-8 md:pt-14 lg:pt-24 px-8 md:px-28 lg:px-36'>
        <p className='text-3xl font-medium mb-1'>AI面试</p>
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
