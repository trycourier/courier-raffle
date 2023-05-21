import { NextResponse } from 'next/server';
import { CourierClient } from '@trycourier/courier'
import { createHash } from 'node:crypto'

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
  // Add the user to our List
  await courier.lists.subscribe(process.env.COURIER_LIST_ID, recipientId);
  // Send an in-app toast and Inbox notification to this website
  await courier.send({
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
  // return a 200 OK to Twilio
  const data = {status: "OK"}
 
  return NextResponse.json(data);
}