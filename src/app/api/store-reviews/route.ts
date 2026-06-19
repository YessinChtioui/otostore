import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.storeReview.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, image: true } }
      },
      take: 20
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching store reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { rating, comment } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }

  try {
    const review = await prisma.storeReview.create({
      data: {
        rating,
        comment,
        userId: session.user.id,
      },
      include: {
        user: { select: { name: true, image: true } }
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating store review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
