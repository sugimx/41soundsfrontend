'use client'
import SectionTitle from "@/components/SectionTitle";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Shield, Users, Handshake } from "lucide-react";
import { motion } from "motion/react";

export default function FeaturesSection() {
    return (
        <div id="features" className="px-4 md:px-16 lg:px-24 xl:px-32 w-full overflow-hidden">
            {/* About The Event Night */}
            <SectionTitle text1="About" text2="The Event Night" text3="Step into a night where every detail is designed to leave you in awe. ✨" />
            
            <div className="mt-16 relative mx-auto max-w-5xl overflow-hidden">
                <div className="absolute -z-50 w-96 h-96 -top-10 left-0 aspect-square rounded-full bg-pink-500/40 blur-3xl"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        className="space-y-6"
                    >
                        <p className="text-slate-300 text-lg leading-relaxed">
                            From the moment you arrive, you're welcomed into an atmosphere of elegance—luxurious seating arrangements crafted for comfort and connection, giving you the perfect view of a spectacular stage that radiates energy and grandeur.
                        </p>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            The stage itself is a masterpiece, brought to life with breathtaking lighting that dances across the night, creating a visual symphony you won't forget.
                        </p>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            Every corner glows with vibrant colors, every moment feels electric, and every experience is carefully curated to make you feel part of something extraordinary.
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <Image className="rounded-2xl" src="/assets/chinmayi-pic.jpeg" alt="concert stage" width={1000} height={500} />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    {[
                        { icon: <Shield className="size-8 text-pink-500" />, title: "World-Class Security", desc: "Immerse yourself freely—relaxed, confident, and fully present." },
                        { icon: <Users className="size-8 text-pink-500" />, title: "Meet Personalities", desc: "A rare chance to meet renowned personalities and exchange ideas." },
                        { icon: <Handshake className="size-8 text-pink-500" />, title: "Build Connections", desc: "Conversations turn into collaborations, introductions become partnerships." },
                        { icon: <Sparkles className="size-8 text-pink-500" />, title: "Expand Your Network", desc: "Grow your network and elevate your brand visibility." },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="p-6 rounded-xl border border-slate-800 bg-slate-950/50"
                            initial={{ y: 150, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            <div className="p-3 rounded-full bg-pink-600/20 w-fit mb-4">
                                {item.icon}
                            </div>
                            <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Inserted image between features and 3D banner */}
                <div className="flex justify-center mt-16">
                    <Image
                        src="/assets/Banner3.jpeg"
                        alt="Event highlight"
                        width={800}
                        height={400}
                        className="rounded-xl shadow-lg border border-slate-800"
                    />
                </div>

                <motion.div
                    className="mt-16 p-8 rounded-2xl border border-pink-800/50 bg-linear-to-br from-pink-950/50 to-slate-950"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <p className="text-slate-200 text-xl leading-relaxed text-center">
                        This isn't just an event—it's an opportunity. Whether you're looking to expand your business, grow your network, or elevate your brand visibility, this night opens doors you didn't even know existed.
                    </p>
                    <p className="text-pink-400 text-2xl font-semibold text-center mt-6">
                        A colorful, unforgettable, once-in-a-lifetime experience—this is the night you'll talk about long after it's over. 🌟
                    </p>
                </motion.div>
            </div>

            {/* About Us */}
            <div className="mt-40 relative mx-auto max-w-5xl overflow-hidden">
                <div className="absolute -z-50 w-96 h-96 -top-10 right-0 aspect-square rounded-full bg-pink-500/40 blur-3xl"></div>
                
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <h2 className="text-pink-600 text-sm font-medium uppercase tracking-wider">About Us</h2>
                    <h3 className="text-3xl md:text-4xl font-semibold text-white mt-2">41Sounds</h3>
                    <p className="text-slate-400 mt-2">Creating unforgettable musical experiences</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
                    <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <Image src="/assets/vicky-pic.jpg" alt="41Sounds event" width={1000} height={500} className="rounded-2xl hover:-translate-y-0.5 transition duration-300" />
                    </motion.div>
                    
                    <motion.div
                        className="space-y-6"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <p className="text-slate-300 text-lg leading-relaxed">
                            At 41Sounds, we don't just organize events—we create unforgettable musical experiences that resonate long after the final note fades.
                        </p>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            Founded with a passion for music and a vision to elevate live entertainment, 41Sounds specializes in curating and executing high-impact musical events featuring reputed artists from across the industry.
                        </p>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            From intimate, soul-stirring performances to large-scale, high-energy concerts, we bring sound, stage, and audience together in perfect harmony.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-12 space-y-6"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <p className="text-slate-300 text-lg leading-relaxed">
                        What sets us apart is our commitment to excellence and our strong network of collaborations. We proudly partner with renowned businessmen, prestigious organizations, and influential brands to deliver events that are not only entertaining but also professionally seamless and strategically impactful.
                    </p>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Our team blends creativity with precision—handling everything from artist curation and event planning to production and audience engagement. Every event we design is tailored to leave a lasting impression, ensuring our partners and audiences experience nothing but the best.
                    </p>
                    <a href="#pricing" className="group inline-flex items-center gap-2 mt-4 text-pink-600 hover:text-pink-700 transition">
                        Get your tickets now
                        <ArrowUpRight className="size-5 group-hover:translate-x-0.5 transition duration-300" />
                    </a>
                </motion.div>
            </div>
        </div>
    );
}