import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import AddressManager from '@/components/account/AddressManager';

export default async function AccountAddressesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect({ href: '/auth/login', locale });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session!.user!.id! },
  });

  return (
    <main className="bg-gray-50 py-12 min-h-screen">
      <div className="container-custom">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Mes Adresses</h1>
        </div>

        <AddressManager initialAddresses={addresses} />
      </div>
    </main>
  );
}
