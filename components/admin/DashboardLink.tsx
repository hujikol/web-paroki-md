"use client";

import Link from "next/link";
import { useLoading } from "./LoadingProvider";
import { ReactNode } from "react";

interface DashboardLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function DashboardLink({ href, className, children }: DashboardLinkProps) {
  const { startTransition } = useLoading();

  return (
    <Link 
      href={href} 
      className={className}
      onClick={() => startTransition(() => {})}
    >
      {children}
    </Link>
  );
}
