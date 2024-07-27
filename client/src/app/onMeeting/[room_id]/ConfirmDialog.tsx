'use client'
import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { leftRoom } from '@/Services/user_join.api';
import { Button, Modal } from 'flowbite-react'
import { useParams } from 'next/navigation';
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { HiOutlineExclamationCircle } from "react-icons/hi";
interface Props{
    openModal:boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    id:number;
}

export default function ConfirmDialog({openModal, setOpenModal, id}:Props) {
    const { user_id, socket} = useContext(AppContext);
    const {room_id} = useParams();
    const {toast} = useToast();
    const [isLoading, setLoading] = useState<boolean>(false);
    const handleLeftMeeting = async () => {
        if(socket){
            setLoading(true);
            if(user_id && id)
            await leftRoom(Number(user_id), id)
            .then((data)=>{
                socket.emit("user-left", user_id,room_id);
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
        }
        
    };
  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
    <Modal.Header />
    <Modal.Body>
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Bạn có chắc chắn muốn rời phòng họp không
            </h3>
            <div className="flex justify-center gap-4">
                <Button color="gray" onClick={() => setOpenModal(false)}>
                    Hủy
                </Button>
                <Button isProcessing={isLoading} color="failure" onClick={handleLeftMeeting}>
                    Rời khỏi
                </Button>
            </div>
        </div>
    </Modal.Body>
    </Modal>
  )
}
