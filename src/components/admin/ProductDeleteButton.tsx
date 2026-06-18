'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function ProductDeleteButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer le produit "${productName}" ? Cette action est irréversible.`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
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

  return (
    <button onClick={handleDelete} disabled={deleting}
      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1">
      <Trash2 size={13} />
      {deleting ? '...' : 'Supprimer'}
    </button>
  );
}
