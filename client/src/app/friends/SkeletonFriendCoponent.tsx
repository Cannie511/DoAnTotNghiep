import { Skeleton } from "@/components/ui/skeleton";


export default function SkeletonFriendCoponent() {
  return (
     <div className='w-52 bg-slate-800 h-[22rem] rounded-md overflow-hidden m-2'>
        <div className='h-[12rem] w-full p-2'>
            <Skeleton className="h-full w-full rounded-md" />
        </div>
        <div className='font-semibold p-2 truncate'>
            <Skeleton className="h-4 w-full" />
            <br/>
            <small><Skeleton className="h-4 w-[100px]" /></small>
        </div>
        <div className='p-2 space-y-1'>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
    </div>
  )
}
