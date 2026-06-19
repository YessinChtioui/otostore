import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { Package, ArrowLeft } from 'lucide-react';

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user || session!.user.role !== 'ADMIN') {
    redirect({ href: '/', locale });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="container-custom py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} className="dark:text-white" />
        </Link>
        <h1 className="text-3xl font-bold dark:text-white">Gestion des Commandes</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        <div className="p-6">
          <p className="text-gray-500 dark:text-gray-400 mb-6">Retrouvez ici la liste de toutes les commandes passées sur la boutique.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="p-4 font-medium rounded-l-lg">N° Commande</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Statut</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-medium text-[var(--color-brand-blue)]">{order.orderNumber}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4 dark:text-white">{order.user?.name || 'Client Invité'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'PREPARING' ? 'bg-purple-100 text-purple-800' : ''}
                        ${order.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-100 text-orange-800' : ''}
                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold dark:text-white">{order.total.toFixed(3)} TND</td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="px-3 py-1.5 text-xs font-medium text-[var(--color-brand-blue)] bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors inline-block">
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <Package size={32} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                      Aucune commande trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
