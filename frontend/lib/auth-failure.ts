import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAMES = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.callback-url",
  "next-auth.callback-url",
  "__Host-next-auth.csrf-token",
  "next-auth.csrf-token",
] as const;

export async function logoutAndRedirectToLogin(): Promise<never> {
  const cookieStore = await cookies();

  for (const cookieName of AUTH_COOKIE_NAMES) {
    cookieStore.delete(cookieName);
  }

  redirect("/login");
}

export async function handleInvalidTokenResponse(response: Response): Promise<void> {
  if (response.status === 401 || response.status === 403) {
    await logoutAndRedirectToLogin();
  }
}

export function rethrowIfRedirect(error: unknown): void {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  ) {
    throw error;
  }
}
