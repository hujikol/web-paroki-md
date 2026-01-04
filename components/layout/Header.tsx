"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button, buttonVariants } from "@/components/ui/button";

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
            { title: "Warta Paroki", href: "/artikel/warta-paroki" },
            { title: "Jadwal Kegiatan", href: "/data/jadwal" },
            { title: "Formulir Gereja", href: "/data/formulir" },
        ],
    },
    {
        title: "Data UMKM",
        href: "/data/umkm",
    },
];

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isOverFooter, setIsOverFooter] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);


            // Check footer intersection
            const footer = document.querySelector('footer');
            if (footer) {
                const rect = footer.getBoundingClientRect();
                // If footer is approaching the top (approx navbar height + buffer)
                // Use smaller threshold to ensure valid overlap before switching
                setIsOverFooter(rect.top <= 20);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 flex justify-center",
                isScrolled ? "pt-4" : "py-6"
            )}
        >
            <nav
                className={cn(
                    "flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out",
                    isOverFooter
                        ? "w-[90%] max-w-6xl bg-white/50 backdrop-blur-xl shadow-lg border border-white/20 rounded-full py-3"
                        : isScrolled
                            ? "w-[90%] max-w-6xl bg-white/500 backdrop-blur-xl shadow-lg border border-white/20 rounded-full py-3"
                            : "w-full max-w-7xl bg-transparent py-2"
                )}
            >
                {/* Logo */}
                <div className="flex lg:flex-1">


                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 group">
                        <div className="relative h-10 w-10 overflow-hidden transition-transform duration-300 group-hover:scale-110">
                            <Image
                                src="/images/logo/logo.png"
                                alt="Logo Paroki"
                                fill
                                className="object-contain"
                                sizes="40px"
                            />
                        </div>
                        <div className="hidden sm:block">
                            <div className={cn(
                                "text-sm font-bold transition-colors",
                                isScrolled ? "text-brand-dark" : "text-white"
                            )}>Paroki Brayut</div>
                            <div className={cn(
                                "text-xs transition-colors",
                                isScrolled ? "text-gray-500" : "text-white/80"
                            )}>Santo Yohanes Paulus II</div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    {item.items ? (
                                        <>
                                            <NavigationMenuTrigger
                                                className={cn(
                                                    "bg-transparent focus:bg-white/10",
                                                    isScrolled ? "text-brand-dark hover:bg-black/5" : "text-white hover:text-white hover:bg-white/10"
                                                )}
                                            >
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                    {item.items.map((subItem) => (
                                                        <ListItem
                                                            key={subItem.title}
                                                            title={subItem.title}
                                                            href={subItem.href}
                                                        >
                                                        </ListItem>
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </>
                                    ) : (
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={item.href || "#"}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    "bg-transparent",
                                                    isScrolled ? "text-brand-dark hover:bg-black/5" : "text-white hover:text-white hover:bg-white/10"
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        </NavigationMenuLink>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* CTA Buttons */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
                    <Link
                        href="/jadwal-misa"
                        className={cn(
                            buttonVariants({ variant: isScrolled ? "default" : "secondary", size: "sm" }),
                            "rounded-full px-6 font-medium transition-all hover:scale-105"
                        )}
                    >
                        Jadwal Misa
                    </Link>
                    <Link
                        href="/contact"
                        className={cn(
                            buttonVariants({ variant: isScrolled ? "outline" : "default", size: "sm" }),
                            "rounded-full px-6 transition-all hover:scale-105", isScrolled
                            ? "border-brand-dark text-brand-dark hover:bg-brand-gold hover:text-white"
                            : "text-white bg-brand-gold hover:bg-white hover:text-brand-dark"
                        )}
                    >
                        Donate Us
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "-m-2.5 inline-flex items-center justify-center rounded-md p-2.5",
                            isScrolled ? "text-brand-dark" : "text-white"
                        )}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Toggle menu</span>
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </Button>
                </div>
            </nav>

            {/* Mobile menu */}
            {
                mobileMenuOpen && (
                    <div className="lg:hidden border-t bg-background absolute top-full w-full left-0 shadow-lg">
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {navItems.map((item) => (
                                <div key={item.title}>
                                    {item.items ? (
                                        <div className="space-y-2 py-2">
                                            <div className="font-semibold text-foreground px-3">{item.title}</div>
                                            <div className="pl-4 space-y-1 border-l ml-3">
                                                {item.items.map((subItem) => (
                                                    <Link
                                                        key={subItem.href}
                                                        href={subItem.href || "#"}
                                                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href || "#"}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
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
                                    className={cn(buttonVariants({ variant: "default" }), "w-full rounded-full justify-center")}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Jadwal Misa
                                </Link>
                                <Link
                                    href="/contact"
                                    className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-full justify-center border-primary text-primary")}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Donate Us
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </header >
    );
}
