'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { AppContext } from '@/Context/Context'
import { deleteRoom, getAllMyRoom } from '@/Services/room.api'
import { formatDateMessage, formatRoomKey } from '@/Utils/formatDate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Clipboard, Pagination, Table, TextInput, Tooltip } from 'flowbite-react'
import { FaRegTrashAlt } from "react-icons/fa";
import { FaDoorOpen } from "react-icons/fa";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlinePassword } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import { useToast } from '@/components/ui/use-toast'
import ModalRoom from './ModalRoom'
import { IoIosClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

export default function MyRooms() {
    const {user_id} = useContext(AppContext);
    const [showPassword, setShowPassword] = useState<boolean>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isPending, setPending] = useState<boolean>(false);
    const [editingRoom, setEditingRoom] = useState<number>(-1);
    const [room_id, setRoom_id] = useState<number>(-1);
    const passwordRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    
    const {toast} = useToast();
    const [page, setPage] = useState<number>(1);
    const onPageChange = (page: number) => setPage(page);
    const {data:myRoomLs, isLoading} = useQuery({
        queryKey:['my_room_ls'],
        queryFn:()=>getAllMyRoom(Number(user_id),page),
        enabled: !!user_id
    })
    const dataList:[] = myRoomLs?.data?.data;
    useEffect(()=>{
        if(passwordRef.current){
            passwordRef.current.focus();
        }
    },[])
    const onConfirm = (id:number) =>{
        setRoom_id(id);
        setOpenModal(true);
    }
    const onDeleteRoom = async() =>{
        if(room_id === -1) return;
        setPending(true)
        await deleteRoom(room_id)
        .then(()=>{
            toast({
                title:"Thông báo!",
                description:"Bạn đã xóa phòng thành công!"
            })
            setOpenModal(false)
            queryClient.invalidateQueries({queryKey:["my_room_ls"]})
        })
        .catch((err)=>{
           toast({
                title:"Lỗi: " + err.message,
                variant:"destructive"
            }) 
        })
        .finally(()=>{
            setPending(false)
        })
    }
    const onChangePassword = async() =>{
        setEditingRoom(-1)
    }
  return (
    <>
    <Table>
        <Table.Head>
          <Table.HeadCell>.No</Table.HeadCell>
          <Table.HeadCell>Mã phòng</Table.HeadCell>
          <Table.HeadCell className='flex items-center'>Mật khẩu 
            <Tooltip content={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}>
                <div onClick={()=>setShowPassword(!showPassword)}
                className='w-8 h-8 rounded-full bg-none ml-2 text-indigo-500 transition-all hover:bg-white hover:bg-opacity-50 hover:text-white cursor-pointer flex items-center justify-center'>
                    {showPassword ? <FaEyeSlash className='text-xl'/> : <IoEyeSharp className='text-xl'/>}
                </div>
            </Tooltip>
          </Table.HeadCell>
          <Table.HeadCell>Ngày tạo</Table.HeadCell>
          <Table.HeadCell>Cập nhật lần cuối</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
            {isLoading &&
            <>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell colSpan={6}><Skeleton className="h-4 w-full" /></Table.Cell>
            </Table.Row>
             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell colSpan={6}><Skeleton className="h-4 w-full" /></Table.Cell>
            </Table.Row>
             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell colSpan={6}><Skeleton className="h-4 w-full" /></Table.Cell>
            </Table.Row>
            </>
           
            }
            {dataList && dataList.length > 0 && dataList.map((room:any, index:number)=>{
                return(
                    <Table.Row key={room?.id}  className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <div className="grid w-full max-w-64">
                            <div className="relative">
                                <input
                                id="npm-install"
                                type="text"
                                className="w-fit col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                value={formatRoomKey(room?.Room_key)}
                                disabled
                                readOnly
                                />
                                <Tooltip className='fixed ml-52 -mt-8' content="Sao chép mã phòng">
                                    <Clipboard.WithIcon valueToCopy={room?.Room_key} />
                                </Tooltip>
                            </div>
                            </div>
                            
                        </Table.Cell>
                        <Table.Cell>
                            {editingRoom === room?.id ? <TextInput placeholder='Mật khẩu . . .' className='w-36' ref={passwordRef} value={room?.Password} /> :
                                showPassword ? room?.Password : <span className='font-bold text-xl'>**********</span>
                            }
                        </Table.Cell>
                        <Table.Cell>{formatDateMessage(room?.createdAt)}</Table.Cell>
                        <Table.Cell>{formatDateMessage(room?.updatedAt)}</Table.Cell>
                        <Table.Cell className='flex space-x-2 items-center'>
                        {editingRoom === +room?.id  ?
                            <>
                                <Tooltip content="Lưu mật khẩu">
                                    <div onClick={onChangePassword} className='w-8 h-8 rounded-full bg-green-600 text-white transition-all hover:bg-opacity-50 hover:text-white cursor-pointer flex items-center justify-center'>
                                        <FaCheck className='text-xl'/>
                                    </div>
                                </Tooltip>
                                <Tooltip content="Hủy">
                                    <div onClick={onChangePassword} className='w-8 h-8 rounded-full bg-red-600 text-white transition-all hover:bg-opacity-50 hover:text-white cursor-pointer flex items-center justify-center'>
                                        <IoIosClose className='text-4xl'/>
                                    </div>
                                </Tooltip>
                            </>
                            :
                            <Tooltip content="Thay đổi mật khẩu">
                                <div onClick={()=>setEditingRoom(room?.id)} className='w-10 h-10 rounded-full bg-none text-blue-500 transition-all hover:bg-white hover:bg-opacity-50 hover:text-white cursor-pointer flex items-center justify-center'>
                                    <MdOutlinePassword className='text-3xl'/>
                                </div>
                            </Tooltip>
                        }
                        <Tooltip content="Tham gia phòng">
                            <div className='w-10 h-10 rounded-full bg-none text-yellow-300 transition-all hover:bg-white hover:bg-opacity-50 hover:text-white cursor-pointer flex items-center justify-center'>
                                <FaDoorOpen className='text-3xl'/>
                            </div>
                        </Tooltip>
                        <Tooltip content="Xóa phòng">
                            <div onClick={()=>onConfirm(room?.id)} className='w-10 h-10 rounded-full bg-none text-red-500 transition-all hover:bg-white hover:bg-opacity-50 hover:text-white cursor-pointer flex items-center justify-center'>
                                <FaRegTrashAlt className='text-2xl'/>
                            </div>
                        </Tooltip>
                        </Table.Cell>
                    </Table.Row>
                )
            })}
        </Table.Body>
      </Table>
        <div className="flex overflow-x-auto sm:justify-end">
            <Pagination currentPage={page} totalPages={2} onPageChange={onPageChange} />
        </div>
        <ModalRoom isLoading={isPending} onClick={onDeleteRoom} openModal={openModal} setOpenModal={setOpenModal} type='delete'/>
      </>
  )
}
