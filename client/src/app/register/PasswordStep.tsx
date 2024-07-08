'use client'
import { AppContext } from '@/Context/Context';
import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useContext, useEffect, useState } from 'react'
import { GrFormNext } from "react-icons/gr";
import '@/styles/login.css'
import { AuthRegister } from '@/Services/auth.api';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export default function PasswordStep() {
    const {isLoading, setLoading,setName} = useContext(AppContext);
    const {toast} = useToast();
    const sesstionData = sessionStorage.getItem('info') as string;
    const info = JSON.parse(sesstionData)
    const [password, setPassword] = useState<string|undefined>('');
    const [reEnterPassword, setReEnterPassword] = useState<string|undefined>('');
    const [validatePassword,setValidatePassword] = useState<boolean>(false);
    const [validateReEnterPassword, setValidateReEnterPassword] = useState<boolean>(false);
    const handleVallidate = ()=>{
        if(!password) setValidatePassword(true);
        if(!reEnterPassword) setValidateReEnterPassword(true);
        if(password !== reEnterPassword) setValidateReEnterPassword(true);
    }
    const handleCheckStep = async ()=>{
        handleVallidate();
        setLoading(true);
        try {
            if(password && reEnterPassword && reEnterPassword === password) 
            {
                await AuthRegister({
                    email:info?.email as string, 
                    password: password, 
                    display_name: info?.display_name as string, 
                    language: info?.language as number, 
                    premium:0, 
                    linked_account:"verify"})
                .then(async(data)=>{
                    setName(data.data.data.data?.display_name)
                    localStorage.setItem('user_data',JSON.stringify(data.data.data.data));
                    await axios.post('/api/auth',{access_token: data.data.access_token})
                    .then(async(data)=>{
                        sessionStorage.removeItem('info');
                        sessionStorage.removeItem("step");
                        window.location.reload();
                        toast({
                            title: "Chào mừng",
                            description:"Chào mừng bạn đến với Freet",
                        })
                    })
                    .catch((err)=>{
                        console.log(err)
                        toast({
                            title: "Lỗi",
                            description:err.message,
                            variant:"destructive"
                        })
                    })
                })
                .catch((err)=>{
                    console.log(err)
                    toast({
                        title: "Lỗi",
                        description:err.message,
                        variant:"destructive"
                    })
                })
            } 
        } catch (error) {
            console.log(error)
            toast({
                title: "Lỗi",
                description:"Lỗi server",
                variant:"destructive"
            })
        }finally{
            setLoading(false);
        }   
    }
    useEffect(()=>{
        if(password) setValidatePassword(false);
    },[password])
    useEffect(()=>{
        if(reEnterPassword) setValidateReEnterPassword(false);
    },[reEnterPassword])
  return (
    <>
        <div>
            <div className="mb-2 block">
                <Label htmlFor="email1" color={validatePassword ? 'failure':'gray'} value="Mật khẩu: " />
            </div>
            <TextInput className='dark:text-black' color={validatePassword ? 'failure':'gray'} type="password" value={password} 
                onChange={(e)=>setPassword(e.target.value)} placeholder="Mật khẩu...."
            />
             <div className="mb-2 block">
                <Label htmlFor="email1" color={validateReEnterPassword ? 'failure':'gray'} value="Nhập lại mật khẩu:" />
            </div>
            <TextInput className='dark:text-black' color={validateReEnterPassword ? 'failure':'gray'} type="password" value={reEnterPassword} 
                onChange={(e)=>setReEnterPassword(e.target.value)} placeholder="Xác nhận mật khẩu..."
            />
        </div>
        <div>
        
        </div>
        <Button disabled={isLoading} type="button" onClick={handleCheckStep}>
            {isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : 
            <>Tiếp theo <GrFormNext className='text-xl'/></>}
        </Button>
    </>
  )
}
