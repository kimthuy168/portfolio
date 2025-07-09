import { type NextRequest, NextResponse } from "next/server"
import { updateExperience, deleteExperience, getExperiencesByUserId } from "@/lib/db/queries"

export async function GET(req: Request,context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) {
        return new Response('id is required', { status: 400 });
    }
    const experience = await getExperiencesByUserId(id)

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Failed to load chat detail', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const updated = await updateExperience(id, body)

    if (!updated) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating experience:", error)
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const deleted = await deleteExperience(id)

    if (!deleted) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Experience deleted successfully" })
  } catch (error) {
    console.error("Error deleting experience:", error)
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
