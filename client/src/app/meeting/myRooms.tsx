'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { AppContext } from '@/Context/Context'
import { getAllMyRoom } from '@/Services/room.api'
import { formatDateMessage, formatRoomKey } from '@/Utils/formatDate'
import { useQuery } from '@tanstack/react-query'
import { Clipboard, Pagination, Table } from 'flowbite-react'
import React, { useContext, useState } from 'react'

export default function MyRooms() {
    const {user_id} = useContext(AppContext);
    const [page, setPage] = useState<number>(1);
    const onPageChange = (page: number) => setPage(page);
    const {data:myRoomLs, isLoading} = useQuery({
        queryKey:['my_room_ls'],
        queryFn:()=>getAllMyRoom(Number(user_id),page),
        enabled: !!user_id
    })
    //console.log(myRoomLs?.data);
    const dataList:[] = myRoomLs?.data?.data;
  return (
    <>
    <Table>
        <Table.Head>
          <Table.HeadCell>.No</Table.HeadCell>
          <Table.HeadCell>Mã phòng</Table.HeadCell>
          <Table.HeadCell>Mật khẩu</Table.HeadCell>
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
                                <label htmlFor="npm-install" className="sr-only">
                                Label
                                </label>
                                <input
                                id="npm-install"
                                type="text"
                                className="w-fit col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                value={formatRoomKey(room?.Room_key)}
                                disabled
                                readOnly
                                />
                                <Clipboard.WithIcon valueToCopy={room?.Room_key} />
                            </div>
                            </div>
                            
                        </Table.Cell>
                        <Table.Cell>{room?.Password}</Table.Cell>
                        <Table.Cell>{formatDateMessage(room?.createdAt)}</Table.Cell>
                        <Table.Cell>{formatDateMessage(room?.updatedAt)}</Table.Cell>
                        <Table.Cell>
                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                            Edit
                        </a>
                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                            Delete
                        </a>
                        </Table.Cell>
                    </Table.Row>
                )
            })}
        </Table.Body>
      </Table>
        <div className="flex overflow-x-auto sm:justify-end">
            <Pagination currentPage={page} totalPages={2} onPageChange={onPageChange} />
        </div>
      </>
  )
}
