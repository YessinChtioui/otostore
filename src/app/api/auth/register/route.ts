import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validators'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, password } = registerSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { user: userWithoutPassword, message: 'Inscription réussie' },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Données invalides', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}
