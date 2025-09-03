"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "./ui/button";

export function Navbar({ children }: { children: ReactNode }) {
  return (
    <nav className="flex justify-around items-center py-4 shadow">
      {children}
    </nav>
  );
}

export function NavLink({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  return (
    <Button asChild variant={"ghost"}>
      <Link
        href={href}
        className={cn("", {
          "bg-border/50": pathname === href,
          "font-medium text-destructive": label === "Admin",
        })}
      >
        {label}
      </Link>
    </Button>
  );
}
