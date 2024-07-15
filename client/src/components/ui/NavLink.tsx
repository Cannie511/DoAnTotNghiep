'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface Props {
    href: string;
    children: React.ReactNode;
    className: string;
}

export default function NavLink({ href, children, className }:Props) {
    const router = usePathname();
    return (
        <Link href={href} className={router === href ? className + ' active': className}>
            {children}
        </Link>
    );
}