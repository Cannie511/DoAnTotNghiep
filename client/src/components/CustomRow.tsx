import React, { ReactNode } from "react";

interface Props {
    children: ReactNode;
}
 const CustomRow: React.FC<Props>=({children})=> {
  return (
    <div className="grid grid-cols-3 w-full py-1">
        {children}
    </div>
  )
}
export default CustomRow