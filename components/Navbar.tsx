'use client'
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { navlinks } from "@/data/navlinks";
import { INavLink } from "@/types";
import { NavbarAuthSection, NavbarMobileAuthSection } from "./NavbarAuthSection";


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full max-w-full py-2 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                {/* Logo */}
                <a href="/" className="flex items-center">
                    <Image src="/assets/41logo.svg" alt="41 Sounds Logo" width={64} height={64} className="mr-2" priority />
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    {navlinks.map((link: INavLink) => (
                        <Link key={link.name} href={link.href} className="hover:text-pink-500 transition">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Section - Rendered by separate client component */}
                <div className="flex items-center gap-4">
                    <NavbarAuthSection />
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(true)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </motion.nav>

            {/* Mobile Navigation */}
            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {navlinks.map((link: INavLink) => (
                    <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                        {link.name}
                    </Link>
                ))}

                {/* Mobile Auth Section - Rendered by separate client component */}
                <NavbarMobileAuthSection onClose={() => setIsOpen(false)} />

                <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}