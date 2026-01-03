"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppWidget() {
    return (
        <Link
            href="https://wa.me/622748609221"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 hover:scale-110 active:scale-95"
            aria-label="Contact via WhatsApp"
        >
            <MessageCircle className="h-7 w-7" />
        </Link>
    );
}
