
import MotionBackground from "./MotionBackground";
import type { Metadata } from 'next'
import { formatRoomKey } from "@/Utils/formatDate";
import IndexPage from "../test";
 
type Props = {
  params: { room_id: string }
}
 
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const id = params.room_id
  return {
    title: `Phòng họp: ${formatRoomKey(id)}`,
  }
}
const Room_id = () =>{
    return(
      <MotionBackground/>
      //<IndexPage/>
    )
}
export default Room_id;