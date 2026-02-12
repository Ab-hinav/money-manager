"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleInvalidTokenResponse, logoutAndRedirectToLogin, rethrowIfRedirect } from "@/lib/auth-failure";
import { getApiUrl } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[];
  };
};

export async function createTransaction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return logoutAndRedirectToLogin();
  }

  // Extract data from FormData
  const rawData = {
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    description: formData.get("description"),
    scope: formData.get("scope"),
    groupId: formData.get("groupId"),
    goalId: formData.get("goalId"),
  };

  // Basic Validation (You can enhance this with Zod)
  const errors: { [key: string]: string[] } = {};
  if (!rawData.amount) errors.amount = ["Amount is required"];
  if (!rawData.date) errors.date = ["Date is required"];
  if (!rawData.categoryId) errors.category = ["Category is required"];
  
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Validation Validation failed", errors };
  }

  // Construct Payload
  const normalizedGroupId =
    rawData.scope === "family" && typeof rawData.groupId === "string" && rawData.groupId.trim() !== ""
      ? rawData.groupId
      : null;

  const payload = {
    amount: parseFloat(rawData.amount as string),
    type: rawData.type,
    categoryId: rawData.categoryId,
    date: rawData.date,
    description: rawData.description,
    scope: rawData.scope,
    groupId: normalizedGroupId,
    goalId: rawData.goalId ? parseInt(rawData.goalId as string) : null,
  };

  try {
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/transactions`;

    console.log(`[Server Action] Submitting Transaction to: ${url}`);
    console.log(`[Server Action] Payload: ${JSON.stringify(payload)}`);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    await handleInvalidTokenResponse(res);

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Server Action] Failed: ${res.status} ${errorText}`);
        return { success: false, message: `Failed to add transaction: ${res.statusText}` };
    }

    revalidatePath("/dashboard");
    revalidatePath("/add-transaction");

    return { success: true, message: "Transaction added successfully" };
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("[Server Action] Error:", error);
    return { 
        success: false, 
        message: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

export async function getCategories() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return logoutAndRedirectToLogin();
  }

  try {
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/categories`;

    console.log(`[Server Action] Submitting Transaction to: ${url}`);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
    });
    await handleInvalidTokenResponse(res);

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Server Action] Failed: ${res.status} ${errorText}`);
        return [];
    }

    return res.json();
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("[Server Action] Error:", error);
    return [];
  }
}


export async function getFamilyOrGroups() {
  const session = await getServerSession(authOptions)
  if (!session || !session.accessToken) {
    return logoutAndRedirectToLogin();
  }

  try {
    const res = await fetch(getApiUrl()+"/api/family", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      },
    })
    await handleInvalidTokenResponse(res);

    if (!res.ok) {
        console.error("Failed to fetch family or groups status:", res.status)
        return []
    }
    return res.json()
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("Failed to fetch family or groups:", error)
    return []
  }
}

export async function getGoals() {
  const session = await getServerSession(authOptions)
  if (!session || !session.accessToken) {
    return logoutAndRedirectToLogin();
  }

  try {
    const res = await fetch(getApiUrl()+"/api/goals", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      },
    })
    await handleInvalidTokenResponse(res);

    if (!res.ok) {
        console.error("Failed to fetch goals status:", res.status)
        return []
    }
    return res.json()
  } catch (error) {
    rethrowIfRedirect(error);
    console.error("Failed to fetch goals:", error)
    return []
  }
}
