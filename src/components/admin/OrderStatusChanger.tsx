'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderStatusChanger({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const statuses = [
    { value: 'PENDING', label: 'En attente', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'CONFIRMED', label: 'Confirmée', color: 'text-blue-600 bg-blue-50' },
    { value: 'PREPARING', label: 'En préparation', color: 'text-purple-600 bg-purple-50' },
    { value: 'OUT_FOR_DELIVERY', label: 'En livraison', color: 'text-orange-600 bg-orange-50' },
    { value: 'DELIVERED', label: 'Livrée', color: 'text-green-600 bg-green-50' },
    { value: 'CANCELLED', label: 'Annulée', color: 'text-red-600 bg-red-50' }
  ];

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Erreur lors de la mise à jour du statut.');
        setStatus(currentStatus); // revert
      }
    } catch {
      alert('Erreur réseau.');
      setStatus(currentStatus); // revert
    } finally {
      setUpdating(false);
    }
  };

  const selectedColor = statuses.find(s => s.value === status)?.color || 'text-gray-600 bg-gray-50';

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Statut:</span>
      <select 
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={updating}
        className={`border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors ${selectedColor}`}
      >
        {statuses.map(s => (
          <option key={s.value} value={s.value} className="text-gray-900 bg-white">{s.label}</option>
        ))}
      </select>
      {updating && <span className="text-xs text-gray-500 animate-pulse">Mise à jour...</span>}
    </div>
  );
}
