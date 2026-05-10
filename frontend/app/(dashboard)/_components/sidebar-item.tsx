"use client";

import { createElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  collapsed?: boolean;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  collapsed,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-2 text-muted-foreground text-sm font-[500] transition-all hover:text-foreground hover:bg-accent",
        isActive && "text-teal-600 bg-teal-500/10 hover:bg-teal-500/10 hover:text-teal-600",
        collapsed ? "justify-center p-2" : "pl-6"
      )}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon size={22} className={cn(
          "text-muted-foreground",
          isActive && "text-teal-600"
        )} />
        {!collapsed && label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-teal-600 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </Link>
  );
};
