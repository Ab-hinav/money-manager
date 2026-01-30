import Link from "next/link";
import { Wallet, Twitter, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#05110D] text-gray-300 py-16 border-t border-gray-800">
      <div className="mx-auto container grid gap-12 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <Wallet className="h-6 w-6 text-green-500" />
            <span>Money Manager</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Helping millions of people achieve financial freedom since 2018. The
            future of banking is here.
          </p>
          <div className="flex gap-4 pt-2">
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

        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-green-500">About Us</Link></li>
            <li><Link href="#" className="hover:text-green-500">Careers</Link></li>
            <li><Link href="#" className="hover:text-green-500">Press Kit</Link></li>
            <li><Link href="#" className="hover:text-green-500">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-green-500">Features</Link></li>
            <li><Link href="#" className="hover:text-green-500">Personal Budget</Link></li>
            <li><Link href="#" className="hover:text-green-500">Investment Tracking</Link></li>
            <li><Link href="#" className="hover:text-green-500">Security</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg">Get the App</h3>
          <div className="flex flex-col gap-3">
             {/* App Store Button Placeholder */}
            <button className="bg-black border border-gray-700 hover:border-green-500 rounded-lg p-2 flex items-center gap-3 w-40 transition-colors">
                 <div className="text-2xl"></div>
                 <div className="text-left leading-none">
                     <div className="text-[10px] uppercase">Download on the</div>
                     <div className="text-sm font-bold text-white">App Store</div>
                 </div>
            </button>
            {/* Play Store Button Placeholder */}
            <button className="bg-black border border-gray-700 hover:border-green-500 rounded-lg p-2 flex items-center gap-3 w-40 transition-colors">
                 <div className="text-xl">▶️</div>
                 <div className="text-left leading-none">
                     <div className="text-[10px] uppercase">Get it on</div>
                     <div className="text-sm font-bold text-white">Google Play</div>
                 </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mx-auto container mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
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
