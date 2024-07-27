'use client'

import { useToast } from '@/components/ui/use-toast';
import { checkRoomPassword } from '@/Services/room.api';
import { Button, Label, Modal, TextInput } from 'flowbite-react'
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

interface Props{
    openModal: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    room_id:number | undefined;
    room_key:number;
}

export default function ModalPassword({openModal, setOpenModal, room_id, room_key}:Props) {
    const [password, setPassword] = useState<string>('');
    const [errMessage, setErrMessage] = useState<string>('');
    const {toast} = useToast();
    const onSubmit = async(e:ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!room_id) {
            console.log("thiếu room id");
            return;
        };
        await checkRoomPassword(room_id, password)
        .then((data)=>{
            const url = `/onMeeting/${room_key}`;
            window.open(url, '_blank');
            setPassword('')
            setOpenModal(false);
        })
        .catch((err)=>{
            if(err.response.status === 422){
                setErrMessage("Sai mật khẩu!!!");
                return
            }
            toast({
                title:"Lỗi hệ thống!!!",
                variant:"destructive"
            })
        })
    }
  return (
    <Modal show={openModal} size={"md"} popup onClose={() => setOpenModal(false)}>
        <Modal.Header />
        <Modal.Body className='space-y-5'>
            <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">Phòng họp yêu cầu mật khẩu</h3>
            <form onSubmit={onSubmit} className='mt-2'>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password" value="Mật khẩu phòng họp" />
                    </div>
                    <TextInput id="password" value={password} placeholder='Mật khẩu phòng họp . . .' 
                    helperText={errMessage} color={errMessage ? "failure" : "gray"}
                    onChange={(e)=>setPassword(e.target.value)} type="password" />
                </div>
                <Button className='w-full mt-2' type='submit'>Xác Nhận</Button>
            </form>
        </Modal.Body>
    </Modal>
  )
}
