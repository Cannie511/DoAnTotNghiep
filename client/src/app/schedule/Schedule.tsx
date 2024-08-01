'use client'
import { calculateTimeDifference, combineDateTime, formatDate, formatRoomKey } from '@/Utils/formatDate';
import { Accordion, Button, Checkbox, Datepicker, Label, TextInput, Tooltip } from 'flowbite-react';
import React, { useContext, useEffect, useState } from 'react';
import TimeLine from './Timeline';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '@/Context/Context';
import { createSchedule, getSchedule } from '@/Services/schedule.api';
import { MdChangeCircle } from "react-icons/md";
import { SubmitHandler, useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { getRoomKey } from '@/Services/room.api';
import { ScheduleInput } from '@/types/type';

export default function Schedule() {
    const today = new Date();
    const queryClient = useQueryClient();
    const {toast} = useToast();
    const {user_id} = useContext(AppContext);
    const [password, setPassword] = useState<boolean>(false);
    const [date, setDate] = useState<string>(today.toString());
    const [time, setTime] = useState<string>('');
    const [errMessage, setErrMessage] = useState<string>('');
    const {register, handleSubmit, reset} = useForm<ScheduleInput>()
    const offSetDay = new Date(today);
    offSetDay.setDate(today.getDate() + 7);
    const handleTimeChange = (event: any) => {
        setTime(event.target.value);
    };
    const { data:schedule_60 } = useQuery({
        queryKey:['schedule_list'],
        queryFn:()=>getSchedule(user_id, 1440),
        enabled: !!user_id,
    })
    const { data:roomKey } = useQuery({
        queryKey:['room_key'],
        queryFn:()=>getRoomKey(),
        enabled: !!user_id,
    })
    const room_key:any = roomKey?.data;
    const genKey = () => {
        queryClient.invalidateQueries({queryKey:["room_key"]})
    }

    useEffect(()=>{
        setErrMessage('');
    },[date, time]);

    useEffect(() => {
        let formattedTime= '';
        const currentTime = new Date();
        const currentMinute = currentTime.getMinutes();
        const updatedTime = new Date(currentTime);
        updatedTime.setMinutes(currentMinute + 30);
        let hours = currentTime.getHours().toString().padStart(2, '0');
        const updatedMinutes = updatedTime.getMinutes().toString().padStart(2, '0');
        if(currentMinute >= 30){
            const hours_plus_1 = +hours + 1;
            formattedTime = `${hours_plus_1}:${updatedMinutes}`;
            setTime(formattedTime);
            return;
        }
        formattedTime = `${hours}:${updatedMinutes}`;
        setTime(formattedTime);
    }, []);
    
    const onSubmit: SubmitHandler<ScheduleInput> = async(data)=>{
        const scheduleDate = date;
        const dateDiff = calculateTimeDifference(scheduleDate, time);
        if(+dateDiff?.dateDiff === 0 && dateDiff?.timeDiff < 30){
            setErrMessage('Thời gian lịch phải lớn hơn 30 phút')
            return;
        }
        const combineTime = combineDateTime(date, time);
        await createSchedule(user_id, combineTime.toString(), data.password || "", Number(room_key))
        .then((data)=>{
            toast({
                title:"Tạo lịch họp thành công",
                description: `Bắt đầu lúc: ${formatDate(date, time)}`
            });
            queryClient.invalidateQueries({queryKey:["schedule_list"]})
            reset();
            setPassword(false);
            genKey();
        })
        .catch(err=>{
            console.log(err);
            toast({
                title:err.message,
                variant: "destructive"
            })
        })
    }
    return (
        <div>
            <Accordion className='w-2/4'>
                <Accordion.Panel>
                    <Accordion.Title>Lên lịch cuộc họp</Accordion.Title>
                    <Accordion.Content>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='w-2/4'>
                                <div className="my-2 block">
                                    <Label htmlFor="roomKey" color="gray" value="ID phòng họp" />
                                </div>
                                <div className="flex items-center">
                                    <TextInput id="roomKey" placeholder="123-456-789" defaultValue={formatRoomKey(room_key || "")} color="gray" />
                                    <Tooltip content="Tạo mã mới">
                                        <MdChangeCircle className='text-4xl ml-2 hover:text-gray-500 transition-all cursor-pointer' onClick={genKey}/>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 mt-2'>
                                <Checkbox id="need_password" onChange={(e)=>setPassword(e.target.checked ? true: false)}/>
                                <Label htmlFor="need_password">Sử dụng mật khẩu cho phòng họp</Label>
                            </div>
                            {password && 
                                <div className="w-1/2">
                                    <div className="my-2 block">
                                        <Label htmlFor="input-gray" color="gray" value="Mật khẩu phòng họp: " />
                                    </div>
                                    <TextInput 
                                        {...register("password",{required:password})}
                                        type='password'
                                        placeholder='Nhập mật khẩu tại đây...'
                                    />
                                </div>
                            }
                            <div className='flex w-full space-x-4'>
                                <div className="flex-1">
                                    <div className="my-2 block">
                                        <Label htmlFor="input-gray" color="gray" value="Ngày bắt đầu:" />
                                    </div>
                                    <Datepicker 
                                        onSelectedDateChanged={(value: any) => setDate(value || '')} 
                                        language='vi-VN' 
                                        className='cursor-pointer' 
                                        minDate={today} 
                                        maxDate={offSetDay} 
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="my-2 block">
                                        <Label htmlFor="input-gray" color="gray" value="Thời gian bắt đầu:" />
                                    </div>
                                    <TextInput
                                        type="time"
                                        value={time}
                                        onChange={handleTimeChange}
                                        id="input-gray"
                                        placeholder=""
                                        required
                                        color={errMessage ? "failure" : "gray"}
                                        helperText={errMessage}
                                    />
                                </div>
                            </div>
                            <div className='mt-2 w-full text-end'>
                                <Button type='submit'>Tạo lịch họp</Button>
                            </div>
                        </form>
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion>
            <div className='mt-3 px-2'>
                <h1 className='text-2xl font-bold'>Sắp tới</h1>
            </div>
            <TimeLine schedule={schedule_60?.data as any}/>
        </div>
    )
}
