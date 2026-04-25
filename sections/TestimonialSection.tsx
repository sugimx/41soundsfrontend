'use client'
import SectionTitle from "@/components/SectionTitle";
import { motion } from "motion/react";

export default function TestimonialSection() {
    return (
        <div id="seat" className="px-4 md:px-16 lg:px-24 xl:px-32 w-full overflow-hidden">
            <SectionTitle text1="Seat" text2="Seating Information" text3="View the seating arrangement for the concert and choose your preferred spot." />

            <motion.div 
                className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl"
                initial={{ y: 150, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <div className="aspect-square relative bg-white p-4 rounded-xl">
                    <img 
                        src="/assets/seating.jpeg" 
                        alt="Seating Arrangement" 
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="text-center mt-6">
                    <p className="text-slate-800 font-semibold text-lg">Seating Plan</p>
                    <p className="text-slate-500 text-sm mt-2">View the seating chart to select your seat for the concert.</p>
                </div>
            </motion.div>

            <motion.div 
                className="max-w-2xl mx-auto mt-8 text-center"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <p className="text-slate-400 text-sm">
                    For seat reservations or inquiries, please contact us via WhatsApp or email.
                </p>
            </motion.div>
        </div>
    );
}