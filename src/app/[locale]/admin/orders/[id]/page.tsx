import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { ArrowLeft, Package, MapPin, User, FileText, Calendar } from 'lucide-react';
import OrderStatusChanger from '@/components/admin/OrderStatusChanger';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const session = await auth();

  if (!session?.user || session!.user.role !== 'ADMIN') {
    redirect({ href: '/', locale });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    },
  });

  if (!order) {
    notFound();
  }

  // Use type assertion since Json value doesn't automatically map in Prisma types perfectly
  const deliveryInfo = order.deliveryInfo as Record<string, string> || {};
  const shippingCost = 7.000;
  const subtotal = order.total - shippingCost;

  return (
    <div className="container-custom py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} className="dark:text-white" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 dark:text-white">
            Commande {order.orderNumber}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
            <Calendar size={14} />
            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <div className="ml-auto">
          <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800 dark:text-white">
              <Package size={20} className="text-[var(--color-brand-blue)]" /> 
              Articles commandés ({order.items.length})
            </h2>
            
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800 flex-shrink-0 transition-colors">
                    {item.product?.images?.[0] ? (
                      <Image src={item.product.images[0]} alt="" fill className="object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {item.product?.name?.fr || 'Produit supprimé'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold text-[var(--color-brand-blue)]">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Livraison</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 dark:text-white">
                <span>Total</span>
                <span className="text-[var(--color-brand-orange)]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2 dark:text-white">
                <FileText size={20} className="text-gray-400 dark:text-gray-500" />
                Notes du client
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 p-4 rounded-lg text-sm whitespace-pre-wrap border border-yellow-100 dark:border-yellow-900/50">
                {order.notes}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800 dark:text-white">
              <User size={20} className="text-[var(--color-brand-blue)]" /> 
              Client
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Nom complet</p>
                <p className="font-medium dark:text-white">{deliveryInfo.fullName || order.user?.name || 'Inconnu'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Téléphone</p>
                <p className="font-medium text-[var(--color-brand-blue)]">
                  <a href={`tel:${deliveryInfo.phone}`}>{deliveryInfo.phone}</a>
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="font-medium dark:text-white">{deliveryInfo.email || order.user?.email || 'Non fourni'}</p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800 dark:text-white">
              <MapPin size={20} className="text-[var(--color-brand-blue)]" /> 
              Livraison
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Gouvernorat</p>
                <p className="font-medium dark:text-white">{deliveryInfo.governorate}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Ville</p>
                <p className="font-medium dark:text-white">{deliveryInfo.city}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Adresse complète</p>
                <p className="font-medium leading-relaxed dark:text-white">{deliveryInfo.address}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Code Postal</p>
                <p className="font-medium dark:text-white">{deliveryInfo.postalCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
