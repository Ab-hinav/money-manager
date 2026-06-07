"use client";

import Link from "next/link";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, PlusCircle, BarChart3, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

const font = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Family",
    icon: Users,
    href: "/family",
    color: "text-violet-500",
  },
  {
    label: "Add Transaction",
    icon: PlusCircle,
    href: "/add-transaction",
    color: "text-pink-700",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "text-orange-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft, ChevronRight, Wallet } from "lucide-react";

interface SidebarProps {
    collapsed?: boolean;
    setCollapsed?: (collapsed: boolean) => void;
}

export const Sidebar = ({ collapsed = false, setCollapsed }: SidebarProps) => {
  const { data: session } = useSession();

  return (
    <div className={cn(
        "space-y-4 py-4 flex flex-col h-full bg-background text-foreground border-r",
        collapsed && "items-center"
    )}>
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between mb-14 px-2">
            <Link href="/dashboard" className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
            <Wallet className="h-6 w-6 text-teal-600 shrink-0" />
            {!collapsed && (
                <h1 className={cn("text-xl font-bold transition-opacity duration-300", font.className)}>
                    Money Manager
                </h1>
            )}
            </Link>
            {!collapsed && setCollapsed && (
                <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-auto w-auto p-1 text-muted-foreground hover:text-foreground" aria-label="Collapse sidebar" title="Collapse sidebar" aria-expanded="true">
                    <ChevronLeft size={18} />
                </Button>
            )}
        </div>
        
        {/* Collapsed toggle button when sidebar is collapsed (shown below logo or somewhere accessible) */}
        {collapsed && setCollapsed && (
             <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="mb-4 w-full h-auto py-2 text-muted-foreground hover:text-foreground" aria-label="Expand sidebar" title="Expand sidebar" aria-expanded="false">
                <ChevronRight size={18} />
            </Button>
        )}

        <div className="space-y-1">
          {routes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>
      
      {/* User Proflie / Logout Section */}
      <div className="px-3 py-2 border-t">
        {session && (
            <div className={cn("flex items-center mb-4 p-2", collapsed ? "justify-center" : "gap-x-3")}>
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>{session.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                {!collapsed && (
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">{session.user?.name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{session.user?.email}</span>
                    </div>
                )}
            </div>
        )}
        <Button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant="ghost" 
            className={cn(
                "w-full justify-start flex items-center gap-x-2 text-muted-foreground text-sm font-[500] transition-all hover:text-foreground hover:bg-accent h-auto py-4",
                collapsed ? "justify-center p-2" : "pl-6"
            )}
            aria-label={collapsed ? "Logout" : undefined}
            title={collapsed ? "Logout" : undefined}
        >
            <LogOut className={cn("h-[22px] w-[22px]", !collapsed && "mr-0")} />
            {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
};
