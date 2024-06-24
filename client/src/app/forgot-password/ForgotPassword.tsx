'use client'
import { Button, Card, Label, Spinner, TextInput, Tooltip } from 'flowbite-react';
import { FaSearch } from "react-icons/fa";
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import ResultComponent from '@/components/ResultComponent';
import avatar from '@/app/favicon.ico';
import { AuthCheckVerifyCode, AuthGetVerifyCode, AuthFindEmailLike, AuthForgotPassword } from '@/Services/auth.api';
import { useToast } from '@/components/ui/use-toast';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { AppContext } from '@/Context/Context';
import { SiAuthy } from "react-icons/si";
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const {toast} = useToast();
    const router = useRouter();
    const {isLoading, setLoading} = useContext(AppContext)
    const [step, setStep] = useState<number>(1);
    const [searchValue, setSearchValue] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [retypePassword, setRetypePassword] = useState<string>('');
    const [validateRTP, setValidateRTP] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [listResult, setListResult] = useState([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [value, setValue] = useState("");
    const [verifyValue, setVerifyValue] = useState(false);
    const onSubmit = async(e:ChangeEvent<HTMLFormElement>)=>{
        e.preventDefault();
        await AuthFindEmailLike(searchValue)
        .then(data=>{
            setListResult(data?.data?.data);
            if(data?.data?.data.length === 0)
                setErrorMessage(" Không tìm thấy email trùng khớp");
        })
        .catch(err=>{
            toast({
                title:"Lỗi:",
                description:err.response.data.message,
                variant:"destructive",
            })
        })
    }
    const handleStep = (email:string)=>{
        setStep(2)
        setUsername(email);
    }

    const verifyEmail = async(e:ChangeEvent<HTMLFormElement>) =>{
        try {
            e.preventDefault();
            setLoading(true);
            if(password !== retypePassword) setValidateRTP(true);
            if(password === retypePassword){
                await AuthGetVerifyCode(username, "thay đổi mật khẩu")
                .then((data)=>{
                    if(data.status === 200)
                    setStep(3);
                })
                .catch((err)=>{
                    toast({
                        title:"Lỗi:",
                        description:err.response.data.message,
                        variant:"destructive",
                    }) 
                })
            }
        } catch (error) {
           toast({
                title:"Lỗi:",
                description:"Lỗi server",
                variant:"destructive",
            })  
        } finally{
            setLoading(false)
        }
    }

    const handleChangePassword = async (e:ChangeEvent<HTMLFormElement|EventTarget>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            await AuthCheckVerifyCode(username!==null ? username:'', Number(value))
            .then(async(data)=>{
                await AuthForgotPassword(username, password)
                .then((data)=>{
                    toast({
                        title:"Thông báo:",
                        description:"Thay đổi mật khẩu thành công!"
                    })
                    router.push('/login');
                    setUsername('');
                    setPassword('');
                    setRetypePassword('');
                })
                .catch(err=>{
                    toast({
                        title:"Lỗi:",
                        description:err.response.data.message,
                        variant:"destructive",
                    }) 
                })
            })
            .catch(err=>{
                setVerifyValue(true);
            })
        } catch (error) {
            toast({
                title:"Lỗi:",
                description:"Lỗi server",
                variant:"destructive"
            }) 
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        setErrorMessage('')
    },[searchValue])
    useEffect(()=>{
        setValidateRTP(false)
    },[retypePassword])
  return (
    <Card className="max-w-sm overflow-hidden mx-auto mt-32">
        <b className="text-5xl text-indigo-600">Freet</b>
        <span className='text-xl font-bold'>Quên mật khẩu</span>
            {step === 1 && 
            <>
                <form onSubmit={onSubmit} className='space-y-4 w-full'>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1" value="Email đăng nhập: " />
                        </div>
                        <TextInput className='dark:text-black' 
                        helperText={errorMessage}
                        value={searchValue}
                        onChange={(e)=>setSearchValue(e.target.value)}
                        placeholder="example@freetco.com"
                        />
                    </div>
                   
                    <Button className='w-full' color={searchValue ? "info":"light"} disabled={searchValue?false:true} type="submit" >Tìm kiếm <FaSearch className='ml-2 text-lg'/></Button>
                </form>
                <div className='max-h-48 overflow-y-auto'>
                    {listResult.map((item:any, index:number)=>{
                        return(
                            <ResultComponent onClick={handleStep} key={index} avatarSrc={avatar} email={item?.email} display_name={item?.display_name}/>
                        )
                    })}
                </div>
            </>
            }
            {
            step === 2 &&
            <>
                <form onSubmit={verifyEmail} className="flex flex-col gap-4 -translate-x-0 transition-all">
                    <div>
                        <div className='flex w-full'>
                            <div className='font-semibold cursor-not-allowed flex'>{username}<Tooltip content="Đổi tài khoản"><Button size={'sm'} className='ml-2 -top-1 rounded-full ' onClick={()=>setStep(1)}><LiaExchangeAltSolid className=''/></Button></Tooltip></div>
                        </div>
                        
                        <div className="my-3 block">
                            <Label htmlFor="password1" value="Mật khẩu" />
                        </div>
                        <TextInput value={password} onChange={(e)=>setPassword(e.target.value)} type="password"/>
                        <div className="my-3 block">
                            <Label htmlFor="password2" value="Nhập lại mật khẩu" />
                        </div>
                        <TextInput value={retypePassword} color={validateRTP ? "failure":"gray"} onChange={(e)=>setRetypePassword(e.target.value)} type="password"
                            helperText={validateRTP ? 'Mật khẩu không trùng khớp':''}
                        />
                    </div>
                    <Button disabled={isLoading} type="submit">{isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : <>Xác thực <SiAuthy className='text-xl ml-2' /></>}</Button>
                </form>
            </>
            }
            {step === 3 && 
                <form className='overflow-hidden' onSubmit={handleChangePassword}>
                <div className="space-y-2">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Nhập mã xác thực</h3>
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
                    {verifyValue ? <span className='text-red-600'>Mã xác thực không hợp lệ</span>:<>Mã xác thực được gửi về email <b>{username}</b></>}
                </div>
                </div>
                <Button type="submit" disabled={isLoading} className='w-full mt-2'>
                    {isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : 
                    <>Đổi mật khẩu</>}
                </Button> 
                </form>
            }
    </Card>
  )
}
