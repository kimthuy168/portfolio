import { type NextRequest, NextResponse } from "next/server"
import { updateSkill, deleteSkill } from "@/lib/db/queries"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const body = await request.json()

    const updated = await updateSkill(id, body)

    if (!updated) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error("PUT /api/skills/[id] error:", err)
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const deleted = await deleteSkill(id)

    if (!deleted) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Skill deleted" })
  } catch (err) {
    console.error("DELETE /api/skills/[id] error:", err)
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
  }
}
