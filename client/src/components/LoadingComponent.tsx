'use client'
import '../styles/loading.css'

export default function LoadingComponent() {
    return (
        <>
         <div className="line-loading fixed -left-72 -top-20" style={{zIndex:100, width:'150%'}}></div>
        </>
    )
}
