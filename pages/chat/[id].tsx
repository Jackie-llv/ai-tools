import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useGenerateResult } from '@/hooks/useGenerateResult'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'


type MsgInfo = {
  content: string
  role: string
}

const prompts = {
  html: '你现在是一个前端面试官，接下来我们来模拟面试，现在请你问我前端面试题中html相关的面试题，如果你认为我回答正确，那么就给一个正面的回答并且继续问下一道，如果回答错了，那么请纠正，并告诉我正确答案，然后再继续下一道。如果我表示我不知道答案，那么你就直接告诉我，然后问下一道题，接下来就直接开始，请你出第一道题（注意：接下来的过程中问的所有的题都只是html阶段的题）'
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

export default function Chat() {
  const router = useRouter()
  const { id } = router.query

  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendMsg, setSendMsg] = useState<string[]>([])
  const [msgList, setMsgList] = useState<MsgInfo[]>([])
  const { generatedResults, generate } = useGenerateResult()

  useEffect(() => {
    if (loading) return
    setLoading(true)
    generate([
      { role: 'system', content: '你现在是一个前端面试官，接下来我们来模拟面试，现在请你问我前端面试题中html相关的面试题，如果你认为我回答正确，那么就给一个正面的回答并且继续问下一道，如果回答错了，那么请纠正，并告诉我正确答案，然后再继续下一道。如果我表示我不知道答案，那么你就直接告诉我，然后问下一道题，接下来就直接开始，请你出第一道题（注意：接下来的过程中问的所有的题都只是html阶段的题）'}
    ]).then(() => {
      setTimeout(() => {
        console.log(generatedResults);
        setMsgList([
          { role: 'system', content: '你现在是一个前端面试官，接下来我们来模拟面试，现在请你问我前端面试题中html相关的面试题，如果你认为我回答正确，那么就给一个正面的回答并且继续问下一道，如果回答错了，那么请纠正，并告诉我正确答案，然后再继续下一道。如果我表示我不知道答案，那么你就直接告诉我，然后问下一道题，接下来就直接开始，首先你先做一个自我介绍，说你是前端面试官，然后就请你出第一道题（注意：接下来的过程中问的所有的题都只是html阶段的题）'},
          { role: 'assistant', content: generatedResults[generatedResults.length - 1] }
        ])
        setLoading(false);
      }, 0)
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
    // 请求
    await generate(list)
    list.push({ role: 'assistant', content: generatedResults[generatedResults.length - 1] })
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
      <main className='pt-8 pb-8 md:pt-14 lg:pt-24 px-8 md:px-28 lg:px-36'>
        <p className='text-3xl font-medium mb-1'>ChatGPT</p>
        <p className='text-gray-500'>Talk to ChatGPT</p>
        <div className='py-8'>
          {
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
          }
          {/* {
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
                  <div className='flex justify-start gap-2 items-start py-1 my-4'>
                    <div>
                      <img className='w-7 h-7 rounded-full mx-auto border max-w-none' src="/robot.svg" alt="" />
                    </div>
                    <div className='p-3 rounded-b-lg rounded-tr-lg overflow-auto bg-gray-200 text-gray-900 mr-8'>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(generatedResults[index]),
                        }}></div>
                    </div>
                  </div>
                </>

              )
            })
          } */}
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
