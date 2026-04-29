import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

export const metadata = {
    title: "41 Sounds - Live Concert",
    description: "Chinmayi Live Concert – Muthamazhai 2.0 | Coimbatore | 06 June 2026, 6:30 PM",
    keywords: "concert tickets, live music tickets, Chinmayi concert, music events, ticket booking online, live performance, Coimbatore concert, music show, event ticketing, concert experience",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, width: '100%' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}