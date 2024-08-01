import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title:'Trò chuyện',
  description:'Login Page'
}
const Chat = dynamic(() => import('./Chat'), {
  ssr: false,
  loading: ()=><Skeleton className="w-full h-[80vh]"/>
});
export default function MessagePage() {
  return(
    <>
      <Chat/>
    </>
  )
}
