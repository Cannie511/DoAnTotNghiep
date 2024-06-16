import { Metadata } from "next";
import Chat from "./Chat";

export const metadata: Metadata = {
  title:'Trò chuyện',
  description:'Login Page'
}

export default function MessagePage() {
  return(
    <>
      <Chat/>
    </>
  )
}
