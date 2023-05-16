'use client';

import { CourierProvider } from "@trycourier/react-provider";
import { Inbox } from "@trycourier/react-inbox";
import { Toast } from "@trycourier/react-toast";

export default function () {  
    return (
        // TODO: NEED TO SECURE THIS!!!!!
        <CourierProvider userId={process.env.NEXT_PUBLIC_COURIER_USER} clientKey={process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY}>
            <Inbox/>
            <Toast/>
        </CourierProvider>
    );
  }

