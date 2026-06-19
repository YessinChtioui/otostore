import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

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

    // Send Email Notifications
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@otostore.tn';
    const customerEmail = deliveryInfo.email;

    // To Admin
    await sendEmail(
      adminEmail,
      `Nouvelle commande ${order.orderNumber}`,
      `<p>Vous avez reçu une nouvelle commande d'un montant de ${total} TND.</p>
       <p>Client: ${deliveryInfo.firstName} ${deliveryInfo.lastName}</p>
       <p>Téléphone: ${deliveryInfo.phone}</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}">Voir la commande</a></p>`
    );

    // To Customer (if email provided)
    if (customerEmail) {
      await sendEmail(
        customerEmail,
        `Confirmation de votre commande ${order.orderNumber}`,
        `<p>Bonjour ${deliveryInfo.firstName},</p>
         <p>Nous avons bien reçu votre commande d'un montant de ${total} TND.</p>
         <p>Elle est en cours de traitement. Vous serez contacté(e) par téléphone pour la livraison.</p>
         <br/>
         <p>Merci pour votre confiance !<br/>L'équipe OTO STORE</p>`
      );
    }

    return NextResponse.json({ orderNumber: order.orderNumber, orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 });
  }
}
