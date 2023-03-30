import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>AI-INTERVIEW</title>
        <meta name="description" content="AI模拟面试" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className='pt-12 md:pt-24 lg:pt-32'>
        <p className={' text-5xl md:text-6xl lg:text-7xl text-center mb-8'}>AI模拟面试</p>
        <div className='px-10 md:px-32 lg:px-72'>
          <div 
            onClick={() => router.push('/chat/html')}
            className='cursor-pointer flex p-4 justify-between items-center col-span-1 rounded-lg bg-white shadow  border mb-4'
          >
            <div>
              <p className='text-xl font-medium mb-1'>HTML面试题集</p>
            </div>
            <img className='w-12' src="/html.svg" alt="" />
          </div>
          <div
            onClick={() => router.push('/chat/css')}
            className='cursor-pointer flex p-4 justify-between items-center col-span-1 rounded-lg bg-white shadow  border mb-4'
          >
            <div>
              <p className='text-xl font-medium mb-1'>CSS面试题集</p>
            </div>
            <img className='w-12' src="/css.svg" alt="" />
          </div>
          <div 
            onClick={() => router.push('/chat/js')}
            className='flex p-4 justify-between items-center col-span-1 rounded-lg bg-white shadow  border mb-4'
          >
            <div>
              <p className='text-xl font-medium mb-1'>JavaScript面试题集</p>
            </div>
            <img className='w-12' src="/javascript.svg" alt="" />
          </div>
          <div
            onClick={() => router.push('/chat/vue')}
            className='cursor-pointer flex p-4 justify-between items-center col-span-1 rounded-lg bg-white shadow  border mb-4'
          >
            <div>
              <p className='text-xl font-medium mb-1'>Vue面试题集</p>
            </div>
            <img className='w-12' src="/vue.svg" alt="" />
          </div>
          <div
            onClick={() => router.push('/chat/react')}
            className='cursor-pointer flex p-4 justify-between items-center col-span-1 rounded-lg bg-white shadow  border mb-4'
          >
            <div>
              <p className='text-xl font-medium mb-1'>React面试题集</p>
            </div>
            <img className='w-12' src="/react.svg" alt="" />
          </div>
        </div>
      </main>
    </>
  )
}
