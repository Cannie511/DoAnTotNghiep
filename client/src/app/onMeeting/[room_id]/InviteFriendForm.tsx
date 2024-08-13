'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { url_img_default } from '@/images/image';
import { getFriendNotInRoom } from '@/Services/friend.api';
import { UserFindByNameOrEmail } from '@/Services/user.api';
import { createUserInvitation } from '@/Services/user_invitation.api';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Button, Modal, Tabs, TextInput } from 'flowbite-react'
import Image from 'next/image';
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdPersonAddAlt1 } from "react-icons/md";
interface Props{
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    room_id:number
}
/**
 * 
 * @param room_id: room_id
 * @returns 
 */
export default function InviteFriendForm({setOpenModal, room_id}:Props) {
    const {user_id, socket} = useContext(AppContext);
    const {toast} = useToast();
    const [searchValue, setSearchValue] = useState<string>('');
    const [listSearch, setListSearch] = useState<Array<any>>([]);
    const [listInvite, setListInvite] = useState<Array<number>>([]);
    
    const {data:list_friend, isLoading} = useQuery({
        queryKey:["friend_not_in_room"],
        queryFn:()=>getFriendNotInRoom(Number(user_id), room_id),
        enabled: !!user_id && !!room_id
    })
    const list_friend_accepted:any = list_friend?.data;
    const onInvite = (friend_id:number)=>{
        const listTemp = listInvite;
        setListInvite([...listTemp, friend_id])
    }
    const onRemoveInvite = (friend_id:number)=>{
        const listTemp = listInvite.filter(id=>id!==friend_id);
        setListInvite(listTemp);
    }
    const isCheck = (friend_id:number) =>{
        return listInvite.find(id => id === friend_id) !== undefined;
    }
    const findFriend = async(e:ChangeEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!searchValue) return;
        await UserFindByNameOrEmail(searchValue, user_id)
        .then((data)=>{
            setListSearch(data?.data);
        })
        .catch((err)=>{
            toast({
                title:"Lỗi: "+err.message,
                variant:"destructive"
            })
        })
    }
    const onSubmitInvite = async() =>{
        if(listInvite.length === 0 || !user_id || !room_id) return;
        await createUserInvitation(listInvite, user_id, room_id)
        .then((data)=>{
            if(socket){
                toast({
                    title:"Đã gửi lời mời tham gia phòng họp"
                });
                socket.emit("invite_meeting",listInvite)
                setOpenModal(false);
            }
        })
        .catch((err)=>{
            toast({
                title:"Lỗi: " + err.message,
                variant: "destructive"
            })
        })
    }
  return (
        <>
            <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Mời tham gia cuộc họp: </h3>
                <form onSubmit={findFriend} >
                    <div className='flex space-x-2'>
                        <TextInput className='flex-auto' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} type="text" placeholder="Nhập tên người tham gia hoặc email..." />
                        <Button className='flex-none w-10' type='submit'><FaSearch className='text-xl'/></Button>
                    </div>
                </form>
            </div>
            <div className='mt-2 max-h-96 overflow-y-auto'>
                {
                    isLoading && !list_friend_accepted && 
                    <>
                        <Skeleton className='w-full h-14'/>
                        <Skeleton className='w-full h-14'/>
                        <Skeleton className='w-full h-14'/>
                    </>
                }
                {listSearch.length === 0 || !searchValue ?
                list_friend_accepted && list_friend_accepted?.length > 0 && list_friend_accepted.map((item:any)=>{
                    return(
                    <div key={item?.id}
                    onClick={!isCheck(item?.Friend_ID) ? ()=>onInvite(item?.Friend_ID):()=>onRemoveInvite(item?.Friend_ID)}
                    className="
                    cursor-pointer dark:hover:bg-gray-900 transition-all 
                    hover:bg-slate-100 flex rounded-lg border w-full border-gray-200 
                    bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 
                        p-2 items-center">
                        <div className='flex-auto'>
                            <div className="flex items-center space-x-3">
                            <div className="shrink-0">
                                <Avatar
                                alt="Neil image"
                                rounded
                                img={item["Friend.avatar"].toString() || url_img_default}
                                size={"sm"}
                                className="rounded-full"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item?.Friend_ID} {item["Friend.display_name"]}</p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item["Friend.email"]}</p>
                            </div>
                            </div>
                        </div>
                        <div>
                            {isCheck(item?.Friend_ID) ? <IoIosCheckmarkCircle className='text-2xl text-teal-500'/> : <FaRegCircle className='text-xl'/> }
                        </div>
                    </div>
                    )
                })
                : listSearch && listSearch.length > 0 && listSearch.map((item)=>{
                    return(
                    <div key={item?.id}
                    onClick={!isCheck(item?.id) ? ()=>onInvite(item?.id):()=>onRemoveInvite(item?.id)}
                    className="
                    cursor-pointer dark:hover:bg-gray-900 transition-all 
                    hover:bg-slate-100 flex rounded-lg border w-full border-gray-200 
                    bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 
                        p-2 items-center">
                        <div className='flex-auto'>
                            <div className="flex items-center space-x-3">
                            <div className="shrink-0">
                                <Avatar
                                alt="Neil image"
                                size={"sm"}
                                rounded
                                img={item?.avatar.toString() || url_img_default}
                                className="rounded-full"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item?.display_name}</p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item?.email}</p>
                            </div>
                            </div>
                        </div>
                        <div>
                            {isCheck(item?.id) ? <IoIosCheckmarkCircle className='text-2xl text-teal-500'/> : <FaRegCircle className='text-xl'/> }
                        </div>
                    </div>
                    )
                })
                }
                
            </div>
            <Button onClick={onSubmitInvite} disabled={listInvite.length === 0} className='w-full my-2'>Mời tham gia ({listInvite?.length}) <MdPersonAddAlt1 className='text-xl'/></Button>
        </>
  )
}
