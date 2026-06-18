'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, X, Trash2 } from 'lucide-react';

const GOVERNORATES = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
  'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia',
  'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabès', 'Médenine',
  'Tataouine', 'Gafsa', 'Tozeur', 'Kébili',
];

interface Address {
  id: string;
  governorate: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    governorate: GOVERNORATES[0],
    city: '',
    address: '',
    postalCode: '',
    isDefault: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.city || !form.address || !form.postalCode) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newAddr = await res.json();
        setAddresses((prev) => [...prev, newAddr]);
        setShowForm(false);
        setForm({ governorate: GOVERNORATES[0], city: '', address: '', postalCode: '', isDefault: false });
        router.refresh();
      } else {
        alert('Erreur lors de l\'ajout');
      }
    } catch {
      alert('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette adresse ?')) return;
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        router.refresh();
      }
    } catch {
      alert('Erreur réseau');
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative group">
            {addr.isDefault && (
              <span className="absolute top-4 right-4 bg-[var(--color-brand-blue)] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                Par défaut
              </span>
            )}
            <button onClick={() => handleDelete(addr.id)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
              style={addr.isDefault ? { right: '5.5rem' } : {}}>
              <Trash2 size={14} />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-brand-blue)] flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-medium text-gray-900">{addr.governorate}</p>
                <p className="text-sm text-gray-500">{addr.city}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
            <p className="text-sm text-gray-400">{addr.postalCode}</p>
          </div>
        ))}

        {/* Add new address card */}
        <button onClick={() => setShowForm(true)}
          className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-gray-400 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] transition-colors cursor-pointer min-h-[180px]">
          <Plus size={32} className="mb-2" />
          <p className="font-medium">Ajouter une adresse</p>
        </button>
      </div>

      {/* Add Address Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Nouvelle adresse</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gouvernorat</label>
                <select value={form.governorate}
                  onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none">
                  {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville / Délégation</label>
                <input type="text" value={form.city} placeholder="Ex: La Marsa"
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                <textarea value={form.address} rows={2} placeholder="Rue, numéro, immeuble, étage..."
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                <input type="text" value={form.postalCode} placeholder="Ex: 2078"
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent outline-none" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">Définir comme adresse par défaut</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-[var(--color-brand-blue)] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
