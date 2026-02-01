"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { getApiUrl } from "@/lib/utils";

export function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const response = await fetch(`${getApiUrl()}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const data = await response.text(); // Parse text first in case it's not JSON
                throw new Error(data || "Registration failed");
            }
            const data = await response.json();
            console.log(data);
            // call signIn
            const signInResponse = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (signInResponse?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
                } else {
                // 4. Success -> Dashboard
                router.push("/dashboard");
                router.refresh();
                }
        } catch (err: any) {
             setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="grid gap-6">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-sm text-gray-500">Sign up to start tracking your wealth.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    {/* Name Field */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="font-medium">Full Name</Label>
                        <div className="relative">
                             <div className="absolute left-3 top-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                             </div>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                type="text"
                                autoComplete="name"
                                disabled={isLoading}
                                required
                                className="pl-10 h-11 bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="font-medium">Email Address</Label>
                         <div className="relative">
                             <div className="absolute left-3 top-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                             </div>
                            <Input
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                required
                                className="pl-10 h-11 bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="grid gap-2">
                         <Label htmlFor="password">Password</Label>
                         <div className="relative">
                             <div className="absolute left-3 top-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                             </div>
                            <Input
                                id="password"
                                name="password"
                                placeholder="••••••••••••"
                                type="password"
                                autoComplete="new-password"
                                disabled={isLoading}
                                required
                                className="pl-10 h-11 bg-gray-50 border-gray-200 tracking-widest"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <Button disabled={isLoading} className="w-full bg-teal-700 hover:bg-teal-800 h-11 text-base">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registering...
                            </>
                        ) : (
                           <span className="flex items-center justify-center gap-2">
                                Register
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </span>
                        )}
                    </Button>
                </div>
            </form>
            <div className="text-center text-sm text-gray-500 mt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-teal-700 font-semibold hover:underline">
                    Sign in
                </Link>
            </div>

             <div className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-wider flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                256-Bit SSL Encrypted
            </div>
        </div>
    );
}
