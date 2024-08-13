import { Drawer, Sidebar } from "flowbite-react";
import { Dispatch, SetStateAction } from "react";
import '@/styles/Sidebar.css';
import { MdManageAccounts, MdVideoCameraFront } from "react-icons/md";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";
import { PiUserListFill } from "react-icons/pi";
import { GrHomeRounded } from "react-icons/gr";
import NavLink from "./NavLink";

interface Props{
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DrawerNavbar = ({isOpen, setIsOpen}:Props) => {
    const handleClose = () => setIsOpen(false);
  return (
    <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header title="Freet" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0">
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <NavLink href="/local_" className="items-center sidebar-items text-lg font-bold text-start flex rounded-lg p-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                        <GrHomeRounded/> Trang chủ
                    </NavLink>
                    <NavLink href="/profile" className="items-center sidebar-items text-lg font-bold text-start flex rounded-lg p-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                        <MdManageAccounts/> Tài khoản
                    </NavLink>
                    <NavLink href="/chat" className=" items-center sidebar-items flex rounded-lg p-3 text-lg font-bold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                        <IoChatbubbleEllipses/> Trò chuyện 
                    </NavLink>
                    <NavLink href="/meeting" className="items-center sidebar-items flex rounded-lg p-3 text-lg font-bold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <MdVideoCameraFront/> Phòng họp
                    </NavLink>
                    <NavLink href="/schedule" className="items-center sidebar-items flex rounded-lg p-3 text-lg font-bold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <FaCalendarAlt/> Lịch họp
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
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
  )
}

export default DrawerNavbar