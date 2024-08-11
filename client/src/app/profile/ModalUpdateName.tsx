import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { url_img_default } from '@/images/image';
import { UserUpdateDisplayName } from '@/Services/user.api';
import { Avatar, Button, FileInput, Label, Modal, TextInput } from 'flowbite-react'
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { CiEdit } from "react-icons/ci";
import { FaRegFileImage } from "react-icons/fa";
interface Props{
    openModal:boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
}

const ModalUpdateName = ({openModal, setOpenModal}:Props) => {
    const [name, setName] = useState<string>('');
    const [imgUrl, setImg] = useState<string>('');
    const {linked_account} = useContext(AppContext);
    const [errMessage, setErrMessage] = useState<string>('');
    const {toast} = useToast();
    const {user_id} = useContext(AppContext);
    const onChangeName = async(e:ChangeEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!name){
            setErrMessage("Tên không được để trống")
            return;
        }
        await UserUpdateDisplayName(user_id, name)
        .then(()=>{
            const user_data = localStorage.getItem("user_data");
            if(user_data){
                const data = JSON.parse(user_data);
                const updateData = {...data, display_name: name}
                localStorage.setItem("user_data", JSON.stringify(updateData));
            }
            toast({
                title:"Thay đổi tên thành công!"
            })
            setOpenModal(false);
        })
        .catch((err)=>{
             toast({
                title:"Lỗi: "+ err.message,
                variant:"destructive"
            })
        })
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
                <Avatar alt='avatar' className='w-72' bordered rounded size={"lg"} img={imgUrl || url_img_default}/>
                {linked_account === "google" ? 
                <span className='text-red-600 text-sm'>Bạn không thể thay đổi ảnh khi đăng nhập bằng google, 
                ảnh đại diện của bạn sẽ tự động cập nhật khi bạn thay đổi trên tài khoản google của bạn</span>:
                <div>
                    <FileInput accept="image/png, image/jpeg, image/jpg" helperText="Vui lòng chọn hình có định dạng đuôi là (.png, .jpeg, .jpg)"/>
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
                <Button type='submit' className='w-full' gradientDuoTone="purpleToBlue">
                    Đổi tên
                </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
  )
}

export default ModalUpdateName