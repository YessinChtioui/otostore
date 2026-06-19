import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { Users, ArrowLeft, Mail, Calendar } from 'lucide-react';

export default async function AdminCustomersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user || session!.user.role !== 'ADMIN') {
    redirect({ href: '/', locale });
  }

  const users = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true } },
    },
  });

  return (
    <div className="container-custom py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Gestion des Clients</h1>
        <span className="ml-auto bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
          {users.length} clients
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 font-medium rounded-l-lg">Client</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Téléphone</th>
                  <th className="p-4 font-medium">Commandes</th>
                  <th className="p-4 font-medium rounded-r-lg">Inscrit le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--color-brand-blue)] text-white flex items-center justify-center text-sm font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-gray-900">{user.name || 'Sans nom'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{user.phone || '—'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-[var(--color-brand-blue)]">
                        {user._count.orders} commande{user._count.orders !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      <Users size={32} className="mx-auto mb-2 text-gray-300" />
                      Aucun client inscrit.
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
