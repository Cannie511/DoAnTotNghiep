'use client'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { useToast } from '@/components/ui/use-toast';
import { findRoom } from '@/Services/room.api';
import { Button } from 'flowbite-react'
import { ChangeEvent, useState } from 'react';
import { IoSearch } from "react-icons/io5";

export default function SearchInput() {
    const [value,setValue] = useState<string>('');
    const {toast} = useToast();
    const onSubmit = async (e:ChangeEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!value) return;
        if(value.length < 9) return;
        await findRoom(Number(value))
        .then((data)=>{
            const url = `/onMeeting/${value}`;
            window.open(url, '_blank');
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
    <div className='m-2 space-y-3 '>
        <h1 className='text-2xl'>Nhập mã phòng họp tại đây</h1>
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
            <Button type='submit' size={"sm"}><IoSearch className='text-xl'/></Button>
        </form>
    </div>
  )
}
