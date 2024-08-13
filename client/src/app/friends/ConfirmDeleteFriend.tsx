'use client'
import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { deleteFriend } from '@/Services/friend.api';
import { leftRoom } from '@/Services/user_join.api';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from 'flowbite-react'
import { useParams } from 'next/navigation';
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { HiOutlineExclamationCircle } from "react-icons/hi";
interface Props{
    openModal:boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    friend_id:number;
    display_name:string;
}

export default function ConfirmDeleteFriend({openModal, setOpenModal, friend_id, display_name }:Props) {
    const { user_id } = useContext(AppContext);
    const {toast} = useToast();
    const queryClient = useQueryClient();
    const [isLoading, setLoading] = useState<boolean>(false);
    console.log(friend_id);
    const handleLeftMeeting = async () => {
        setLoading(true);
        if(!user_id || !friend_id){
            toast({
                title:"Các trường là bắt buộc",
                variant:"destructive"
            });
            return;
        }
        await deleteFriend(Number(user_id), friend_id, 1)
        .then((data)=>{
            toast({
                title:"Đã hủy kết bạn với " + display_name
            })
            queryClient.invalidateQueries({queryKey:["list_friend_1"]});
            setOpenModal(false)
        })
        .catch((err)=>{
            toast({
                title:"Lỗi: " + err.message,
                variant:"destructive"
            })
        })
        .finally(()=>{
            setLoading(false);
        })
    };
  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
    <Modal.Header />
    <Modal.Body>
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Bạn có chắc muốn hủy kết bạn với {display_name}
            </h3>
            <div className="flex justify-center gap-4">
                <Button color="gray" onClick={() => setOpenModal(false)}>
                    Hủy
                </Button>
                <Button disabled={!user_id || !friend_id} isProcessing={isLoading} color="failure" onClick={handleLeftMeeting}>
                    Đồng ý
                </Button>
            </div>
        </div>
    </Modal.Body>
    </Modal>
  )
}
