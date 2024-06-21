'use client'
import { formatDate, getCurrentTime } from '@/Utils/formatDate';
import { Accordion, Button, Datepicker, Label, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import TimeLine from './Timeline';

export default function Schedule() {
    const today = new Date();
    const [date, setDate] = useState<string|undefined>();
    const [time, setTime] = useState<string|undefined>();
    const offSetDay = new Date(today);
    offSetDay.setDate(today.getDate()+3);
    const setSchedule = ()=>{
        const currentTime = getCurrentTime();
        console.log("time now:", today," - ", currentTime)
        console.log("date: ", formatDate(date=== undefined ? today as any : date as string , time as string));
    }
    useEffect(() => {
        const currentTime = new Date();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        setTime(formattedTime as any);
    }, []);
     const handleTimeChange = (event:any) => {
        setTime(event.target.value);
    };
  return (
    <div>
        <Accordion className='w-2/4'>
            <Accordion.Panel>
                <Accordion.Title>Lên lịch cuộc họp</Accordion.Title>
                    <Accordion.Content>
                        <div className='w-2/4'>
                            <div className="my-2 block">
                                <Label htmlFor="input-gray" color="gray" value="Chủ đề cuộc họp" />
                            </div>
                            <TextInput id="input-gray" placeholder="Chủ đề cuộc họp" required color="gray" />
                        </div>
                        <div className='flex w-full space-x-4'>
                            <div className="flex-1">
                                <div className="my-2 block">
                                    <Label htmlFor="input-gray" color="gray" value="Ngày bắt đầu:" />
                                </div>
                                <Datepicker onSelectedDateChanged={(value:any)=>setDate(value)} language='vi-VN' className='cursor-pointer' minDate={today} maxDate={offSetDay} />
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
                                    color="gray"
                                />
                            </div>
                        </div>
                        <div className='mt-2 w-full text-end'>
                            <Button className='' onClick={setSchedule}>Tạo lịch họp</Button> 
                        </div>
                    </Accordion.Content>
            </Accordion.Panel>
        </Accordion>
        <div className='mt-3 px-2'>
            <h1 className='text-2xl font-bold'>Sắp tới</h1>
        </div>
        <TimeLine/>
    </div>
  )
}
