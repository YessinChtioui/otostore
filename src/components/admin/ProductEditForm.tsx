'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Plus, X, ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface ProductEditFormProps {
  product: any;
  categories: any[];
  locale: string;
}

export default function ProductEditForm({ product, categories, locale }: ProductEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    nameFr: product.name?.fr || '',
    nameAr: product.name?.ar || '',
    nameEn: product.name?.en || '',
    descFr: product.description?.fr || '',
    descAr: product.description?.ar || '',
    descEn: product.description?.en || '',
    price: product.price || 0,
    comparePrice: product.comparePrice || '',
    stock: product.stock || 0,
    categoryId: product.categoryId || '',
    featured: product.featured || false,
    bestSeller: product.bestSeller || false,
    images: product.images || [],
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: { fr: formData.nameFr, ar: formData.nameAr, en: formData.nameEn },
          description: { fr: formData.descFr, ar: formData.descAr, en: formData.descEn },
          price: parseFloat(String(formData.price)),
          comparePrice: formData.comparePrice ? parseFloat(String(formData.comparePrice)) : null,
          stock: parseInt(String(formData.stock)),
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
        alert('Erreur lors de la sauvegarde');
      }
    } catch {
      alert('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push(`/${locale}/admin/products`);
        router.refresh();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch {
      alert('Erreur réseau');
    } finally {
      setDeleting(false);
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_: string, i: number) => i !== index) });
  };

  return (
    <div className="container-custom py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/${locale}/admin/products`} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Modifier le produit</h1>
        <div className="ml-auto flex gap-3">
          <button onClick={handleDelete} disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
            <Trash2 size={16} /> {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-brand-blue)] hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Names */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold mb-4">Nom du produit</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Français</label>
                <input type="text" value={formData.nameFr}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العربية</label>
                <input type="text" value={formData.nameAr} dir="rtl"
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">English</label>
                <input type="text" value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold mb-4">Description</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Français</label>
                <textarea value={formData.descFr} rows={3}
                  onChange={(e) => setFormData({ ...formData, descFr: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العربية</label>
                <textarea value={formData.descAr} rows={3} dir="rtl"
                  onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">English</label>
                <textarea value={formData.descEn} rows={3}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none resize-none" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold mb-4">Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {formData.images.map((url: string, i: number) => (
                <div key={i} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group border border-gray-200 dark:border-gray-700">
                  <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.images.length === 0 && (
                <div className="aspect-square bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <ImageIcon size={24} className="mb-1" />
                  <span className="text-xs">Aucune image</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newImageUrl} placeholder="URL de l'image..."
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addImage()}
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              <button onClick={addImage}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center gap-1 text-sm font-medium">
                <Plus size={16} /> Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold mb-4">Prix & Stock</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix (TND)</label>
                <input type="number" step="0.01" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ancien prix (TND)</label>
                <input type="number" step="0.01" value={formData.comparePrice}
                  onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                  placeholder="Optionnel"
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                <input type="number" value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold mb-4">Catégorie</h2>
            <select value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none">
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name?.fr || cat.slug}</option>
              ))}
            </select>
          </div>

          {/* Flags */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold mb-4">Visibilité</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[var(--color-brand-blue)] rounded" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Produit en vedette</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.bestSeller}
                  onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                  className="w-4 h-4 text-[var(--color-brand-blue)] rounded" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best-seller</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
