This is a [Next.js](https://nextjs.org/) project that is integrated with [Courier](https://courier.com).

## Prerequisites

In order to run this app, you'll need a [Courier](https://courier.com/?utm_source=courier-raffle&utm_medium=code-template&utm_campaign=devrel-apps) account.

## Getting Started

Clone the repo and install dependencies:

```bash
npm install
```

Create a `.env.local` file at the root of the project to store secrets and configuration for this app.


## Configure Courier Account

[Log-in](https://app.courier.com/?utm_source=courier-raffle&utm_medium=code-template&utm_campaign=devrel-apps) to your Courier Account and go to Settings / API Keys. Copy the Production API key and store it as an envvar:

`COURIER_AUTH_TOKEN=pk_prod_xxx`

Go to Users and select (or create) a user that we can use to power the notifications and toasts for the web app. Copy the user's ID and store it as an envvar:

`NEXT_PUBLIC_COURIER_USER=abc`

Go to Channels, scroll to SMS and select the Twilio provider. Configure it using your Twilio Account SID, Auth Token and a From phone number or Messaging Service SID. Click Save.

Go back to Channels, scroll to email and select the Postmark provider. Configure it using a Server Token, From email address and Message Stream. Click Save.

Go back to Channels, scroll to "other" and install the Courier provider. Copy the Client Key (Public) and store it as an envvar:

`NEXT_PUBLIC_COURIER_CLIENT_KEY=zzz`

Go to Users and click "+ List" to create a new list. Name it whatever you like. Copy the list ID and store it as an envvar:

`COURIER_LIST_ID=yyy`


## Configure webhooks

Define a username and password to use to secure your Twilio and Postmark webhooks and store it as an envvar:

`WEBHOOK_AUTH=username:password`

Configure your Twilio webhook to use the username and password by specifying a URL like this:

`https://username:password@your.domain.com/twilio`

Configure your Postmark webhook in the same way. 


