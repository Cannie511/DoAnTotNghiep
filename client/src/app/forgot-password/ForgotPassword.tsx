'use client'
import { Button, Card, Label, TextInput } from 'flowbite-react';

import { useState } from 'react'

export default function ForgotPassword() {
    const [step, setStep] = useState<number>(1);
  return (
    <Card className="max-w-sm overflow-hidden mx-auto mt-32">
        <b className="text-5xl text-indigo-600">Freet</b>
        <span className='text-xl font-bold'>Quên mật khẩu</span>
            {step === 1 && 
            <>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Email đăng nhập: " />
                    </div>
                    <TextInput className='dark:text-black' 
                    placeholder="example@freetco.com"
                    />
                </div>
                <Button type="button" >Tìm kiếm</Button>
            </>
            }
            {/* {
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
                <Link className='text-center text-indigo-700 font-semibold transition-all hover:underline hover:underline-offset-8' href={'/forgot-password'}>Quên mật khẩu ?</Link>
                <Button disabled={isLoading} type="submit">{isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : <>Đăng nhập <HiOutlineLogin className='text-xl ml-2' /></>}</Button>
                </form>
            </>
            } */}
    </Card>
  )
}
