import Head from 'next/head'
import { useRouter } from 'next/router'
import localFont from 'next/font/local'

const myFont = localFont({ src: './Space.otf' })

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>AI-TOOLS</title>
        <meta name="description" content="AI工具集" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className='pt-12 md:pt-24 lg:pt-32'>
        <p className={myFont.className + ' text-5xl md:text-6xl lg:text-7xl text-center mb-8'}>CHAT & CREATE</p>
        <div className='px-10 md:px-32 lg:px-72'>
          <div 
            onClick={() => router.push('/chat')}
            className='cursor-pointer flex p-4 justify-between items-center col-span-1 rounded-lg bg-white shadow  border mb-4'
          >
            <div>
              <p className='text-xl font-medium mb-1'>ChatGPT</p>
              <p className='text-gray-500'>Talk to ChatGPT</p>
            </div>
            <img src="/chat.svg" alt="" />
          </div>
          <div
            onClick={() => router.push('/draw')}
            className='cursor-pointer flex p-4 justify-between items-center col-span-1 rounded-lg bg-white shadow  border mb-4'
          >
            <div>
              <p className='text-xl font-medium mb-1'>Draw</p>
              <p className='text-gray-500'>Draw with AI</p>
            </div>
            <img src="/draw.svg" alt="" />
          </div>
          <div className='flex p-4 justify-between items-center col-span-1 rounded-lg bg-white shadow  border'>
            <div>
              <p className='text-xl font-medium mb-1'>更多功能</p>
              <p className='text-gray-500'>敬请期待...</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
