import { NextResponse } from 'next/server';
import { CourierClient } from '@trycourier/courier'
import { createHash } from 'node:crypto'

const courier = CourierClient({ authorizationToken: process.env.courier_auth_token })

export async function POST(request) {
  // get from email address and subject from Postmark webhook payload
  const params = await request.json()
  const fromEmail = params.From
  const name = params.Subject
  // create a unique id for this user based on their email address
  const recipientId = createHash('sha3-256').update(fromEmail).digest('hex')
  // create a Profile for this user
  await courier.mergeProfile({
    recipientId, 
    profile: { 
      email: fromEmail, 
      email_verified: true,
      name
    } 
  })
  // Add the user to our List
  await courier.lists.subscribe(process.env.COURIER_LIST_ID, recipientId);
  // Send an in-app toast and Inbox notification to this website
  await courier.send({
    message: {
      to: {
        user_id: process.env.NEXT_PUBLIC_COURIER_USER
      },
      content: {
        body: '{{ name }} has entered the raffle!',
      },
      routing: {
        method: 'single',
        channels: ['inbox'],
      },
      data: { 
        name
      }
    }
  })
  // return a 200 OK to Postmark
  const data = {status: "OK"}
 
  return NextResponse.json(data);
}