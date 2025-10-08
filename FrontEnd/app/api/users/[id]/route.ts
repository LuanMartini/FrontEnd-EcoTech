import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import { ObjectId } from "mongodb"
import type { User } from "@/lib/models/user"

async function getHandler(req: NextRequest, payload: any, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    const user = await usersCollection.findOne({ _id: new ObjectId(params.id) }, { projection: { password_hash: 0 } })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Erro ao buscar usuário:", error)
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 })
  }
}

async function patchHandler(req: NextRequest, payload: any, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { name, phone, address } = body

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    const updateData: Partial<User> = {
      updated_at: new Date(),
    }

    if (name) updateData.name = name
    if (phone) updateData.phone = phone
    if (address) updateData.address = address

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: "after", projection: { password_hash: 0 } },
    )

    if (!result) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Usuário atualizado com sucesso",
      user: result,
    })
  } catch (error) {
    console.error("[v0] Erro ao atualizar usuário:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

export const GET = (req: NextRequest, context: any) =>
  withAuth((r: NextRequest, p: any) => getHandler(r, p, context))(req)
export const PATCH = (req: NextRequest, context: any) =>
  withAuth((r: NextRequest, p: any) => patchHandler(r, p, context))(req)
