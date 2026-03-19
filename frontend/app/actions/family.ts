"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleInvalidTokenResponse, logoutAndRedirectToLogin, rethrowIfRedirect } from "@/lib/auth-failure";
import { getApiUrl } from "@/lib/utils";

export type FamilyOrGroup = {
  id: string;
  name: string;
  type: string;
  icon: string;
};

export type CreateFamilyState = {
  success: boolean;
  message: string;
  family?: FamilyOrGroup;
  errors?: {
    [key: string]: string[];
  };
};

const initialState: CreateFamilyState = {
  success: false,
  message: "",
};

export async function createFamily(prevState: CreateFamilyState, formData: FormData): Promise<CreateFamilyState> {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return logoutAndRedirectToLogin();
  }

  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;
  const type = formData.get("type") as string;

  // Validate
  const errors: { [key: string]: string[] } = {};

  if (!name || name.trim().length === 0) {
    errors.name = ["Group name is required"];
  }
  if (!icon) {
    errors.icon = ["Please select an icon"];
  }
  if (!type) {
    errors.type = ["Please select a type"];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Validation failed", errors };
  }

  try {
    const backendUrl = getApiUrl();
    const res = await fetch(`${backendUrl}/api/family`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ name: name.trim(), icon, type }),
    });

    await handleInvalidTokenResponse(res);

    if (!res.ok) {
      console.error(`Error creating family: ${res.statusText}`);
      return { success: false, message: "Failed to create group. Please try again." };
    }

    const family: FamilyOrGroup = await res.json();
    return { success: true, message: "Group created successfully", family };
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("Error creating family:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
