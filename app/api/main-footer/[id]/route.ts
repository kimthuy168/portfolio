
import { getMainFootersByUserId } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(req: Request,context: { params: Promise<{ id: string }>}) {
  try {
    const { id } = await context.params;
    if (!id) {
        return new Response('id is required', { status: 400 });
    }
    const result = await getMainFootersByUserId(id);
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 })
  }
}