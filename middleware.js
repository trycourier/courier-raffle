import { NextResponse } from 'next/server'
 
function decode(authHeader) {
  let decoded
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ')
    const buffer = Uint8Array.from(atob(encoded), (character) =>
      character.charCodeAt(0)
    )
    decoded = new TextDecoder().decode(buffer).normalize()
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