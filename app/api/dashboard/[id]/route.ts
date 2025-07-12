import { type NextRequest, NextResponse } from "next/server"
import { getAllDataUserDataById } from "@/lib/db/queries"

export async function GET(req: Request,context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) {
        return new Response('id is required', { status: 400 });
    }
    const result = await getAllDataUserDataById(id)

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to load chat detail', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}