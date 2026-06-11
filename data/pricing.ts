import { IPricing } from "@/types";

export const pricingData: IPricing[] = [
    {
        name: "Gold",
        price: 800,
        period: "ticket",
        features: [
            "General admission entry",
            "Seating access",
            "Food court access",
            "Digital concert program"
        ],
        mostPopular: false,
        color: "dark-yellow"
    },
    {
        name: "Platinum",
        price: 1200,
        period: "ticket",
        features: [
            "Premium seating",
            "Priority entry",
            "Food court access",
            "Digital concert program"
        ],
        mostPopular: false,
        color: "navi-blue"
    },
    {
        name: "VIP",
        price: 2000,
        period: "ticket",
        features: [
            "Front row seating",
            "Exclusive VIP lounge access",
            "Food court access",
            "Meet & greet opportunity",
            "Priority parking",
            "Close look with artists"
        ],
        mostPopular: true,
        color: "dark-pink"
    },
    {
        name: "MVIP",
        price: 5000,
        period: "ticket",
        features: [
            "Front row seating",
            "Exclusive VIP lounge access",
            "Food court access",
            "Meet & greet opportunity",
            "Priority parking",
            "Close look with artists",
            "Signed merchandise"
        ],
        mostPopular: false,
        color: "deep-purple"
    }
];