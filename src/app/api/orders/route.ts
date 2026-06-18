import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();

  const { items, total, deliveryInfo, notes } = body;

  if (!items || items.length === 0 || !total || !deliveryInfo) {
    return NextResponse.json({ error: 'Données de commande incomplètes' }, { status: 400 });
  }

  // Generate order number
  const orderNumber = 'OTO-' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        total,
        deliveryInfo,
        notes: notes || null,
        userId: session?.user?.id || null,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // Decrease stock for each product
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ orderNumber: order.orderNumber, orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 });
  }
}
