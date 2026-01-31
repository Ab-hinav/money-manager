import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
    accessToken: string; // Add this!
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    token: string; // Add this!
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    image?: string;
  }
}