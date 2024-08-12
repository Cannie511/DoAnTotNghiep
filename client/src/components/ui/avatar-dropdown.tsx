'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Button } from './button'
import Image, { StaticImageData } from 'next/image'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { AppContext } from '@/Context/Context'
import { AuthLogout } from '@/Services/auth.api'
import { useToast } from './use-toast'
import { Avatar } from 'flowbite-react'
import { url_img_default } from '@/images/image'

interface Props {
    srcImg: StaticImageData | string;
}

export default function AvatarDropdown({srcImg}:Props) {
  const router = useRouter();
  const {toast} = useToast();
  const {display_name,setLoading ,user_data, avatar} = useContext(AppContext)
  const {theme, setTheme} = useTheme();
  
  const handleLogout =async ()=>{
    try {
      const res = await AuthLogout(Number(user_data?.id));
      if(res?.status === 200) {
        setLoading(true);
        localStorage.removeItem('user_data');
        router.push('/login');
      }
      else
        toast({
          title:"Lỗi",
          description: res?.data,
          variant: "destructive",
        })
    } catch (error) {
      console.log(error)
      toast({
          title:"Lỗi",
          description: "Lỗi server",
          variant: "destructive",
        })
    }finally{
      setLoading(false)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
            <Avatar className='rounded-full' rounded img={avatar || url_img_default} size={"sm"} alt=''/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={()=>router.push('/profile')}>
          <span className='hidden md:block'>Tài khoản của tôi</span>
          <span className='block md:hidden'>{display_name}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className='block md:hidden' onClick={theme === 'light' ? ()=>setTheme('dark'):()=>setTheme('light')}>
          Giao diện: {theme === 'light' ? 'Sáng':'Tối'}
        </DropdownMenuItem>
        <hr />
        <DropdownMenuItem onClick={handleLogout}>
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
