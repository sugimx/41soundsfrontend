'use client'
import { motion } from "motion/react";
import Image from "next/image";

export default function CTASection() {
    return (
        <div className="px-4 md:px-16 lg:px-24 xl:px-32 w-full overflow-hidden">
        <motion.div className="max-w-5xl py-16 mt-40 md:pl-20 md:w-full max-md:mx-4 md:mx-auto flex flex-col md:flex-row max-md:gap-6 items-center justify-between text-left bg-linear-to-b from-pink-900 to-pink-950 rounded-2xl p-6 text-white"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
            <div className="flex-1">
                <motion.div className="mb-6"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    <Image
                        src="/assets/boomblu.png"
                        alt="BoomBlu Logo"
                        width={200}
                        height={80}
                        className="object-contain"
                    />
                </motion.div>
                <motion.h1 className="text-4xl md:text-[46px] md:leading-15 font-semibold bg-linear-to-r from-white to-pink-400 text-transparent bg-clip-text"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    Discover BoomBlu
                </motion.h1>
                <motion.p className="bg-linear-to-r from-white to-pink-400 text-transparent bg-clip-text text-lg"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
                >
                    41Sounds is title sponsored by BoomBlu, a leading provider of high-quality modern washing liquid.
                </motion.p>
            </div>
            <motion.a 
                href="https://www.boomblu.com"
                target="_blank"
                className="px-12 py-3 text-slate-800 bg-white hover:bg-slate-200 rounded-full text-sm mt-4"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
            >
                Visit BoomBlu
            </motion.a>
        </motion.div>
        </div>
    );
}