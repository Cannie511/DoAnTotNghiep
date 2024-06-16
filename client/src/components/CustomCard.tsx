import React, { ReactNode } from "react";

interface Props {
    children: ReactNode;
  }
const CustomCard: React.FC<Props> = ({children}) => {
  return (
    <div className='md:w-full bg-slate-100 flex flex-row justify-between rounded-2xl p-3 shadow-md'>
        {children}
    </div>
  )
}
export default CustomCard
