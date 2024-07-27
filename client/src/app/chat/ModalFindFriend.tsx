'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { AppContext } from '@/Context/Context';
import { url_img_default } from '@/images/image';
import { getFriend } from '@/Services/friend.api';
import { UserData } from '@/types/type';
import { useQuery } from '@tanstack/react-query';
import { Button, Modal, TextInput, Tooltip } from 'flowbite-react'
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useContext } from 'react'
import { FaSearch } from "react-icons/fa";
interface Props{
    openModal:boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    setFriend: Dispatch<SetStateAction<UserData | null>>
}

export default function ModalFindFriend({openModal, setOpenModal, setFriend}:Props) {
    const {user_id} = useContext(AppContext);
    const {data:list_friend, isLoading} = useQuery({
        queryKey:["friend_1"],
        queryFn:()=>getFriend(Number(user_id), 1),
        enabled: !!user_id
    })
    const list_friend_accepted:any = list_friend?.data?.data;
    const handleChangeFriend = (friend:any) =>{
        setFriend(friend);
        setOpenModal(false);
    }
  return (
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
        <Modal.Header />
        <Modal.Body>
            <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Tìm kiếm bạn bè: </h3>
                <div className='flex space-x-2'>
                    <TextInput className='flex-auto' type="text" placeholder="Nhập tên bạn bè" />
                    <Button className='flex-none w-10'><FaSearch className='text-xl'/></Button>
                </div>
            </div>
            <div className='mt-2'>
                {
                    isLoading && !list_friend_accepted && 
                    <>
                        <Skeleton className='w-full h-14'/>
                        <Skeleton className='w-full h-14'/>
                        <Skeleton className='w-full h-14'/>
                    </>
                }
                {list_friend_accepted && list_friend_accepted.map((item:any)=>{
                    return(
                    <div key={item?.id}
                    onClick={()=>handleChangeFriend(item)}
                    className="
                    cursor-pointer dark:hover:bg-gray-900 transition-all 
                    hover:bg-slate-100 flex rounded-lg border w-full border-gray-200 
                    bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 
                        p-2 items-center">
                        <div className='flex-auto'>
                            <div className="flex items-center space-x-3">
                            <div className="shrink-0">
                                <Image
                                alt="Neil image"
                                height="32"
                                src={item["Friend.avatar"].toString() || url_img_default}
                                width="32"
                                className="rounded-full"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item["Friend.display_name"]}</p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">0 bạn bè</p>
                            </div>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </Modal.Body>
      </Modal>
  )
}
