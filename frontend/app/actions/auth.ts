"use server";

import { getApiUrl } from "@/lib/utils";

export type AuthState = {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[];
  };
};

export async function registerUser(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic Server-Side Validation
  const errors: { [key: string]: string[] } = {};
  if (!name) errors.name = ["Full Name is required"];
  if (!email) errors.email = ["Email is required"];
  if (!password) errors.password = ["Password is required"];
  if (password && password.length < 4) errors.password = ["Password must be at least 4 characters"];

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Validation failed", errors };
  }

  try {
    const backendUrl = getApiUrl();
    const url = `${backendUrl}/api/signup`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, message: errorText || "Registration failed" };
    }

    

    // Success
    return { success: true, message: "Account created successfully" };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
