import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const Meeting = dynamic(()=>import("./Meeting"),{
  loading: ()=><Skeleton className="w-full h-[80vh]"/>
})
export const metadata: Metadata = {
  title:'Cuộc họp',
  description:'Meeting Page'
}

export default function MeetingPage() {
  return (
    <Meeting/>
  )
}
