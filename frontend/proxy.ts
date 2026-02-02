import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "./lib/auth";

export const config = {
    matcher: ["/add-transaction", "/dashboard", "/profile"],
}

export default async function proxy(req: NextRequest) {
    
    const session = await getServerSession(authOptions);

    if(!session || !session.accessToken){
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();

}