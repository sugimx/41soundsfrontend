'use client'
import SectionTitle from "@/components/SectionTitle";
import { InstagramIcon, MailIcon, PhoneIcon } from "lucide-react";
import { motion } from "motion/react";

export default function ContactSection() {
    return (
        <div id="contact" className="px-4 md:px-16 lg:px-24 xl:px-32 w-full overflow-hidden">
            <SectionTitle text1="Contact" text2="Get in touch" text3="Have questions about the concert? Reach out to us through any of these channels." />
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mt-16 max-w-4xl mx-auto">
                <motion.a 
                    href="tel:+919345510582"
                    className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-slate-800 bg-slate-950/50 hover:border-pink-600 transition-all w-full max-w-xs"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <div className="p-4 rounded-full bg-pink-600/20">
                        <PhoneIcon className="size-8 text-pink-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-slate-400 text-sm mb-1">Phone</p>
                        <p className="text-white font-semibold text-lg">+91 93455 10582</p>
                    </div>
                </motion.a>

                <motion.a 
                    href="mailto:connect@41sounds.com"
                    className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-slate-800 bg-slate-950/50 hover:border-pink-600 transition-all w-full max-w-xs"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <div className="p-4 rounded-full bg-pink-600/20">
                        <MailIcon className="size-8 text-pink-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-slate-400 text-sm mb-1">Email</p>
                        <p className="text-white font-semibold text-lg">connect@41sounds.com</p>
                    </div>
                </motion.a>

                <motion.a 
                    href="https://www.instagram.com/41__sounds/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-slate-800 bg-slate-950/50 hover:border-pink-600 transition-all w-full max-w-xs"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <div className="p-4 rounded-full bg-pink-600/20">
                        <InstagramIcon className="size-8 text-pink-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-slate-400 text-sm mb-1">Instagram</p>
                        <p className="text-white font-semibold text-lg">@41sounds</p>
                    </div>
                </motion.a>
            </div>
        </div>
    );
}