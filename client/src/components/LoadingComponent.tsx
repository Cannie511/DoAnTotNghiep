'use client'
import '../styles/loading.css'

export default function LoadingComponent() {
    return (
        <>
         <div className="line-loading fixed -left-72 -top-10" style={{zIndex:100, width:'120%'}}></div>
        </>
    )
}
