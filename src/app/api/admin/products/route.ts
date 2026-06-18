import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session!.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  if (!body.name?.fr || !body.price || !body.categoryId) {
    return NextResponse.json({ error: 'Champs obligatoires manquants (nom FR, prix, catégorie)' }, { status: 400 });
  }

  // Ensure unique slug
  let slug = body.slug || 'produit';
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description || { fr: '', ar: '', en: '' },
        price: body.price,
        comparePrice: body.comparePrice,
        stock: body.stock || 0,
        categoryId: body.categoryId,
        featured: body.featured || false,
        bestSeller: body.bestSeller || false,
        images: body.images || [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du produit' }, { status: 500 });
  }
}
