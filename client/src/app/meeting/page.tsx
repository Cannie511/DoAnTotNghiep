import { Metadata } from "next";
import Meeting from "./Meeting";

export const metadata: Metadata = {
  title:'Cuộc họp',
  description:'Meeting Page'
}

export default function MeetingPage() {
  return (
    <Meeting/>
  )
}
