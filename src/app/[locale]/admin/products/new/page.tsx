import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import ProductAddForm from '@/components/admin/ProductAddForm';

export default async function AdminProductNewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user || session!.user.role !== 'ADMIN') {
    redirect({ href: '/', locale });
  }

  const categories = await prisma.category.findMany({
    orderBy: { slug: 'asc' },
  });

  return <ProductAddForm categories={categories} locale={locale} />;
}
