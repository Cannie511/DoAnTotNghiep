import { Sidebar } from "flowbite-react";
import NavLink from "./NavLink";
import '@/styles/Sidebar.css';
import { MdManageAccounts, MdVideoCameraFront } from "react-icons/md";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
export default function SideBar() {
  return (
    <>
    <Sidebar className="h-screen fixed transition-all sm:translate-x-0 -translate-x-full" aria-label="Sidebar with content separator example">
      <Sidebar.Items className="mt-16">
        <Sidebar.ItemGroup>
          <NavLink href="/profile" className="sidebar-items text-start flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <MdManageAccounts/> Tài khoản
          </NavLink>
          <NavLink href="/chat" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <IoChatbubbleEllipses/> Trò chuyện
          </NavLink>
          <NavLink href="/blog" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
           <FaRegNewspaper/> Bài đăng
          </NavLink>
          <NavLink href="/meeting" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
           <MdVideoCameraFront/> Phòng họp
          </NavLink>
          <NavLink href="/schedule" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
           <FaCalendarAlt/> Lịch trình
          </NavLink>
          <hr/>
          <NavLink href="/friends" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
           <FaUserFriends/> Bạn bè
          </NavLink>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </>
  )
}
