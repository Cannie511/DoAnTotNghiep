'use client'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { Button, Card, Label, Spinner, TextInput, Tooltip } from "flowbite-react";
import { HiOutlineLogin } from "react-icons/hi";
import '@/styles/login.css'
import NavLogin from '@/components/ui/login-navigation';
import { AuthEmail, AuthLogin, AuthLoginGoogle } from '@/Services/auth.api';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { AppContext } from '@/Context/Context';
import Link from 'next/link';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useTheme } from 'next-themes';
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
                    // router.push('/');
                    window.location.reload();
                    toast({
                        title: "Chào mừng",
                        description:"Chào mừng quay trở lại",
                    })
                    googleLogout();
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
                        <span>Chưa có tài khoản ? <Link className='text-indigo-700 font-semibold transition-all hover:underline hover:underline-offset-8' href={'/register'}>Đăng ký ngay</Link></span>
                        <div className="line-container">
                            or
                        </div>
                        <GoogleLogin
                            width="300px"
                            theme='outline'
                            size='large'
                            shape = 'pill'
                            logo_alignment='left'
                            auto_select={false}
                            useOneTap={false}
                            onSuccess={async (credentialResponse) => {
                                setLoading(true);
                                const token:string|undefined = credentialResponse?.credential;
                                await AuthLoginGoogle(token)
                                .then(async (data)=>{
                                    console.log('google: ',data)
                                    setName(data?.data?.data?.data?.display_name)
                                    sessionStorage.setItem('user_data',JSON.stringify(data.data.data.data));
                                    await axios.post('/api/auth',{access_token: data.data.data.access_token.token})
                                    .then(async (data)=>{
                                        window.location.reload();
                                        toast({
                                            title: "Chào mừng",
                                            description:"Chào mừng quay trở lại",
                                        });
                                        setLoading(false)
                                    })
                                    .catch(err=>{
                                        console.log(err);
                                        toast({
                                            title: "Lỗi",
                                            description:"Đã có lỗi xảy ra",
                                            variant:"destructive"
                                        })
                                        setLoading(false)
                                    })
                                })
                                .catch(err=>{
                                    console.log(err);
                                    toast({
                                        title: "Lỗi",
                                        description:"Đã có lỗi xảy ra",
                                        variant:"destructive"
                                    })
                                    setLoading(false)
                                })
                            }}
                            onError={() => {
                                toast({
                                    title: "Lỗi",
                                    description:"Đã có lỗi xảy ra",
                                    variant:"destructive"
                                })
                                setLoading(false)
                            }}
                        />
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
