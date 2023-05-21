import { NextResponse } from 'next/server'
 
function decode(authHeader) {
  let decoded
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ')
    decoded = Buffer.from(encoded, 'base64').toString()
  }
  return decoded
}

export function middleware(request) {
    const authHeader = request.headers.get('authorization')
    const decoded = decode(authHeader)
    if (decoded === process.env.WEBHOOK_AUTH) {
      return NextResponse.next()
    }
    else {
      const response = NextResponse.json({}, {status: 401})
      response.headers.set('www-authenticate', 'Basic realm="Secure Area"')
      return response
    }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/postmark', '/twilio'],
};