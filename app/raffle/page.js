export const dynamic = 'force-dynamic'

import { kv } from '@vercel/kv'
import { CourierClient } from '@trycourier/courier'

// a recursive function to get all Subscribers to a List, potentially iterating over a cursor for very long lists
async function getSubscribers(client, cursor) {
  let list = await kv.get('list')
  const response = await client.lists.getSubscriptions(list || process.env.COURIER_LIST_ID, { cursor });
  if (response.more) {
    return response.items.concat(getSubscribers(client, response.cursor))
  }
  else {
    return response.items
  }
}

// get all Subscribers to the List
async function getData() {
  //console.log(3)
  const client = CourierClient({ authorizationToken: process.env.courier_auth_token })
  const list = await getSubscribers(client, null)
  return list
}

// display the number of entries in the raffle, and the full-list of Subscribers to the List
export default async function Raffle() {
  const data = await getData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
            <h1 className={`mb-3 text-2xl font-semibold`}>Number of Entries</h1>
            <p>{ data.length }</p>
            <h1 className={`mb-3 text-2xl font-semibold`}>List of Raffle Entries</h1>
            <pre>
                { JSON.stringify(data, null, 2)}
            </pre>           
        </div>
    </main>
  )
}
