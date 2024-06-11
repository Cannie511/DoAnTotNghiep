'use client'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { Button, Card, Label, Spinner, TextInput, Tooltip } from "flowbite-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import '@/styles/login.css'
import NavLogin from '@/components/ui/login-navigation';
import { AuthEmail, AuthLogin } from '@/apis/auth.api';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { AppContext } from '@/Context/Context';
export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [validateUsername, setValidateUsername] = useState<boolean>(false);
  const [validatePassword, setValidatePassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean | undefined>(false);
  const {toast} = useToast();
  const {setName} = useContext(AppContext)
  const handleStep = async () =>{
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
                setStep(2);
            })
            .catch((err)=>{
                setValidateUsername(true);
                setErrorMessage("Tài khoản này chưa tồn tại")
            })
        }
    } catch (error) {
        setValidateUsername(true);
        console.log(error);
    }finally{
        setLoading(false)
    }
  }
  const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setLoading(true);
    try {
        if(!password){
            setValidatePassword(true); 
        }
        if(username && password){
            await AuthLogin({username, password})
            .then(async (data)=>{
                setName(data?.data?.data?.display_name)
                sessionStorage.setItem('user_data',JSON.stringify(data.data.data));
                 await axios.post('/api/auth',{access_token: data.data.access_token})
                 .then(async (data)=>{
                    await router.push('/');
                    toast({
                        title: "Chào mừng",
                        description:"Chào mừng quay trở lại",
                        
                    })
                 })
                .catch((err)=>{
                    console.log(err);
                    setValidatePassword(true);
                    setErrorMessage("Không có token")
                })

            })
            .catch((err)=>{
                setValidatePassword(true);
                setErrorMessage("Sai mật khẩu!")
            })
        } 
    } catch (error) {
        console.log(error);
    }finally{
        setLoading(false)
    }
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
                                onChange={(e)=>setUsername(e.target.value)} placeholder="example@freetco.com"
                                helperText={validateUsername ? errorMessage:''}
                            />
                        </div>
                        <Button disabled={isLoading} type="button" onClick={handleStep}>{isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : 'Tiếp theo'}</Button>
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
                                <div className='font-semibold cursor-not-allowed flex'>{username}<Tooltip content="Đổi tài khoản"><Button size={'sm'} className='ml-2 -top-1 rounded-full ' onClick={()=>setStep(1)}><LiaExchangeAltSolid className=''/></Button></Tooltip></div>
                            </div>
                            
                            <div className="my-3 block">
                                <Label htmlFor="password1" color={validatePassword ? 'failure':'gray'} value="Mật khẩu" />
                            </div>
                            <TextInput value={password} color={validatePassword ? 'failure':'gray'} onChange={(e)=>setPassword(e.target.value)} type="password"
                                helperText={validatePassword ? errorMessage:''}
                            />
                        </div>
                        <Button disabled={isLoading} type="submit">{isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : <>Đăng nhập <HiOutlineLogin className='text-xl ml-2' /></>}</Button>
                        </form>
                    </>
                    }
            </Card>
            
        </>       
  )
}
