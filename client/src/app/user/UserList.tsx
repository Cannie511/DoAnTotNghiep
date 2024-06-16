'use client'
import { AppContext } from '@/Context/Context';
import { getUsers } from '@/Services/auth.api';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Pagination, Table } from 'flowbite-react';
import React, { useContext } from 'react'

export default function UserList() {
  const {setForceLogout} = useContext(AppContext)
  const {data, isLoading, error} = useQuery({
        queryKey:['List user'],
        queryFn: ()=>getUsers(),
    })
    if(error) setForceLogout(true);
  return (
    <div className="w-full">
      <Table>
        <Table.Head>
          <Table.HeadCell>.No</Table.HeadCell>
          <Table.HeadCell>Account name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Language</Table.HeadCell>
          <Table.HeadCell>Premium</Table.HeadCell>
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
            {!isLoading && data?.data?.data.map((user:any, index:number)=>{
                return(
                    <Table.Row key={user?.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {user.display_name}
                        </Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.language === 1 ? 'Tiếng Việt' : 'Tiếng Anh'}</Table.Cell>
                        <Table.Cell>{user?.premium === 1 ? 'Có': 'Không'}</Table.Cell>
                        <Table.Cell>
                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                            Edit
                        </a>
                        </Table.Cell>
                    </Table.Row>
                )
            })}
          
        </Table.Body>
      </Table>
      {data && data.data &&
            <div className='float-end'>
                <Pagination currentPage={+data?.data?.currentPage} totalPages={+data?.data?.total} showIcons onPageChange={()=>{}} />
            </div>
      }
    </div>
  )
}
