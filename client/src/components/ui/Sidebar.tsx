import { Sidebar } from "flowbite-react";
import NavLink from "./NavLink";
import '@/styles/Sidebar.css';
import { MdManageAccounts, MdVideoCameraFront } from "react-icons/md";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { countNotification } from "@/Services/notification.api";
import { useContext } from "react";
import { AppContext } from "@/Context/Context";
import { BsPersonFillAdd } from "react-icons/bs";
import { PiUserListFill } from "react-icons/pi";
interface Item {
  id:number;
  lable:string;
  href:string;
}
export default function SideBar() {
  const {user_id} = useContext(AppContext);
  const {data, isLoading, error} = useQuery({
        queryKey:['message_noti'],
        queryFn: ()=>countNotification({user_id:user_id, type:"message"}),
        enabled:!!user_id,
    })
  let message_noti = data?.data;
  return (
    <>
    <Sidebar className="h-screen fixed transition-all sm:translate-x-0 -translate-x-full" aria-label="Sidebar with content separator example">
      <Sidebar.Items className="mt-20">
        <Sidebar.ItemGroup className="space-y-8 ">
          <NavLink href="/profile" className="items-center sidebar-items text-lg font-bold text-start flex rounded-lg p-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <MdManageAccounts/> Tài khoản
          </NavLink>
          <NavLink href="/chat" className=" items-center sidebar-items flex rounded-lg p-3 text-lg font-bold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <IoChatbubbleEllipses/> Trò chuyện 
            {message_noti && 
              <div className='w-5 h-5 flex items-center justify-center rounded-full bg-red-600 absolute mt-1 ml-40 text-xs text-white'>{String(message_noti)}</div>
            }
          </NavLink>
          <NavLink href="/meeting" className="items-center sidebar-items flex rounded-lg p-3 text-lg font-bold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
           <MdVideoCameraFront/> Phòng họp
          </NavLink>
          <NavLink href="/schedule" className="items-center sidebar-items flex rounded-lg p-3 text-lg font-bold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
           <FaCalendarAlt/> Lịch trình
          </NavLink>
          <Sidebar.Collapse icon={FaUserFriends} label="Bạn bè">
            <NavLink href="/friends" className="items-center sidebar-items flex rounded-lg p-3 text-lg font-bold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
              <BsPersonFillAdd/> Lời mời kết bạn
            </NavLink>
            <NavLink href="/friend-list" className="items-center sidebar-items flex rounded-lg p-3 text-lg font-bold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
              <PiUserListFill/> Tất cả bạn bè
            </NavLink>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </>
  )
}
