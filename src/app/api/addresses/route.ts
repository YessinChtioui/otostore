import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get user addresses
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session!.user!.id! },
  });

  return NextResponse.json(addresses);
}

// Add new address
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { governorate, city, address, postalCode, isDefault } = body;

  if (!governorate || !city || !address || !postalCode) {
    return NextResponse.json({ error: 'Tous les champs sont obligatoires' }, { status: 400 });
  }

  try {
    // If setting as default, un-default others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session!.user!.id! },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session!.user!.id!,
        governorate,
        city,
        address,
        postalCode,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error('Address error:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}

// Delete address
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const addressId = searchParams.get('id');

  if (!addressId) {
    return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
  }

  try {
    // Verify ownership
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session!.user!.id! },
    });

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    await prisma.address.delete({ where: { id: addressId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
