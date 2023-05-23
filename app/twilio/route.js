import { NextResponse } from 'next/server';
import { CourierClient } from '@trycourier/courier'
import { createHash } from 'crypto'

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
        body: 'Thank you for entering the Courier raffle at Shift Miami 2023! Stop by our booth to learn more about our platform for sending notifications that users love or visit: https://bit.ly/3WtDe5x',
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