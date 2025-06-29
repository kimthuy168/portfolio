import { type NextRequest, NextResponse } from "next/server"

import {  getUserById } from "@/lib/db/queries"
import { auth } from "../auth";

export async function GET(request: NextRequest) {
  try {
    
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const user = await getUserById(session.user.id)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
