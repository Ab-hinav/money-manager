"use client";

import { useActionState, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Input } from "@/components/ui/input";   // Shadcn Input
import { Label } from "@/components/ui/label";   // Shadcn Label
import { Loader2 } from "lucide-react";
import Link from "next/link";

const initialState = {
  success: false,
  message: "",
};

export function LoginForm() {
  const router = useRouter();
  
  // Client-side action to be used with useActionState
  async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, message: "Invalid email or password" };
      }

      // Success - Redirect
      router.push("/dashboard");
      router.refresh();
      return { success: true, message: "Login successful" }; // State update, though we redirect
    } catch (error) {
      console.error("Login Check Error:", error);
      return { success: false, message: "An unexpected error occurred." };
    }
  }

  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="grid gap-6">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-sm text-gray-500">Please sign in to manage your finances.</p>
      </div>
      <form action={formAction}>
        <div className="grid gap-4">
          {/* Email Field */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-medium">Email Address</Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                 </svg>
              </div>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isPending}
                required
                className="pl-10 h-11 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" aria-label="Forgot password" className="text-xs text-teal-600 hover:text-teal-800">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <Input
                id="password"
                name="password"
                placeholder="••••••••••••"
                type="password"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isPending}
                required
                className="pl-10 h-11 bg-gray-50 border-gray-200 tracking-widest"
              />
            </div>
          </div>

          {/* Error Message Display */}
          {state.message && !state.success && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {state.message}
            </div>
          )}

          {/* Submit Button */}
          <Button disabled={isPending} className="w-full bg-teal-700 hover:bg-teal-800 h-11 text-base">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Login 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            )}
          </Button>
        </div>
      </form>
      
      <div className="text-center text-sm text-gray-500 mt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-teal-700 font-semibold hover:underline">
          Create an account
        </Link>
      </div>

       <div className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-wider flex items-center justify-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        256-Bit SSL Encrypted
      </div>
    </div>
  );
}