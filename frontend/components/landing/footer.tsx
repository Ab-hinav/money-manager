import Link from "next/link";
import { Wallet, Twitter, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#05110D] text-gray-300 py-12 lg:py-16 border-t border-gray-800">
      <div className="mx-auto container px-4 sm:px-6 grid gap-8 lg:gap-12 md:grid-cols-3">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-xl text-white">
            <Wallet className="h-6 w-6 text-green-500" />
            <span>Money Manager</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
            Helping millions of people achieve financial freedom since 2018. The
            future of banking is here.
          </p>
          <div className="flex justify-center md:justify-start gap-4 pt-2">
            <Link href="#" className="hover:text-green-500 transition-colors">
              <span className="sr-only">Website</span>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                 🌍
              </div>
            </Link>
             <Link href="#" className="hover:text-green-500 transition-colors">
               <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                 <span className="sr-only">Share</span>
                 🔗
               </div>
            </Link>
            <Link href="#" className="hover:text-green-500 transition-colors">
               <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                   <span className="sr-only">Email</span>
                  ✉️
               </div>
            </Link>
          </div>
        </div>

        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-white font-semibold text-lg">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-green-500">About Us</Link></li>
            <li><Link href="#" className="hover:text-green-500">Careers</Link></li>
            <li><Link href="#" className="hover:text-green-500">Press Kit</Link></li>
            <li><Link href="#" className="hover:text-green-500">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-white font-semibold text-lg">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-green-500">Features</Link></li>
            <li><Link href="#" className="hover:text-green-500">Personal Budget</Link></li>
            <li><Link href="#" className="hover:text-green-500">Investment Tracking</Link></li>
            <li><Link href="#" className="hover:text-green-500">Security</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="mx-auto container px-4 sm:px-6 mt-12 lg:mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 Money Manager Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <Link href="#" className="hover:text-white">Privacy Policy</Link>
             <Link href="#" className="hover:text-white">Terms of Service</Link>
             <Link href="#" className="hover:text-white">Cookies</Link>
          </div>
      </div>
    </footer>
  );
}
