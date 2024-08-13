import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { url_img_default } from '@/images/image';
import { UserUpdateDisplayName } from '@/Services/user.api';
import { useQueryClient } from '@tanstack/react-query';
import { File } from 'buffer';
import { Avatar, Button, FileInput, Label, Modal, TextInput } from 'flowbite-react'
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { CiEdit } from "react-icons/ci";
import { FaRegFileImage } from "react-icons/fa";
interface Props{
    openModal:boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    avatar: string | null;
}

const ModalUpdateName = ({openModal, setOpenModal, avatar}:Props) => {
    const [name, setName] = useState<string>('');
    const [imgUrl, setImg] = useState<string>('');
    const {linked_account} = useContext(AppContext);
    const [errMessage, setErrMessage] = useState<string>('');
    const [previewImg, setImageSrc] = useState<string | null>(null);
    const [fileImage, setFileImage] = useState<globalThis.File | undefined | null>(null);
    const [pending, setPending] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const {toast} = useToast();
    const {user_id} = useContext(AppContext);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        setFileImage(file)
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
        }
    };

    const onChangeName = async(e:ChangeEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(pending) return;
        if(!name){
            setErrMessage("Tên không được để trống")
            return;
        }
        setPending(true);
        await UserUpdateDisplayName(user_id, name, fileImage || null)
        .then((res:any)=>{
            console.log(res);
            queryClient.invalidateQueries({queryKey:["user_data"]})
            const user_data = localStorage.getItem("user_data");
            if(user_data){
                const data = JSON.parse(user_data);
                const updateData = {...data, avatar:res?.data?.new_avatar, display_name: name}
                localStorage.setItem("user_data", JSON.stringify(updateData));
            }
            toast({
                title:"Thay đổi thông tin thành công!"
            })
            setOpenModal(false);
        })
        .catch((err)=>{
             toast({
                title:"Lỗi: "+ err.message,
                variant:"destructive"
            })
        })
        .finally(()=>setPending(false))
    }
    useEffect(()=>{
        if(name){
            setErrMessage("");
        }
    },[name])
    useEffect(()=>{
        const user_data = localStorage.getItem("user_data");
        if(user_data){
            const display_name = JSON.parse(user_data)?.display_name;
            const avatar = JSON.parse(user_data)?.avatar;
            setImg(avatar);
            setName(display_name);
        }
    },[])
  return (
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thay đổi thông tin cá nhân</h3>
            <div className='flex items-center space-x-2'>
                <Avatar alt='avatar' className='w-96 flex-1' bordered rounded size={"xl"} img={previewImg || avatar || url_img_default}/>
                {linked_account === "google" ? 
                <span className='text-red-600 text-sm flex-1'>Bạn không thể thay đổi ảnh khi đăng nhập bằng google, 
                ảnh đại diện của bạn sẽ tự động cập nhật khi bạn thay đổi trên tài khoản google của bạn</span>:
                <div className='flex-1'>
                    <FileInput onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" helperText="Vui lòng chọn hình có định dạng đuôi là (.png, .jpeg, .jpg)"/>
                </div>
                }
            </div>
            <form onSubmit={onChangeName} className='space-y-4'>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email" value="Tên của bạn:" />
                    </div>
                    <TextInput placeholder="Tên hiển thị . . ." rightIcon={CiEdit} value={name} onChange={(e)=>setName(e.target.value)}
                        helperText={errMessage}
                    />
                </div>
                <Button type='submit' disabled={pending} isProcessing={pending} className='w-full' gradientDuoTone="purpleToBlue">
                    Lưu thay đổi
                </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
  )
}

export default ModalUpdateName