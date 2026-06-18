import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { ArrowLeft, Plus } from 'lucide-react';
import ProductDeleteButton from '@/components/admin/ProductDeleteButton';

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user || session!.user.role !== 'ADMIN') {
    redirect({ href: '/', locale });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return (
    <div className="container-custom py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{products.length} produits</span>
        <Link href="/admin/products/new"
          className="ml-auto px-5 py-2.5 text-sm font-medium text-white bg-[var(--color-brand-orange)] hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Ajouter un produit
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Produit</th>
                <th className="p-4 font-medium">Catégorie</th>
                <th className="p-4 font-medium">Prix</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">N/A</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{product.name?.fr}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{product.slug}</p>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{product.category?.name?.fr || '—'}</td>
                  <td className="p-4">
                    <span className="font-bold text-[var(--color-brand-blue)]">{product.price} TND</span>
                    {product.comparePrice && (
                      <span className="text-xs text-gray-400 line-through ml-2">{product.comparePrice} TND</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-[var(--color-brand-blue)] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        Modifier
                      </Link>
                      <ProductDeleteButton productId={product.id} productName={product.name?.fr} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    Aucun produit. Cliquez sur &quot;Ajouter un produit&quot; pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
