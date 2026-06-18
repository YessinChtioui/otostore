import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // 1. Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productReview.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin OTOSTORE',
      email: 'admin@otostore.tn',
      phone: '55000000',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created admin user')

  // 3. Create Categories
  const categoriesData = [
    { name: { fr: 'Supports Téléphone', ar: 'حوامل الهاتف', en: 'Phone Holders' }, slug: 'supports-telephone' },
    { name: { fr: 'Housses de Siège', ar: 'أغطية المقاعد', en: 'Seat Covers' }, slug: 'housses-siege' },
    { name: { fr: 'Tapis de Sol', ar: 'دواسات الأرضية', en: 'Floor Mats' }, slug: 'tapis-sol' },
    { name: { fr: 'Caméras Embarquées', ar: 'كاميرات القيادة', en: 'Dash Cameras' }, slug: 'cameras-embarquees' },
    { name: { fr: 'Éclairage LED', ar: 'إضاءة LED', en: 'LED Lights' }, slug: 'eclairage-led' },
    { name: { fr: 'Parfums de Voiture', ar: 'عطور السيارات', en: 'Car Perfumes' }, slug: 'parfums-voiture' },
    { name: { fr: 'Produits de Nettoyage', ar: 'منتجات التنظيف', en: 'Cleaning Products' }, slug: 'produits-nettoyage' },
    { name: { fr: 'Accessoires Intérieurs', ar: 'إكسسوارات داخلية', en: 'Interior Accessories' }, slug: 'accessoires-interieurs' },
  ]

  const createdCategories = await Promise.all(
    categoriesData.map((cat) => prisma.category.create({ data: cat }))
  )
  console.log('Created categories')

  // 4. Create Products
  const productsToCreate = []
  
  for (let i = 1; i <= 50; i++) {
    const category = createdCategories[Math.floor(Math.random() * createdCategories.length)]
    
    productsToCreate.push({
      name: { 
        fr: `Produit Automobile ${i}`, 
        ar: `منتج سيارة ${i}`, 
        en: `Car Product ${i}` 
      },
      slug: `produit-automobile-${i}`,
      description: { 
        fr: `Ceci est la description du produit ${i}. Idéal pour votre voiture.`, 
        ar: `هذا هو وصف المنتج ${i}. مثالي لسيارتك.`, 
        en: `This is the description for product ${i}. Perfect for your car.` 
      },
      price: Math.floor(Math.random() * 100) + 10,
      comparePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 150) + 50 : null,
      stock: Math.floor(Math.random() * 100) + 10,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1689255734/cld-sample-5.jpg',
        'https://res.cloudinary.com/demo/image/upload/v1689255733/cld-sample-4.jpg'
      ],
      featured: Math.random() > 0.8,
      bestSeller: Math.random() > 0.8,
      categoryId: category.id,
    })
  }

  const createdProducts = await Promise.all(
    productsToCreate.map((prod) => prisma.product.create({ data: prod }))
  )
  console.log(`Created ${createdProducts.length} products`)

  // 5. Create some reviews
  for (let i = 0; i < 20; i++) {
    const product = createdProducts[Math.floor(Math.random() * createdProducts.length)]
    await prisma.productReview.create({
      data: {
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        comment: 'Excellent produit, je le recommande !',
        userId: admin.id,
        productId: product.id,
      }
    })
  }
  console.log('Created sample reviews')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
