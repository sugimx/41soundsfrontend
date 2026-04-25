import { IFooter } from "@/types";

export const footerData: IFooter[] = [
    {
        title: "Event",
        links: [
            { name: "Home", href: "#" },
            { name: "Pricing", href: "#pricing" },
            { name: "About", href: "#features" },
            { name: "Seat", href: "#seat" },
            { name: "Contact", href: "#contact" },
        ]
    },
    // {
    //     title: "Info",
    //     links: [
    //         { name: "Artists", href: "#artists" },
    //         { name: "Venue", href: "#venue" },
    //         { name: "Schedule", href: "#schedule" },
    //         { name: "FAQ", href: "#faq" },
    //     ]
    // },
    {
        title: "Legal",
        links: [
            { name: "Terms", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Refund Policy", href: "/refunds" },
        ]
    }
];