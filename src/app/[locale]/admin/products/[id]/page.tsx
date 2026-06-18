import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductEditForm from '@/components/admin/ProductEditForm';

export default async function AdminProductEditPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const session = await auth();

  if (!session?.user || session!.user.role !== 'ADMIN') {
    redirect({ href: '/', locale });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { slug: 'asc' },
  });

  return <ProductEditForm product={product} categories={categories} locale={locale} />;
}
