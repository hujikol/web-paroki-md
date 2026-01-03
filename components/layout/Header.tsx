"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    title: string;
    href?: string;
    items?: NavItem[];
}

const navItems: NavItem[] = [
    {
        title: "Profil Gereja",
        items: [
            { title: "Profil & Selayang Pandang", href: "/profil" },
            { title: "Sejarah", href: "/profil/sejarah" },
            { title: "Pastor Paroki dan Tim Kerja", href: "/profil/pastor-tim" },
            { title: "Lingkungan", href: "/profil/lingkungan" },
        ],
    },
    {
        title: "Gereja",
        items: [
            { title: "Gereja 1", href: "/gereja/gereja-1" },
            { title: "Gereja 2", href: "/gereja/gereja-2" },
            { title: "Gereja 3", href: "/gereja/gereja-3" },
            { title: "Gereja 4", href: "/gereja/gereja-4" },
            { title: "Gereja 5", href: "/gereja/gereja-5" },
        ],
    },
    {
        title: "Informasi",
        items: [
            { title: "Warta Paroki", href: "/warta-paroki" },
            { title: "Formulir Gereja", href: "/data/formulir" },
        ],
    },
    {
        title: "Data UMKM",
        href: "/data/umkm",
    },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

    const toggleDropdown = (title: string) => {
        setOpenDropdown(openDropdown === title ? null : title);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold">
                            P
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-sm font-bold text-brand-dark">Paroki Brayut</div>
                            <div className="text-xs text-gray-600">Santo Yohanes Paulus II</div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
                    {navItems.map((item) => (
                        <div key={item.title} className="relative group">
                            {item.items ? (
                                <div>
                                    <button
                                        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors"
                                        onMouseEnter={() => setOpenDropdown(item.title)}
                                    >
                                        {item.title}
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    {openDropdown === item.title && (
                                        <div
                                            className="absolute left-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1"
                                            onMouseLeave={() => setOpenDropdown(null)}
                                        >
                                            {item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href || "#"}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-cream hover:text-brand-blue transition-colors"
                                                >
                                                    {subItem.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={item.href || "#"}
                                    className="text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors"
                                >
                                    {item.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
                    <Link
                        href="/jadwal-misa"
                        className="rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-darkBlue transition-colors"
                    >
                        Jadwal Misa
                    </Link>
                    <Link
                        href="/contact"
                        className="rounded-full border border-brand-blue px-6 py-2.5 text-sm font-semibold text-brand-blue hover:bg-brand-cream transition-colors"
                    >
                        Donate Us
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Toggle menu</span>
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t bg-white">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navItems.map((item) => (
                            <div key={item.title}>
                                {item.items ? (
                                    <div>
                                        <button
                                            onClick={() => toggleDropdown(item.title)}
                                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            {item.title}
                                            <ChevronDown
                                                className={cn(
                                                    "h-4 w-4 transition-transform",
                                                    openDropdown === item.title && "rotate-180"
                                                )}
                                            />
                                        </button>
                                        {openDropdown === item.title && (
                                            <div className="ml-4 space-y-1">
                                                {item.items.map((subItem) => (
                                                    <Link
                                                        key={subItem.href}
                                                        href={subItem.href || "#"}
                                                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-brand-cream hover:text-brand-blue"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href || "#"}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <div className="mt-4 space-y-2 border-t pt-4">
                            <Link
                                href="/jadwal-misa"
                                className="block rounded-full bg-brand-blue px-6 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-darkBlue"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Jadwal Misa
                            </Link>
                            <Link
                                href="/contact"
                                className="block rounded-full border border-brand-blue px-6 py-2.5 text-center text-sm font-semibold text-brand-blue hover:bg-brand-cream"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Donate Us
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
