'use client'
import { Accordion, Datepicker, Label, TextInput } from 'flowbite-react'
import React from 'react'

export default function Schedule() {
    const today = new Date();
    const offSetDay = new Date(today);
    offSetDay.setDate(today.getDate()+3);
  return (
    <div>
        <Accordion className='w-2/4' collapseAll>
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
                                <Label htmlFor="input-gray" color="gray" value="Thời gian từ:" />
                            </div>
                            <Datepicker className='cursor-pointer' minDate={today} maxDate={offSetDay} />
                        </div>
                        <div className="flex-1">
                            <div className="my-2 block">
                                <Label htmlFor="input-gray" color="gray" value="Thời gian đến:" />
                            </div>
                            <Datepicker className='cursor-pointer' minDate={today} maxDate={offSetDay} />
                        </div>
                    </div>
                </Accordion.Content>
            </Accordion.Panel>
        </Accordion>
        <div className='mt-3 px-2'>
            <h1 className='text-2xl font-bold'>Sắp tới</h1>
        </div>
    </div>
  )
}
