
import { AppContext } from '@/Context/Context';
import { UserChangePassword, UserCheckPassword } from '@/Services/user.api';
import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react'
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useToast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { AuthCheckVerifyCode, AuthGetVerifyCode } from '@/Services/auth.api';

interface Props{
    openModal:boolean;
    setOpenModal: (state:boolean)=>void;
}
export default function ModalInput({openModal, setOpenModal}:Props) {
    const {toast} = useToast();
    const {isLoading, setLoading, setForceLogout} = useContext(AppContext);
    const {user_id, email} = useContext(AppContext);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [step, setStep] = useState<number>(1);
    const [retypeNewPassword, setRetypeNewPassword] = useState<string>('');
    const [validateOldPassword, setValidateOldPassword] = useState<boolean>(false);
    const [validateNewPassword, setValidateNewPassword] = useState<boolean>(false);
    const [validateRetypePassword, setValidateRetypePassword] = useState<boolean>(false);
    const [value, setValue] = useState("");
    const [verifyValue, setVerifyValue] = useState(false);
    const [errorMessageOP, setErrorMessageOP] = useState<string>('');
    const [errorMessageNP, setErrorMessageNP] = useState<string>('');
    const [errorMessageRNP, setErrorMessageRNP] = useState<string>('');
    const handleChangePassword = async (e:ChangeEvent<HTMLFormElement|EventTarget>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            await AuthCheckVerifyCode(email!==null ? email:'', Number(value))
            .then(async(data)=>{
                await UserChangePassword({user_id, old_password: oldPassword, new_password: newPassword})
                .then((data)=>{
                    toast({
                        title:"Thông báo:",
                        description:"Thay đổi mật khẩu thành công!",
                        action: <ToastAction onClick={()=>setForceLogout(true)} altText="Đăng xuất">Đăng xuất</ToastAction>,
                    })
                    setOldPassword('');
                    setNewPassword('');
                    setRetypeNewPassword('');
                    setOpenModal(false);
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
    const handleSubmit = async (e:ChangeEvent<HTMLFormElement|EventTarget>)=>{
        try {
            setLoading(true);
            e.preventDefault();
            if(oldPassword === newPassword){
                setValidateNewPassword(true);
                setErrorMessageNP('Mật khẩu mới không được trùng với mật khẩu cũ')
            }
            if(!oldPassword){
                setValidateOldPassword(true);
                setErrorMessageOP('Mật khẩu hiện tại không được để trống')
            }
            if(!newPassword){
                setValidateNewPassword(true);
                setErrorMessageNP('Mật khẩu mới không được để trống')
            }
            if(newPassword !== retypeNewPassword){
                setErrorMessageRNP("Mật khẩu không trùng khớp")
                setValidateRetypePassword(true);
            }
            if(oldPassword && retypeNewPassword && newPassword && retypeNewPassword === newPassword && newPassword !== oldPassword){
                await UserCheckPassword({user_id, old_password: oldPassword})
                .then( async(data)=>{
                    await AuthGetVerifyCode(email, "thay đổi mật khẩu")
                    .then((data)=>{
                        if(data.status === 200)
                        setStep(2);
                    })
                    .catch((err)=>{
                        toast({
                            title:"Lỗi:",
                            description:err.response.data.message,
                            variant:"destructive",
                        }) 
                    })
                })
                .catch(err=>{
                    if(err.response.status === 421){
                        setValidateOldPassword(true)
                        setErrorMessageOP(err.response.data.message)
                    }
                    else{
                        toast({
                            title:"Lỗi:",
                            description:err.response.data.message,
                            variant:"destructive",
                        }) 
                    }
                })
            }
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
        setValidateOldPassword(false)
        setErrorMessageOP('')
    },[oldPassword])
    useEffect(()=>{
        setValidateNewPassword(false);
        setErrorMessageNP('')
    },[newPassword])
    useEffect(()=>{
        setValidateRetypePassword(false);
        setErrorMessageRNP('')
    },[retypeNewPassword])
  return (
    <Modal className='transition-all' show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
        <Modal.Header/>
            <Modal.Body>
            {step === 1 &&
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thay đổi mật khẩu</h3>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email" value="Mật khẩu cũ:" />
                        </div>
                        <TextInput color={validateOldPassword?"failure":'gray'} helperText={errorMessageOP ? errorMessageOP:''} type='password' value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} ref={emailInputRef} placeholder="Mật khẩu cũ" />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Mật khẩu mới" />
                        </div>
                        <TextInput color={validateNewPassword?"failure":'gray'} helperText={errorMessageNP ? errorMessageNP:''} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} type='password' placeholder='Mật khẩu mới' id="password" />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="passwordRetype" value="Nhập lại mật khẩu mới" />
                        </div>
                        <TextInput color={validateRetypePassword?"failure":'gray'} value={retypeNewPassword} helperText={errorMessageRNP?errorMessageRNP:''} onChange={(e)=>setRetypeNewPassword(e.target.value)} type='password' placeholder='Nhập lại mật khẩu mới'/>
                    </div>
                    <div className="w-full flex space-x-2">
                        <Button gradientDuoTone="pinkToOrange" className='w-full' onClick={()=>setOpenModal(false)}>Hủy</Button>
                        <Button color="purple" type='submit' className='w-full' disabled={isLoading} isProcessing={isLoading}>Xác nhận</Button>
                    </div>
                </div>
            </form>
            }
            {step === 2 &&
            <>
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
                    {verifyValue ? <span className='text-red-600'>Mã xác thực không hợp lệ</span>:<>Mã xác thực được gửi về email <b>{email}</b></>}
                </div>
                </div>
                <Button type="submit" disabled={isLoading} className='w-full mt-2'>
                    {isLoading ? <Spinner color={'info'} aria-label="Medium sized spinner example" size="md" /> : 
                    <>Đổi mật khẩu</>}
                </Button> 
            </form>
            </>
            }
            </Modal.Body>
      </Modal>
  )
}
