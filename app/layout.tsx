import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LenisScroll from "@/components/LenisScroll";
import { AuthProvider } from "@/lib/auth-context";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata = {
    title: "41 Sounds - Buy Live Concert Tickets Online | Chinmayi Live Music Event",
    description: "Book tickets for Chinmayi Live Concert - 41 Sounds. Experience Muthamazhai 2.0 in Coimbatore on 16 May 2026. Secure online ticketing.",
    keywords: "concert tickets, live music, Chinmayi concert, music event, ticket booking, live performance, Coimbatore events, music festival, concert tickets online, event booking",
    openGraph: {
        title: "41 Sounds - Live Concert Tickets | Chinmayi Music Event",
        description: "Book your tickets for Chinmayi Live Concert - 41 Sounds. Muthamazhai 2.0 on 16 May 2026 in Coimbatore.",
        type: "website",
    },
};

export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={{ width: '100%', minHeight: '100%' }}>
            <head>
                {/* Google Analytics (gtag.js) */}
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-6Z10BNN7T2"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());

                            gtag('config', 'G-6Z10BNN7T2');`,
                    }}
                />
                {/* End Google Analytics */}
                {/* Google Sign-In Script */}
                <script src="https://accounts.google.com/gsi/client" async defer></script>
                {/* End Google Sign-In */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preload" href="/assets/background-splash.svg" as="image" />
            </head>
            <body style={{ width: '100%', minHeight: '100%' }}>
                <AuthProvider>
                    <LenisScroll />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}