import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

const categories = [
  { id: 'supports-telephone', slug: 'supports-telephone', img: 'https://res.cloudinary.com/demo/image/upload/v1689255734/cld-sample-5.jpg', labelFr: 'Supports Téléphone' },
  { id: 'housses-siege', slug: 'housses-siege', img: 'https://res.cloudinary.com/demo/image/upload/v1689255733/cld-sample-4.jpg', labelFr: 'Housses de Siège' },
  { id: 'tapis-sol', slug: 'tapis-sol', img: 'https://res.cloudinary.com/demo/image/upload/v1689255734/cld-sample-5.jpg', labelFr: 'Tapis de Sol' },
  { id: 'eclairage-led', slug: 'eclairage-led', img: 'https://res.cloudinary.com/demo/image/upload/v1689255733/cld-sample-4.jpg', labelFr: 'Éclairage LED' },
];

export default function HomeCategories() {
  const t = useTranslations('Navigation'); // Or a specific categories translation

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="container-custom">
        <h2 className="h2 mb-10 text-center dark:text-white">Magasiner par Catégorie</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src={cat.img}
                  alt={cat.labelFr}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-[var(--color-brand-black)] dark:text-white font-bold py-2 px-4 rounded-full shadow-sm transition-colors">
                    {cat.labelFr}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
