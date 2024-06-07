'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { Button, Card, Label, TextInput } from "flowbite-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import '@/styles/login.css'
import NavLogin from '@/components/ui/login-navigation';
export default function LoginForm() {
  const [step, setStep] = useState<number>(1);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [validateUsername, setValidateUsername] = useState<boolean>(false);
  const [validatePassword, setValidatePassword] = useState<boolean>(false);
  const handleStep = ()=>{
    if(!username){
        setValidateUsername(true); 
    }
    else setStep(2);
  }
  const onSubmit = (e:FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if(!password){
        setValidatePassword(true); 
    }
    console.log(username, password)
  }
  useEffect(()=>{
    setValidateUsername(false); 
  },[username])
  useEffect(()=>{
    setValidatePassword(false); 
  },[password])
  return (
        <>
        <NavLogin/>
            <Card className="max-w-sm overflow-hidden mx-auto mt-32">
                <b className="text-5xl text-indigo-600">Freet</b>
                <span className='text-xl font-bold'>Đăng nhập</span>
                    {step === 1 && 
                    <>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email1" color={validateUsername ? 'failure':'gray'} value="Email đăng nhập: " />
                            </div>
                            <TextInput className='dark:text-black' color={validateUsername ? 'failure':'gray'} type="email" value={username} 
                                onChange={(e)=>setUsername(e.target.value)} placeholder="name@flowbite.com"
                                helperText={validateUsername ? 'Tên đăng nhập không được để trống':''}
                            />
                        </div>
                        <Button type="button" onClick={handleStep}>Tiếp theo</Button>
                        <div className="line-container">
                            or
                        </div>
                        <div>
                            <div className="w-full flex justify-center items-center gap-x-7 mb-3">
                                <button className="btn-white flex items-center gap-x-3 flex-1 shadow-md text-xl" ><FaGoogle/>Google</button>
                                <button className="btn-white flex items-center gap-x-3 flex-1 shadow-md text-xl"><FaFacebook className='text-white dark:text-black'/> Facebook</button>
                            </div>
                        </div>
                    </>
                    }{
                    step === 2 &&
                    <>
                        <form className="flex flex-col gap-4 -translate-x-0 transition-all" onSubmit={(e)=>onSubmit(e)}>
                        <div>
                            <div className='flex w-full'>
                                <div className='font-semibold cursor-not-allowed'>{username} </div>
                            </div>
                            
                            <div className="my-3 block">
                                <Label htmlFor="password1" color={validatePassword ? 'failure':'gray'} value="Mật khẩu" />
                            </div>
                            <TextInput value={password} color={validatePassword ? 'failure':'gray'} onChange={(e)=>setPassword(e.target.value)} type="password"
                                helperText={validatePassword ? 'Mật khẩu ít nhất 6 ký tự':''}
                            />
                        </div>
                        <button type="button" className='btn-primary' onClick={()=>setStep(1)}>Sử dụng tài khoản khác</button>
                        <Button type="submit">Đăng nhập <HiOutlineLogin className='text-xl ml-2' /></Button>
                        </form>
                    </>
                    }
            </Card>
            
        </>       
  )
}
