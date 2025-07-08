import { NextResponse } from "next/server"
import { getUserWithSocialByUserId } from "@/lib/db/queries";


export async function GET(req: Request,context: { params: Promise<{ id: string }> }) {

   const { id } = await context.params;
    if (!id) {
        return new Response('id is required', { status: 400 });
    }

  const userProfile = await getUserWithSocialByUserId(id)
  console.log("data:", userProfile);
  if (!userProfile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(userProfile)
}
