'use client'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { useToast } from '@/components/ui/use-toast';
import { findRoom } from '@/Services/room.api';
import { Button } from 'flowbite-react'
import { ChangeEvent, useContext, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import ModalPassword from './ModalPassword';
import { AppContext } from '@/Context/Context';
import CreateRoom from './createRoom';
import '@/styles/login.css';

export default function SearchInput() {
    const {user_id} = useContext(AppContext);
    const [value,setValue] = useState<string>('');
    const [roomID, setRoomID] = useState<number>();
    const [isPassword, setIsPassword] = useState<boolean>(false);
    const {toast} = useToast();
    const onSubmit = async (e:ChangeEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!value) return;
        if(value.length < 9) return;
        await findRoom(Number(value))
        .then((data:any)=>{
            setRoomID(data.data?.id);
            if(data.data?.Password && data?.data.Host_id !== user_id){
                setIsPassword(true);
            }
            else{
                const url = `/onMeeting/${value}`;
                window.open(url, '_blank');
                setValue('');
            }
        })
        .catch((err)=>{
            if(err.response.status === 422){
                toast({
                    title:"Không tìm thấy phòng!",
                    variant:"destructive"
                })
            }
            else {
                console.log(err.message);
                return;
            }
        })
        
    }
  return (
    <div className='m-2 w-full h-[20rem] mt-24 flex items-center justify-center'>
        <div className='w-[35rem] flex flex-col space-y-3 bg-gray-200 items-center justify-center dark:bg-gray-700 rounded-md p-5 mt-20'>
            <h1 className='text-2xl'>Nhập mã phòng họp tại đây</h1>
            <div className='text-gray-400 text-lg'>Mã phòng gồm 9 số, ví dụ: 123-456-789</div>
            <form className='flex space-x-2' onSubmit={onSubmit}>
                <InputOTP maxLength={9}
                value={value}
                onChange={(value) => setValue(value)}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                    <InputOTPSlot index={8} />
                </InputOTPGroup>
                </InputOTP>
                <Button type='submit' className='w-10 h-10'><IoSearch className='text-xl'/></Button>
            </form>
            <div className="line-container w-1/2 my-10">
                hoặc
            </div>
            <CreateRoom/>
        </div>
        
        <ModalPassword openModal={isPassword} setOpenModal={setIsPassword} room_id={roomID} room_key={Number(value)}/>
    </div>
  )
}
