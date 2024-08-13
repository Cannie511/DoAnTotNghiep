import { ModeToggle } from "./mode-toggle";

export default function NavLogin() {
  return (
    <>
    <nav className="fixed top-0 z-50 w-screen bg-white shadow-md dark:bg-gray-900">
        <div className="max-w-screen-3xl flex flex-wrap items-center justify-center mx-auto p-4">
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