import { getSocialAccountByUserId } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(req: Request,context: { params: Promise<{ id: string }>}) {
  try {
    const { id } = await context.params;
    if (!id) {
        return new Response('id is required', { status: 400 });
    }
    const result = await getSocialAccountByUserId(id);
    console.log("Acc", result);
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 })
  }
}