import { useState, useEffect } from 'react';

export default function AddTableModal({ open, onClose, onAdd, existingNumbers }) {
  const [tableNumber, setTableNumber] = useState('');
  const [seats, setSeats] = useState('4');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      // Auto-suggest next table number
      const max = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
      setTableNumber(String(max + 1));
      setSeats('4');
      setError('');
    }
  }, [open, existingNumbers]);

  async function handleSubmit(e) {
    e.preventDefault();
    const num = parseInt(tableNumber, 10);
    const s = parseInt(seats, 10);
    if (isNaN(num) || num <= 0) { setError('Numéro invalide'); return; }
    if (isNaN(s) || s <= 0) { setError('Nombre de couverts invalide'); return; }
    if (existingNumbers.includes(num)) { setError(`La table ${num} existe déjà`); return; }

    setSaving(true);
    try {
      await onAdd(num, s);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-[sheetUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        <h2 className="font-display font-bold text-lg text-brand-dark mb-4">Nouvelle Table</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Numéro de table</label>
            <input
              type="number"
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              min="1"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Nombre de couverts</label>
            <input
              type="number"
              value={seats}
              onChange={e => setSeats(e.target.value)}
              min="1"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-semibold text-brand-gray rounded-xl hover:bg-gray-50 transition">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-btn transition-all disabled:opacity-60">
              {saving ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
