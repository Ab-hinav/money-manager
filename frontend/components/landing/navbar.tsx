"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Wallet, LayoutDashboard, Users, PlusCircle, BarChart3, Settings, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto container px-4 sm:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Wallet className="h-6 w-6 text-teal-600" />
          <span>Money Manager</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-teal-600 transition-colors">Features</Link>
            <Link href="#about" className="hover:text-teal-600 transition-colors">About</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {status === "loading" ? (
             <Skeleton className="h-8 w-8 rounded-full" />
          ) : session ? (
             <>
                <Button variant="ghost" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                </Button>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback>{session.user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" title="Open mobile menu" aria-label="Open mobile menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation menu
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-6 mt-10 px-6">
               <Link href="#features" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-teal-600">
                 Features
               </Link>
               <Link href="#about" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-teal-600">
                 About
               </Link>

              {status === "loading" ? (
                 <>
                   <div className="flex items-center gap-3 mb-4 mt-4">
                     <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                   </div>
                   <Skeleton className="h-6 w-full" />
                 </>
              ) : session ? (
                <>
                  <div className="flex items-center gap-3 mb-4 mt-4">
                     <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback>{session.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 text-lg font-medium hover:text-teal-600">
                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                  </Link>
                  <Button variant="outline" className="w-full mt-4" onClick={() => { setOpen(false); signOut({ callbackUrl: "/login" }); }}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4 w-full">
                    <Button variant="outline" asChild className="w-full" onClick={() => setOpen(false)}>
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white w-full" onClick={() => setOpen(false)}>
                      <Link href="/register">Sign Up</Link>
                    </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
