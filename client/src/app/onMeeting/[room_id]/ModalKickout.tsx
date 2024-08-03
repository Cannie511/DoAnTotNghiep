'use client'
import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { leftRoom } from '@/Services/user_join.api';
import { Button, Modal } from 'flowbite-react'
import { useParams } from 'next/navigation';
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import { FaRegFaceSadTear } from "react-icons/fa6";
interface Props{
    openModal:boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    id:number;
}

export default function ModalKickOut({openModal, setOpenModal, id}:Props) {
    const { user_id, socket} = useContext(AppContext);
    const {room_id} = useParams();
    const {toast} = useToast();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(5);
    const handleLeftMeeting = useCallback(async () => {
        if(socket){
            setLoading(true);
            if(user_id && id)
            await leftRoom(Number(user_id), Number(id))
            .then(()=>{
                socket.emit("user-left", user_id, room_id);
                setOpenModal(false);
                window.close();
            })
            .catch((err)=>{
                toast({
                    title:"Lỗi hệ thống: " + err.message + " !!!",
                    variant:"destructive"
                })
                setOpenModal(false);
            })
            .finally(()=>{
                setLoading(false);
            })
            else
            toast({
                title:"Missing requirement"
            })
        }
    },[id, room_id, setOpenModal, socket, toast, user_id]);
    useEffect(() => {
        let handleLeft: NodeJS.Timeout;
        let handleCount: NodeJS.Timeout;

        if (openModal) {
             handleLeft = setTimeout(() => {
                handleLeftMeeting();
            }, 5000);

             handleCount = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(handleCount);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => {
                clearTimeout(handleLeft);
                clearInterval(handleCount);
            };
        }
    }, [handleLeftMeeting, openModal]);

  return (
    <Modal show={openModal} size="md" popup>
    <Modal.Body>
        <div className="text-center mt-5">
            <FaRegFaceSadTear className="mx-auto mb-4 h-14 w-14 text-yellow-400 dark:text-yellow-200" />
            <h3 className="mb-5 text-xl font-normal text-gray-500 dark:text-gray-400 flex">
               Bạn đã bị chủ phòng mời ra khỏi phòng họp !
            </h3>
            <div className="flex justify-center gap-4">
                <Button isProcessing={isLoading} color="failure"  className='w-full' onClick={handleLeftMeeting}>
                    Rời khỏi phòng họp (tự động rời sau {timeLeft}s)
                </Button>
            </div>
        </div>
    </Modal.Body>
    </Modal>
  )
}
