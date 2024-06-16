'use client'
import { AppContext } from '@/Context/Context';
import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { Dispatch, SetStateAction, useContext, useLayoutEffect, useState } from 'react';

import { GrFormNext } from "react-icons/gr";
import '@/styles/login.css'
import { AuthEmail } from '@/Services/auth.api';

interface Props {
  setStep: Dispatch<SetStateAction<number>>;
}
export default function EmailStep({setStep}:Props) {
    const sesstionData = sessionStorage.getItem('info') as string;
    const info = JSON.parse(sesstionData)
    const {isLoading,setLoading} = useContext(AppContext)
    const [username, setUsername] = useState<string|undefined>('');
    const [validateUsername,setValidateUsername] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string|undefined>('');
    useLayoutEffect(()=>{
        if(info) setUsername(info?.email);
    },[])
    const handleCheckStep = async ()=>{
        try {
            if(isLoading) return;
            setLoading(true);
            if(!username){
                setValidateUsername(true);
                setErrorMessage('Tên đăng nhập không được để trống');
            }
            else {
                await AuthEmail(username)
                .then((data)=>{
                    setValidateUsername(true);
                    setErrorMessage("Tài khoản này đã tồn tại! vui lòng chọn 1 tài khoản khác.")
                })
                .catch((err)=>{
                    setStep(100);
                    sessionStorage.setItem('info', JSON.stringify({display_name:info?.display_name, language: info?.language, email: username}))
                    sessionStorage.setItem("step","100")
                })
            }
        } catch (error) {
            setValidateUsername(true);
            console.log(error);
        }finally{
            setLoading(false)
        }
    }
  return (
    <>
        <div>
            <div className="mb-2 block">
                <Label htmlFor="email1" color={validateUsername ? 'failure':'gray'} value="Email đăng ký: " />
            </div>
            <TextInput className='dark:text-black' color={validateUsername ? 'failure':'gray'} type="email" value={username} 
                onChange={(e)=>setUsername(e.target.value)} placeholder="example@freetco.com"
                helperText={validateUsername ? errorMessage:''}
            />
        </div>
       
        <Button disabled={isLoading} type="button" onClick={()=>handleCheckStep()}>
            {isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : 
            <>Tiếp theo <GrFormNext className='text-xl'/></>}
        </Button>                
        {/* <div className="line-container">
            or
        </div> */}
    </>
  )
}
