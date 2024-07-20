import { Metadata } from 'next';
import dynamic from 'next/dynamic';
export const metadata: Metadata = {
  title:'Trang chủ',
  description:'Index page'
}
const HomePage = dynamic(() => import('./Home'), { ssr: false });
const Home = () => {
  return (
    <HomePage />
  );
};
export default Home;