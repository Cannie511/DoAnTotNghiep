'use client'
import favicon from "@/app/favicon.ico";
import AvatarDropdown from "./avatar-dropdown";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import NavLink from "./NavLink";
import './UI.css';
import { IoHome } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { Tooltip } from "flowbite-react";
import DropdownDefault from "./dropdownDefault";
import { useEffect, useState } from "react";
import DrawerNavbar from "./Drawer";
import { usePathname } from "next/navigation";
export default function Navbar() {
    const [openSideBarMobile, setSidebarMobile] = useState<boolean>(false);
    const pathname = usePathname();
    useEffect(()=>{
        setSidebarMobile(false);
    },[pathname])
  return (
    <>
    <nav className="fixed top-0 z-50 w-screen bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-3xl flex flex-wrap items-center justify-between mx-auto p-4">
            <button onClick={()=>setSidebarMobile(true)} data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <b className="text-3xl text-indigo-600">Freet</b>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <ModeToggle/>
            <div className="me-1 flex">
                <AvatarDropdown srcImg={favicon}/>
            </div>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" >
            {/* <ul  className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
                <NavLink href="/local_" 
                className="text-gray-500 navbar-items block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                    <Tooltip content="Trang chủ">
                        <IoHome className="text-3xl"/>
                    </Tooltip>
                </NavLink>
            </li>
            <li>
                <NavLink href="/user" className="navbar-items block py-2 px-3 text-gray-500 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    <Tooltip content="Danh sách bạn bè">
                        <FaUsers className="text-3xl"/>
                    </Tooltip>
                </NavLink>
            </li>
            <li className="text-gray-500 dark:text-white">
                <Tooltip content="Thông báo">
                    <DropdownDefault/>
                </Tooltip>
            </li>
            </ul> */}
        </div>
        </div>
        <DrawerNavbar isOpen={openSideBarMobile} setIsOpen={setSidebarMobile}/>
        </nav>
    </>
  )
}
