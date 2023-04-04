import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(20, '1 d'),
  analytics: true,
})

export const config = {
  matcher: '/api/chat',
}

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  const ipIdentifier = request.ip ?? '127.0.0.1'
  console.log('ip is ->', ipIdentifier)
  const { success, limit, reset, remaining, pending } = await ratelimit.limit(
    `ratelimit_middleware_${ipIdentifier}`
  )
  event.waitUntil(pending)

  console.log(`ip free user ${ipIdentifier}, remaining: ${remaining}`)
  if (!success) {
    return runOutOfRatelimit(429)
  } else {
    const res = NextResponse.next()
    res.headers.set('X-RateLimit-Limit', limit.toString())
    res.headers.set('X-RateLimit-Remaining', remaining.toString())
    res.headers.set('X-RateLimit-Reset', reset.toString())

    return res
  }
}

function runOutOfRatelimit(errorCode: number) {
  return new NextResponse(JSON.stringify({ success: false, message: '' }), {
    status: errorCode,
    headers: { 'content-type': 'application/json' },
  })
}
