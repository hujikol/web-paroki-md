"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLoading } from "@/components/admin/LoadingProvider";
import {
    LayoutDashboard,
    FileText,
    Image as ImageIcon,
    Store,
    BarChart3,
    Calendar,
    LogOut,
    ExternalLink,
    ChevronRight,
    MapPin,
    UserIcon
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

interface AdminSidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
    };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const { startTransition } = useLoading();
    const pathname = usePathname();
    const [isSignOutPending, setIsSignOutPending] = useState(false);
    const { setOpenMobile } = useSidebar();

    const navItems = [
        {
            title: "Dashboard",
            items: [
                { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
                { name: "Posts", href: "/admin/posts", icon: FileText },
                { name: "Media", href: "/admin/media", icon: ImageIcon },
            ]
        },
        {
            title: "Data",
            items: [
                { name: "UMKM", href: "/admin/data/umkm", icon: Store },
                { name: "Jadwal", href: "/admin/data/jadwal", icon: Calendar },
                { name: "Formulir", href: "/admin/data/formulir", icon: FileText },
                { name: "Wilayah", href: "/admin/data/wilayah", icon: MapPin },
                { name: "Pastor & Tim", href: "/admin/data/pastor-tim", icon: UserIcon },
                { name: "Statistik", href: "/admin/data/statistik", icon: BarChart3 },
            ]
        },
        {
            title: "Master",
            items: [
                { name: "Kategori", href: "/admin/master/categories", icon: ChevronRight },
            ]
        }
    ];

    const handleSignOut = () => {
        setIsSignOutPending(true);
        startTransition(() => {
            signOut({ callbackUrl: "/admin" });
        });
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center h-16 px-2">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                            P
                        </div>
                        <span className="text-lg font-bold text-foreground tracking-tight">Admin<span className="text-primary">Paroki</span></span>
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {navItems.map((group, index) => (
                    <div key={index} className="px-3 py-2">
                        <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {group.title}
                        </h3>
                        <SidebarMenu>
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            onClick={() => setOpenMobile(false)}
                                            tooltip={item.name}
                                        >
                                            <Link href={item.href}>
                                                <Icon />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </div>
                ))}
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
                <SidebarMenu>
                    <div className="space-y-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Live Website
                        </Link>

                        <div className="flex items-center gap-3 pt-2">
                            <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{user?.name || "Admin"}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            disabled={isSignOutPending}
                            className="flex items-center gap-2 w-full text-left px-2 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            {isSignOutPending ? "Signing out..." : "Sign out"}
                        </button>
                    </div>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
