'use client'
import { CheckIcon, ChevronRightIcon, VideoIcon } from "lucide-react";
import TiltedImage from "@/components/TiltImage";
import { motion } from "motion/react";

export default function HeroSection() {
    const specialFeatures = [
        "Live music by Chinmayi",
        "Mind-blowing magic by Vicky",
        "Fun for all ages",
    ];

    return (
        <div className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32 w-full overflow-hidden">
            <div className="absolute top-30 -z-10 left-1/4 w-72 h-72 bg-pink-600 blur-[300px]"></div>
            <motion.a href="#tickets" className="group flex items-center gap-2 rounded-full p-1 pr-3 mt-24 md:mt-44 text-pink-100 bg-pink-200/15"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <span className="bg-pink-800 text-white text-xs px-3.5 py-1 rounded-full">
                    LIVE
                </span>
                <p className="flex items-center gap-1">
                    <span>06 June 2026, Saturday • 6:30 PM - 10:00 PM • 📍 Karthipuram, Neelambur, Coimbatore</span>
                    <ChevronRightIcon size={16} className="group-hover:translate-x-0.5 transition duration-300" />
                </p>
            </motion.a>
            <motion.h1 className="text-4xl/14 md:text-6xl/21 font-medium max-w-2xl w-full text-center px-2"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                Muthamazhai{" "}
                <span className="move-gradient px-3 rounded-xl">2.0</span> 
            </motion.h1>
            <motion.p className="text-base text-center text-slate-200 max-w-lg w-full mt-6 px-2"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                Get ready for an exciting evening filled with electrifying live music by renowned singer Chinmayi and mind-blowing magic tricks by Vicky!</motion.p>
            <motion.div className="flex flex-col sm:flex-row items-center gap-4 mt-8"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <a href="/tickets" className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-7 h-11 flex items-center justify-center">
                    Book Tickets
                </a>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-12">
                {specialFeatures.map((feature, index) => (
                    <motion.p className="flex items-center gap-2" key={index}
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.3 }}
                    >
                        <CheckIcon className="size-5 text-pink-600" />
                        <span className="text-slate-400">{feature}</span>
                    </motion.p>
                ))}
            </div>
            <TiltedImage />
        </div>
    );
}