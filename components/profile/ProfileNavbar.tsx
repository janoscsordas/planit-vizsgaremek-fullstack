"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileNavbar() {

    const navLinks = [
        { name: "Profil", href: "/profile" },
        { name: "Megjelenés", href: "/appearance" },
    ]

    const pathname = usePathname();

    return (
        <div className="flex flex-col space-y-8 mb-8 md:mb-0 md:flex-row md:space-x-12 md:space-y-0">
            <aside className="-mx-0 md:-mx-4 md:w-64">
                <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1">
                    {navLinks.map((link) => {
                        const isActive = (href: string) => pathname.startsWith(href);

                        return (
                            <Link href={link.href} key={link.name} className={`text-sm font-medium rounded-md px-4 py-2 ${isActive(link.href) ? "bg-emerald-hover" : "hover:bg-[#272729]"}`}>
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </div>
    )
}

