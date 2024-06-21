import { Metadata } from 'next';
import HomePage from './Home';
export const metadata: Metadata = {
  title:'Trang chủ',
  description:'Index page'
}

export default function Home() {
  return (
    <HomePage/>
  )
}
