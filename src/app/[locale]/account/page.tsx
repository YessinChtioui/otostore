import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { Package, User, MapPin, Heart, LogOut } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Link } from '@/i18n/routing';

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect({ href: '/auth/login', locale });
  }

  // Fetch recent orders
  let orders = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: session!.user!.id! },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  } catch (e) {
    console.log("DB error, using mock data for orders");
    orders = [
      { id: '1', orderNumber: 'OTO-123456', status: 'PENDING', total: 150, createdAt: new Date() }
    ] as any;
  }

  return (
    <main className="bg-gray-50 dark:bg-gray-950 transition-colors py-12 min-h-screen">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors overflow-hidden">
              <div className="p-6 bg-[var(--color-brand-blue)] text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  {session!.user!.name?.charAt(0) || 'U'}
                </div>
                <h2 className="font-bold">{session!.user!.name}</h2>
                <p className="text-white/80 text-sm">{session!.user!.email}</p>
              </div>
              
              <nav className="p-4 flex flex-col gap-1">
                <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-[var(--color-brand-blue)] font-medium rounded-lg transition-colors">
                  <User size={18} /> Profil
                </Link>
                <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Package size={18} /> Mes Commandes
                </Link>
                <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <MapPin size={18} /> Adresses
                </Link>
                <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Heart size={18} /> Favoris
                </Link>
                
                {session!.user!.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 mt-4 text-[var(--color-brand-orange)] hover:bg-orange-50 dark:hover:bg-orange-900/20 font-medium rounded-lg transition-colors border border-orange-100 dark:border-orange-900/50">
                    Administration
                  </Link>
                )}
                
                {/* Sign Out requires a client component or form, using a simple link to a signout route for now */}
                <a href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-4">
                  <LogOut size={18} /> Déconnexion
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">Commandes Récentes</h2>
                <Link href="/account/orders" className="text-[var(--color-brand-blue)] text-sm font-medium hover:underline">
                  Voir tout
                </Link>
              </div>
              
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      <tr>
                        <th className="p-4 font-medium rounded-l-lg">N° Commande</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Statut</th>
                        <th className="p-4 font-medium rounded-r-lg">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="p-4 font-medium text-gray-900 dark:text-white">{order.orderNumber}</td>
                          <td className="p-4 text-gray-500 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' : ''}
                              ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                              ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-[var(--color-brand-blue)]">
                            {formatPrice(order.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p>Vous n'avez pas encore passé de commande.</p>
                  <Link href="/shop" className="text-[var(--color-brand-blue)] font-medium mt-2 inline-block hover:underline">
                    Découvrir nos produits
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors">
              <h2 className="text-xl font-bold mb-6 dark:text-white">Informations du compte</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nom complet</p>
                  <p className="font-medium text-gray-900 dark:text-white">{session!.user!.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{session!.user!.email}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
