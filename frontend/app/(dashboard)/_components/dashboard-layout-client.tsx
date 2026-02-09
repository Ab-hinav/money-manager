"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { cn } from "@/lib/utils";

export const DashboardLayoutClient = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    
    return (
        <div className="h-full relative">
             <div className={cn(
                 "hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-background transition-all duration-300 ease-in-out",
                 collapsed ? "md:w-20" : "md:w-72"
             )}>
                {/* We pass collapsed state to sidebar to handle internal rendering */}
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
             </div>
             <main className={cn(
                 "md:pl-72 transition-all duration-300 ease-in-out h-full",
                 collapsed && "md:pl-20"
             )}>
                 <div className="flex items-center p-4 md:hidden">
                    <MobileSidebar />
                 </div>
                 {children}
             </main>
        </div>
    );
};
