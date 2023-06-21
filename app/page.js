import Image from 'next/image'
import Inbox from './inbox'
import crypto from 'crypto'
import { kv } from '@vercel/kv'

async function getUserSignature() {
  //console.log(process.env.COURIER_AUTH_TOKEN, process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY)
  return crypto
    .createHmac("sha256", process.env.COURIER_AUTH_TOKEN)
    .update(process.env.NEXT_PUBLIC_COURIER_USER)
    .digest("hex")
}

async function getEmailAndPhone() {
  //console.log("getEmailAndPhone")
  let email = await kv.get('email_address')
  let sms = await kv.get('sms_number')
  //console.log(email, sms)
  return { email, sms } 
}

export default async function Home() {
  // console.log("Home")
  const userSignature = await getUserSignature()
  const { email, sms } = await getEmailAndPhone()
  //console.log("page", userSignature)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div><a href="/raffle">View Raffle Entries</a></div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Inbox userSignature={userSignature}/>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <span className="text-6xl text-purple-600">{ sms || process.env.NEXT_PUBLIC_SMS_NUMBER }</span>
      <div style={{margin: "20px"}}></div>
      <span className="text-6xl text-red-600">{ email || process.env.NEXT_PUBLIC_EMAIL_ADDRESS }</span>
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://courier.com/?utm_source=courier-raffle&utm_medium=code-template&utm_campaign=devrel-apps"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Sign-up{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Sign up and get 10k messages/month for free
          </p>
        </a>

        <a
          href="https://courier.com/docs?utm_source=courier-raffle&utm_medium=code-template&utm_campaign=devrel-apps"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            API reference docs
          </p>
        </a>

        <a
          href="https://courier.com/integrations?utm_source=courier-raffle&utm_medium=code-template&utm_campaign=devrel-apps"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Integrations{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Full list of SMS, email and eventing integrations
          </p>
        </a>

        <a
          href="https://courier.com/changelog?utm_source=courier-raffle&utm_medium=code-template&utm_campaign=devrel-apps"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Changelog{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            See what we&apos;ve fixed and what we&apos;ve shipped every week
          </p>
        </a>
      </div>
    </main>
  )
}
