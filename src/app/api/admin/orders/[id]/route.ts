import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session!.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (!body.status) {
    return NextResponse.json({ error: 'Le statut est requis' }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });

    const deliveryInfo = order.deliveryInfo as any;
    const customerEmail = deliveryInfo?.email;

    if (customerEmail) {
      const statusMap: Record<string, string> = {
        PENDING: 'En attente',
        CONFIRMED: 'Confirmée',
        PREPARING: 'En cours de préparation',
        OUT_FOR_DELIVERY: 'En cours de livraison',
        DELIVERED: 'Livrée',
        CANCELLED: 'Annulée',
      };

      const readableStatus = statusMap[order.status] || order.status;

      await sendEmail(
        customerEmail,
        `Mise à jour de votre commande ${order.orderNumber}`,
        `<p>Bonjour ${deliveryInfo.fullName || ''},</p>
         <p>Le statut de votre commande <strong>${order.orderNumber}</strong> a été mis à jour.</p>
         <p>Nouveau statut : <strong>${readableStatus}</strong></p>
         <br/>
         <p>Merci pour votre confiance !<br/>L'équipe OTO STORE</p>`
      );
    }

    // Bust cache to ensure the updated status appears instantly on the client UI
    revalidatePath('/', 'layout');

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
