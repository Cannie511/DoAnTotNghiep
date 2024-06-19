'use client'
import { Card, Progress, Tooltip } from 'flowbite-react'
import React, { useLayoutEffect, useState } from 'react'
import EmailStep from './EmailStep'
import ProfileStep from './ProfileStep';
import PasswordStep from './PasswordStep';
import { TbArrowBack } from "react-icons/tb";
import OTPConfirmStep from './OTPConfirmStep';
export default function RegisterForm() {
    const [process, setProcess] = useState<number>(25);
    useLayoutEffect(()=>{
        const step = sessionStorage.getItem("step");
        if(step) setProcess(+step);
    },[])
    const handleBackStep = (processNumber:number)=>{
      sessionStorage.setItem("step", processNumber.toString());
      setProcess(processNumber)
    }
  return (
    <div>
        <Card className="max-w-md overflow-hidden mx-auto mt-32">
            <b className="text-5xl text-indigo-600">Freet</b>
             <div className='flex '>
              {process !== 25 &&
              <div className='relative '>
                <Tooltip className='w-40' content="Quay lại bước trước">
                    <TbArrowBack className='text-2xl relative top-1 me-2 cursor-pointer' onClick={
                      process === 50 ?
                      ()=>handleBackStep(25) : ()=>handleBackStep(50)
                    }/>
                </Tooltip>
              </div>
              }
              <span className='text-xl font-bold'>
                {process === 25 && "Thông tin cá nhân"}
                {process === 50 && "Email liên kết"}
                {process === 75 && "Mã xác thực"}
                {process === 100 && "Mật khẩu"}
              </span>
            </div>
                <Progress progress={process} size="sm" color="dark" />
                {process === 25 && <><ProfileStep setStep={setProcess}/></>}
                {process === 50 && <EmailStep setStep={setProcess}/>}
                {process === 75 && <OTPConfirmStep setStep={setProcess}/>}
                {process === 100 && <PasswordStep />}
        </Card>
        
    </div>
    
  )
}
