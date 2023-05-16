import { CourierClient } from '@trycourier/courier'

async function getData() {
    const courier = CourierClient({ authorizationToken: process.env.courier_auth_token })
    const list = await courier.lists.getSubscriptions(process.env.COURIER_LIST_ID);
    console.log(list);
    return list
}

export default async function Home() {
  const data = await getData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
            <h1>Number of Entries</h1>
            <p>{ data.items.length }</p>
            <h1>List of Raffle Entries</h1>
            <pre>
                { JSON.stringify(data, null, 2)}
            </pre>
            <ol>
            { data.items.forEach(item => (<li>{ item.recipient }</li>)) }
            </ol>
           
        </div>
    </main>
  )
}
