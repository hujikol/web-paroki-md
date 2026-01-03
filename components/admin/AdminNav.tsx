"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useLoading } from "./LoadingProvider";
import Tooltip from "./Tooltip";

interface AdminNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AdminNav({ user }: AdminNavProps) {
  const { startTransition } = useLoading();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Posts", href: "/admin/posts" },
    { name: "Media", href: "/admin/media" },
    { name: "UMKM", href: "/admin/data/umkm" },
    { name: "Statistik", href: "/admin/data/statistik" },
    { name: "Jadwal", href: "/admin/data/jadwal" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm font-rubik">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-darkBlue bg-clip-text text-transparent">
                CMS Admin Panel
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                // Check if active (exact match or sub-path match for nested routes)
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => startTransition(() => { })}
                    className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-all duration-200 h-full ${isActive
                        ? "border-brand-blue text-brand-dark"
                        : "border-transparent text-gray-600 hover:text-brand-blue hover:bg-brand-cream/30 hover:border-gray-300"
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Site Button */}
            <Tooltip content="Visit Public Website" position="bottom">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
              >
                <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Site
              </Link>
            </Tooltip>

            {/* User Dropdown */}
            <div className="ml-3 relative" ref={dropdownRef}>
              <div>
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue items-center gap-2"
                  id="user-menu-button"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-brand-cream border border-brand-blue/20 flex items-center justify-center text-brand-blue font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.name || "Admin"}
                    <svg className={`ml-1 h-4 w-4 inline transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-brand-blue truncate font-medium">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Tooltip content="Logout of session" position="left">
                      <button
                        onClick={() => {
                          startTransition(() => {
                            signOut({ callbackUrl: "/admin/login" });
                          });
                        }}
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors gap-2 font-medium"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
