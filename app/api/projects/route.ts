import { type NextRequest, NextResponse } from "next/server";
import { createProject, getProjectsByUserId } from "@/lib/db/queries";

export async function GET(req: Request,context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published") === "true";
    const featured = searchParams.get("featured") === "true";

    const result = await getProjectsByUserId(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const created = await createProject(body)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}