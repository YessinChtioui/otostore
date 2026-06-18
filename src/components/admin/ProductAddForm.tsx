'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X, ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface ProductAddFormProps {
  categories: any[];
  locale: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProductAddForm({ categories, locale }: ProductAddFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nameFr: '',
    nameAr: '',
    nameEn: '',
    descFr: '',
    descAr: '',
    descEn: '',
    price: '',
    comparePrice: '',
    stock: '0',
    categoryId: categories[0]?.id || '',
    featured: false,
    bestSeller: false,
    images: [] as string[],
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleSave = async () => {
    if (!formData.nameFr.trim()) {
      alert('Le nom du produit (français) est obligatoire');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Le prix doit être supérieur à 0');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: { fr: formData.nameFr, ar: formData.nameAr, en: formData.nameEn },
          slug: slugify(formData.nameFr),
          description: { fr: formData.descFr, ar: formData.descAr, en: formData.descEn },
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          stock: parseInt(formData.stock) || 0,
          categoryId: formData.categoryId,
          featured: formData.featured,
          bestSeller: formData.bestSeller,
          images: formData.images,
        }),
      });
      if (res.ok) {
        router.push(`/${locale}/admin/products`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la création');
      }
    } catch {
      alert('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  return (
    <div className="container-custom py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/${locale}/admin/products`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Ajouter un produit</h1>
        <button onClick={handleSave} disabled={saving}
          className="ml-auto px-6 py-2.5 text-sm font-medium text-white bg-[var(--color-brand-orange)] hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm">
          <Save size={16} /> {saving ? 'Création...' : 'Créer le produit'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Names */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Nom du produit</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Français <span className="text-red-500">*</span></label>
                <input type="text" value={formData.nameFr}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                  placeholder="Ex: Support téléphone magnétique"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العربية</label>
                <input type="text" value={formData.nameAr} dir="rtl"
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="حامل هاتف مغناطيسي"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
                <input type="text" value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Magnetic phone holder"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Description</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Français</label>
                <textarea value={formData.descFr} rows={3}
                  onChange={(e) => setFormData({ ...formData, descFr: e.target.value })}
                  placeholder="Décrivez le produit en détail..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العربية</label>
                <textarea value={formData.descAr} rows={3} dir="rtl"
                  onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                  placeholder="...وصف المنتج بالتفصيل"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
                <textarea value={formData.descEn} rows={3}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                  placeholder="Describe the product in detail..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none resize-none" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {formData.images.map((url, i) => (
                <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                  <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.images.length === 0 && (
                <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 col-span-full max-w-[200px]">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-xs">Aucune image ajoutée</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newImageUrl} placeholder="Coller l'URL de l'image..."
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addImage()}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              <button onClick={addImage}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium">
                <Plus size={16} /> Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Prix & Stock</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (TND) <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ancien prix (TND)</label>
                <input type="number" step="0.01" value={formData.comparePrice}
                  onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                  placeholder="Optionnel — pour afficher une promo"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Catégorie</h2>
            <select value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none">
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name?.fr || cat.slug}</option>
              ))}
            </select>
          </div>

          {/* Flags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Visibilité</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[var(--color-brand-blue)] rounded" />
                <span className="text-sm font-medium text-gray-700">Produit en vedette</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.bestSeller}
                  onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                  className="w-4 h-4 text-[var(--color-brand-blue)] rounded" />
                <span className="text-sm font-medium text-gray-700">Best-seller</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
