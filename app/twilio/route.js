import { NextResponse } from 'next/server';
import { CourierClient } from '@trycourier/courier'
import { createHash } from 'node:crypto'

const courier = CourierClient({ authorizationToken: process.env.courier_auth_token })

export async function POST(request) {
  // get phone number and body from webhook payload
  const params = await request.formData()
  const phoneNumber = params.get('From')
  const name = params.get('Body')
  console.log(phoneNumber, name)
  // create a Profile for this user
  const recipientId = createHash('sha3-256').update(phoneNumber).digest('hex')
  console.log(recipientId)
  const bar = await courier.mergeProfile({
    recipientId, 
    profile: { 
      phone_number: phoneNumber, 
      phone_number_verified: true,
      name
    } 
  })
  console.log(bar)
  // Add the user to our List
  const foo = await courier.lists.subscribe(process.env.COURIER_LIST_ID, recipientId);
  console.log(foo);
  // Send an in-app notification to the app's Inbox
  const baz = await courier.send({
    message: {
      to: {
        user_id: 'Google_113993807170956863837'
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
  console.log(baz)
  // return "OK" 
  const data = {status: "OK"}
 
  return NextResponse.json(data);
}