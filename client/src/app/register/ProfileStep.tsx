'use client'
import { AppContext } from '@/Context/Context';
import { Button, Label, Select, Spinner, TextInput } from 'flowbite-react'
import {Button as BtnShadCN} from '@/components/ui/button'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { GrFormNext } from "react-icons/gr";
import '@/styles/login.css'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
interface Props {
  setStep: Dispatch<SetStateAction<number>>;
}
export default function ProfileStep({setStep}:Props) {
    const {isLoading} = useContext(AppContext);
    const [showName, setShowname] = useState<boolean>(false)
    const [first_display_name, setFirst_Display_name] = useState<string|undefined>('');
    const [last_display_name, setLast_Display_name] = useState<string|undefined>('');
    const [country, setCountry] = useState<number>(1);
    const [validateFirst_Display_name,setValidateFirst_Display_name] = useState<boolean>(false);
    const [validateLast_Display_name, setValidateLast_Display_name] = useState<boolean>(false);
    const handleVallidate = ()=>{
        if(!first_display_name) setValidateFirst_Display_name(true);
        if(!last_display_name) setValidateLast_Display_name(true);
    }
    const handleCheckStep = ()=>{
        handleVallidate();
        if(first_display_name && last_display_name) 
        {
            sessionStorage.setItem('info', JSON.stringify({display_name:first_display_name +' '+ last_display_name, language:country}));
            sessionStorage.setItem('step', '50');
            setStep(50)
        }    
    }
    const handleShowName = (state:boolean)=>{
        handleVallidate();
        if(first_display_name && last_display_name) setShowname(state)
    }
    useEffect(()=>{
        if(first_display_name) setValidateFirst_Display_name(false);
    },[first_display_name])
    useEffect(()=>{
        if(last_display_name) setValidateLast_Display_name(false);
    },[last_display_name])
  return (
    <>
        <div>
            <div className="mb-2 block">
                <Label htmlFor="email1" color={validateFirst_Display_name ? 'failure':'gray'} value="Họ và tên lót: " />
            </div>
            <TextInput className='dark:text-black' color={validateFirst_Display_name ? 'failure':'gray'} type="email" value={first_display_name} 
                onChange={(e)=>setFirst_Display_name(e.target.value)} placeholder="Họ và (tên lót nếu có)..."
            />
             <div className="mb-2 block">
                <Label htmlFor="email1" color={validateLast_Display_name ? 'failure':'gray'} value="Tên: " />
            </div>
            <TextInput className='dark:text-black' color={validateLast_Display_name ? 'failure':'gray'} type="email" value={last_display_name} 
                onChange={(e)=>setLast_Display_name(e.target.value)} placeholder="Tên..."
            />
            <div className="mb-2 block">
                <Label htmlFor="countries" value="Quốc Gia" />
            </div>
            <Select id="countries" onChange={(e)=>setCountry(Number(e.target.value))}>
                <option value={1}>Việt Nam</option>
                <option value={0}>Anh Quốc</option>
            </Select>
        </div>
        <div>
            {!showName ?
            <BtnShadCN onClick={()=>handleShowName(true)}><FaEye className='text-xl me-2' /> Xem trước tên hiển thị</BtnShadCN>
            :
            <div className='w-full flex'>
                <BtnShadCN onClick={()=>setShowname(false)}><FaEyeSlash className='text-xl me-2'/> Ẩn</BtnShadCN>
                <span className='flex-1 mx-2'>{first_display_name+' '+last_display_name}</span>
            </div>
            }
        </div>
        <Button disabled={isLoading} type="button" onClick={handleCheckStep}>
            {isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : 
            <>Tiếp theo <GrFormNext className='text-xl'/></>}
        </Button>                
        {/* <div className="line-container">
            or
        </div> */}
    </>
  )
}
