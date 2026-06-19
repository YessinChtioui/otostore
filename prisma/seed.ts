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
  await prisma.storeReview.deleteMany()
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
  console.log('Created admin user: admin@otostore.tn / Admin123!')

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

  await Promise.all(
    categoriesData.map((cat) => prisma.category.create({ data: cat }))
  )
  console.log('Created empty categories.')

  console.log('Database has been completely reset and is ready for production!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
