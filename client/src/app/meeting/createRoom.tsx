import { AppContext } from '@/Context/Context';
import { createRoom, getRoomKey } from '@/Services/room.api';
import { ScheduleInput } from '@/types/type';
import { formatRoomKey } from '@/Utils/formatDate';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, Label, TextInput, Tooltip } from 'flowbite-react'
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdChangeCircle } from "react-icons/md";

export default function CreateRoom() {
    const {user_id} = useContext(AppContext);
    
    const queryClient = useQueryClient();
    const [password, setPassword] = useState<boolean>(false);
    const {register, handleSubmit, reset} = useForm<ScheduleInput>()
    const { data:roomKey } = useQuery({
        queryKey:['create_new_key'],
        queryFn:()=>getRoomKey(),
        enabled: !!user_id,
    })
    const room_key:any = roomKey?.data;
    const genKey = () => {
        queryClient.invalidateQueries({queryKey:["create_new_key"]})
    }
    const onSubmit: SubmitHandler<ScheduleInput> = async(data)=>{
        const today = new Date();
        //console.log(user_id, today, data.password, room_key);
        await createRoom(user_id, today.toString(), data.password, room_key)
        .then((data:any)=>{
            const url = `/onMeeting/${data?.data?.data?.Room_key}`;
            genKey();
            reset();
            setPassword(false)
            window.open(url, '_blank');
        })
        .catch((err)=>{
            console.log(err)
        })
    }
  return (
    <div className='w-full h-[20rem] flex items-center justify-center'>
    <div className='w-[30rem] bg-gray-200 dark:bg-gray-700 rounded-md p-5 mt-20'>
        <h1 className='text-2xl font-bold'>Tạo phòng họp mới</h1>
        <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full'>
                <div className="my-2 block">
                    <Label htmlFor="roomKey" color="gray" value="ID phòng họp" />
                </div>
                <div className="flex items-center w-full">
                    <TextInput className='flex-auto' disabled={true} type='text' id="roomKey" placeholder="123-456-789" defaultValue={formatRoomKey(room_key || "")} color="gray" />
                    <Tooltip content="Tạo mã mới" onClick={genKey}>
                        <MdChangeCircle className='flex-none w-10 text-4xl ml-2 hover:text-gray-500 transition-all cursor-pointer' onClick={genKey}/>
                    </Tooltip>
                </div>
            </div>
            <div className='flex items-center gap-2 mt-2'>
                <Checkbox id="need_password" checked={password} onChange={(e)=>setPassword(e.target.checked ? true: false)}/>
                <Label htmlFor="need_password">Sử dụng mật khẩu cho phòng họp</Label>
            </div>
            {password && 
                <div className="w-full">
                    <div className="my-2 block">
                        <Label htmlFor="input-gray" color="gray" value="Mật khẩu phòng họp: " />
                    </div>
                    <TextInput 
                        {...register("password",{required:password})}
                        type='password'
                        placeholder='Nhập password vào đây...'
                    />
                </div>
            }
            
            <div className='mt-2 w-full text-end'>
                <Button className='w-full' type='submit'>Tạo phòng họp</Button>
            </div>
        </form>
    </div>
    </div>
  )
}
