
import { findRoom } from "@/Services/room.api";
import MotionBackground from "./MotionBackground";
import type { Metadata, ResolvingMetadata } from 'next'
import { formatRoomKey } from "@/Utils/formatDate";
 
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
    )
}
export default Room_id;