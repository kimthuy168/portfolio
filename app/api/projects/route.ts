import { type NextRequest, NextResponse } from "next/server";
import { createProject } from "@/lib/db/queries";

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