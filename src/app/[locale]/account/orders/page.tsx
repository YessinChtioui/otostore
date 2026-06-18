import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { Package, ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default async function AccountOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect({ href: '/auth/login', locale });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session!.user!.id! },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  const statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    PREPARING: 'En préparation',
    OUT_FOR_DELIVERY: 'En livraison',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-950 transition-colors py-12 min-h-screen">
      <div className="container-custom">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft size={24} className="dark:text-white" />
          </Link>
          <h1 className="text-3xl font-bold dark:text-white">Mes Commandes</h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="font-bold text-lg text-[var(--color-brand-blue)]">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <Package size={16} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.product?.name?.fr || 'Produit'}</p>
                            <p className="text-gray-500 dark:text-gray-400">Qté: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center transition-colors">
            <Package size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-bold mb-2 dark:text-white">Aucune commande</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Vous n&apos;avez pas encore passé de commande.</p>
            <Link href="/shop" className="btn-primary">
              Découvrir nos produits
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
