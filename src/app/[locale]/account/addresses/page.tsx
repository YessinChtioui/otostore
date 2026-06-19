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
    <main className="bg-gray-50 dark:bg-gray-950 py-12 min-h-screen transition-colors">
      <div className="container-custom">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold dark:text-white">Mes Adresses</h1>
        </div>

        <AddressManager initialAddresses={addresses} />
      </div>
    </main>
  );
}
