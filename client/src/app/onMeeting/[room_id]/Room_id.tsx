'use client'
import { AppContext } from "@/Context/Context";
import { url_img_default } from "@/images/image";
import { Avatar } from "flowbite-react";
import { motion } from "framer-motion"
import { MutableRefObject, useContext, useEffect, useRef, useState } from "react";

interface Props{
  x:number;
  y:number;
  video: boolean;
  audio: boolean;
  stream: MediaStream | null;
}
export default function RoomID({x, y, video, audio, stream}:Props) {
  const {user_data} = useContext(AppContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const propsX = Number(x) - 372;
  const propsY = Number(y) - 222;
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <motion.div
      className="overflow-hidden fixed w-[22rem] h-[200px] bg-gray-700 rounded-xl flex justify-center items-center cursor-move"
      drag
      initial={{ x: 3000, y: 1000 }}
      animate={{ x: propsX, y: propsY }}
      dragConstraints={{
        top: 0,
        left: 0,
        right: propsX,
        bottom: propsY,
      }}
    >
      {(video || (video && audio)) ? (
        <video
          className='mt-2 w-96 rounded-2xl'
          ref={videoRef}
          autoPlay
          playsInline
        />
      ) : (
        <Avatar
          size={"lg"}
          img={user_data?.avatar || url_img_default}
          rounded
          bordered
          color="success"
        />
      )}
    </motion.div>
  );
}
