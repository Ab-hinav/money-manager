import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Wallet } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Wallet className="h-6 w-6 text-green-600" />
          <span>Money Manager</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-green-600 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-green-600 transition-colors">
            Pricing
          </Link>
          <Link href="#about" className="hover:text-green-600 transition-colors">
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Get Started
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              <Link href="#features" className="text-lg font-medium">
                Features
              </Link>
              <Link href="#pricing" className="text-lg font-medium">
                Pricing
              </Link>
              <Link href="#about" className="text-lg font-medium">
                About
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Get Started
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
