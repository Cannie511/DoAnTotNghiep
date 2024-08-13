'use client'

import Image from "next/image";
import { Avatar, Card } from "flowbite-react";
import { useContext, useState } from "react";
import { AppContext } from "@/Context/Context";
import { FaUserFriends } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { FaCrown } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import ModalInput from "@/components/ModalInput";
import ModalUpdateName from "./ModalUpdateName";
import { useQuery } from "@tanstack/react-query";
import { UserFindOne } from "@/Services/user.api";
import { url_img_default } from "@/images/image";
export default function ProfileUser() {
  const {user_id, linked_account} = useContext(AppContext);
  const [openModal, showModal] = useState<boolean>(false);
  const [openModalName, showModalName] = useState<boolean>(false);
  const {data:user, isLoading} = useQuery({
    queryKey:["user_data"],
    queryFn:()=>UserFindOne(user_id),
    enabled: !!user_id
  })
  const user_data = user?.data.data;
  return (
    <>
    {isLoading ? 
      <Card>
        <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="w-full h-[20rem]" />
      </Card> :
    <>
     <Card className="">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-60">
          <Avatar
            img={user_data?.avatar||url_img_default}
            rounded
            size={"xl"}
            className="transition-transform duration-300 ease-in-out transform hover:scale-110"
          />
        </div>
        <div className="ml-3 md:mt-0 mt-2 w-full space-y-3">
          <div className="flex">
              <div className="flex-1"><span className="text-3xl text-gray-900 font-bold dark:text-white">{user_data?.display_name}</span></div>
              <div className="flex-1 text-end md:block hidden">
                <Button variant="outline" onClick={()=>showModalName(true)}>
                  chỉnh sửa
                  <MdModeEdit className="ms-1"/>
                </Button>
              </div>
          </div>
          <div className="mt-1"><span className=" flex text-sm text-gray-500 dark:text-gray-400"><FaUserFriends className="text-lg me-1"/> Bạn bè: 0</span></div>
          <div><span className="text-sm text-gray-500 dark:text-gray-400">Gói tài khoản: <strong>{user_data?.premium === 0 || !user_data?.premium ? 'Tài khoản cơ bản':'Tài khoản Premium'}</strong></span></div>
        </div>
        <Button variant="outline" className="mt-3 md:hidden flex w-full" onClick={()=>showModalName(true)}>
          chỉnh sửa
          <MdModeEdit className="ms-1"/>
        </Button>
      </div>
      </Card>
      <Card className="mt-2">
        <h1 className="text-3xl font-semibold">Thông tin tài khoản</h1>
        <hr/>
        <div className="grid grid-cols-3 mt-2">
          <div className="col-1 font-bold">Email:</div>
          <div className="col-1">{user_data?.email}</div>
          {/* <div className="col-1 text-end"><Button size={'sm'}>{user_data?.email ? 'Chỉnh sửa':'Thêm mới'}</Button></div> */}
        </div>
        <div className="grid grid-cols-3 mt-2">
          <div className="col-1 font-bold">Ngôn ngữ:</div>
          <div className="col-1">{Number(user_data?.language) === 1 ? 'Tiếng Việt':'Tiếng Anh'}</div>
          {/* <div className="col-1 text-end"><Button size={'sm'}>{user_data?.language === 1 ? 'Chỉnh sửa':'Thêm mới'}</Button></div> */}
        </div>
        <div className="grid grid-cols-3 mt-2">
          <div className="col-1 font-bold">Gói tài khoản:</div>
          <div className="col-1">{Number(user_data?.premium) === 0 || !user_data?.premium ? 'Tài khoản cơ bản':<span className="flex">Tài khoản Premium <FaCrown className="text-xl text-yellow-200 ms-1"/></span>}</div>
          {/* <div className="col-1 text-end">{user_data?.premium === 0 || !user_data?.premium ? <Button size={'sm'}>Nâng cấp</Button>:''}</div> */}
        </div>
        <div className="grid grid-cols-3 mt-2">
          <div className="col-1 font-bold">Tài khoản liên kết:</div>
          <div className="col-1">{linked_account === 'google' ? 'account.google.com':'Không có'}</div>
        </div>
        {linked_account === 'verify' &&
          <div className="grid grid-cols-3">
            <div className="col-1 font-bold">Mật khẩu:</div>
            <div className="col-1">**********</div>
            <div className="col-1 text-end"><Button size={'sm'} onClick={()=>showModal(true)}>Đổi mật khẩu</Button></div>
          </div>
        }
      </Card>
      <ModalInput openModal={openModal} setOpenModal={showModal}/>
      <ModalUpdateName avatar={user_data?.avatar} openModal={openModalName} setOpenModal={showModalName}/>
      </>      
    }
    </>
  )
}
