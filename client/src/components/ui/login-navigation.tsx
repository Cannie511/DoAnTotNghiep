import favicon from "@/app/favicon.ico";
import AvatarDropdown from "./avatar-dropdown";
import { ModeToggle } from "./mode-toggle";

export default function NavLogin() {
  return (
    <>
    <nav className="fixed top-0 z-50 w-screen bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-3xl flex flex-wrap items-center justify-between mx-auto p-4">
            <button data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>
            <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                <b className="text-3xl text-indigo-600">Freet</b>
            </a>
            <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <ModeToggle/>
            </div>
        </div>
    </nav>
    </>
  )
}
