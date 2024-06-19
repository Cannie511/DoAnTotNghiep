import { AppContext } from '@/Context/Context';
import { AuthCheckVerifyCode } from '@/Services/auth.api';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button, Spinner } from 'flowbite-react';
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { GrFormNext } from "react-icons/gr";
interface Props {
  setStep: Dispatch<SetStateAction<number>>;
}
export default function OTPConfirmStep({setStep}:Props) {
    const [value, setValue] = useState("");
    const [verifyValue, setVerifyValue] = useState(false);
    const {isLoading} = useContext(AppContext);
    const info = sessionStorage.getItem('info');
    const email:string|null = JSON.parse(info as string)?.email;
    const handleCheckStep = async ()=>{
      try {
        console.log(value);
        if(!value)
          setVerifyValue(true)
        if(value){
          const data = await AuthCheckVerifyCode(email!==null ? email:'', Number(value));
          if(data.status===200){
            sessionStorage.setItem("step","100")
            setStep(100);
          }
          else setVerifyValue(true);
        }
      } catch (error) {
        setVerifyValue(true);
        console.log(error)
      }
    }
    useEffect(()=>{
      if(value) setVerifyValue(false)
    },[value])
  return (
    <>
    <div className="space-y-2">
      <InputOTP
        
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup className='mx-auto'>
          <InputOTPSlot className={verifyValue ? 'dark:border-red-600 border-red-700' :'dark:border-white'} index={0} />
          <InputOTPSlot className={verifyValue ? 'dark:border-red-600 border-red-700' :'dark:border-white'} index={1} />
          <InputOTPSlot className={verifyValue ? 'dark:border-red-600 border-red-700' :'dark:border-white'} index={2} />
          <InputOTPSlot className={verifyValue ? 'dark:border-red-600 border-red-700' :'dark:border-white'} index={3} />
          <InputOTPSlot className={verifyValue ? 'dark:border-red-600 border-red-700' :'dark:border-white'} index={4} />
          <InputOTPSlot className={verifyValue ? 'dark:border-red-600 border-red-700' :'dark:border-white'} index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {verifyValue ? <span className='text-red-600'>Mã xác thực không hợp lệ</span>:'Nhập mã gồm 6 số được gửi về Email'}
      </div>
    </div>
    <Button disabled={isLoading} type="button" className='w-full' onClick={()=>handleCheckStep()}>
            {isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : 
            <>Tiếp theo <GrFormNext className='text-xl'/></>}
    </Button> 
    </>
    
  )
}
