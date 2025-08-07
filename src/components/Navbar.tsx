"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Navbar({ children }: { children: ReactNode }) {
  return (
    <nav className="flex justify-center py-4 bg-primary text-primary-foreground">
      {children}
    </nav>
  );
}

export function NavLink(props: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "font-medium transition-all duration-200 px-4 py-2 rounded-4xl mx-2 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        {
          "bg-background text-foreground": pathname === props.href,
        }
      )}
    />
  );
}
