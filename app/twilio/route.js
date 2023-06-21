import { NextResponse } from 'next/server';
import { CourierClient } from '@trycourier/courier'
import { createHash } from 'crypto'
import { kv } from '@vercel/kv'

const courier = CourierClient({ authorizationToken: process.env.courier_auth_token })

export async function POST(request) {
  // get phone number and body from webhook payload
  const params = await request.formData()
  const phoneNumber = params.get('From')
  const name = params.get('Body')
  // create a unique id for this user based on their phone number
  const recipientId = createHash('sha3-256').update(phoneNumber).digest('hex')
  // create a Profile for this user
  await courier.mergeProfile({
    recipientId, 
    profile: { 
      phone_number: phoneNumber, 
      phone_number_verified: true,
      name
    } 
  })
  let list = await kv.get('list')
  // Add the user to our List
  await courier.lists.subscribe(list || process.env.COURIER_LIST_ID, recipientId);
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
  // Send a reply to the user letting them know we've recieved their entry
  await courier.send({
    message: {
      to: {
        user_id: recipientId
      },
      content: {
        body: 'Thank you for entering the Courier raffle! Check out our developer docs to learn more about how Courier works: https://courier.com/docs',
      },
      routing: {
        method: 'single',
        channels: ['sms'],
      }
    }
  })
  
  // return a 200 OK to Twilio
  const data = {status: "OK"}
 
  return NextResponse.json(data);
}