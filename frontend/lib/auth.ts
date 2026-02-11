import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getApiUrl } from "./utils";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    signOut: "/login",
    newUser: "/register",
  },
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Connect to GO BACKEND
          // Use 'http://localhost:8080' for local, or your CloudFront URL for Prod
          const backendUrl = getApiUrl();
          
          const res = await fetch(`${backendUrl}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const data = await res.json();

          if (res.ok && data.token) {
            // Return object matches the 'User' interface in types/next-auth.d.ts
            return {
              id: data.user.id.toString(),
              name: data.user.name,
              email: data.user.email,
              token: data.token, 
            };
          }
          return null;
        } catch (e) {
          console.error("Auth Error:", e);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      // @ts-expect-error - `id` is augmented in next-auth module declaration.
      session.user.id = token.id;
      return session;
    },
  },
};
