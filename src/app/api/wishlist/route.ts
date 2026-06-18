import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Add product to wishlist
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  try {
    // Find or create wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session!.user!.id! },
      include: { products: { select: { id: true } } },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId: session!.user!.id!,
          products: { connect: { id: productId } },
        },
        include: { products: { select: { id: true } } },
      });
      return NextResponse.json({ added: true });
    }

    // Check if already in wishlist
    const alreadyExists = wishlist.products.some((p) => p.id === productId);

    if (alreadyExists) {
      // Remove from wishlist (toggle)
      await prisma.wishlist.update({
        where: { userId: session!.user!.id! },
        data: { products: { disconnect: { id: productId } } },
      });
      return NextResponse.json({ added: false });
    } else {
      // Add to wishlist
      await prisma.wishlist.update({
        where: { userId: session!.user!.id! },
        data: { products: { connect: { id: productId } } },
      });
      return NextResponse.json({ added: true });
    }
  } catch (error) {
    console.error('Wishlist error:', error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}
