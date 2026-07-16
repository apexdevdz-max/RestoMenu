import { useState } from 'react';

export default function CategoryList({
  categories, loading, activeCategoryId, onSelect, onCreate, onRename, onDelete
}) {
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await onCreate(newName.trim());
      setNewName('');
      setAdding(false);
    } catch (err) {
      console.error('Error creating category:', err);
    }
  }

  async function handleRename(id) {
    if (!editName.trim()) return;
    try {
      await onRename(id, { name: editName.trim() });
      setEditingId(null);
    } catch (err) {
      console.error('Error renaming category:', err);
    }
  }

  const CATEGORY_ICONS = {
    default: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  };

  return (
    <div className="bg-brand-gray-light rounded-xl p-4 w-56 flex-shrink-0">
      <h2 className="font-display font-bold text-base text-brand-dark mb-3">Catégories</h2>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-1">
          {categories.map(cat => (
            <div key={cat.id} className="group relative">
              {editingId === cat.id ? (
                <div className="flex gap-1">
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRename(cat.id)}
                    className="flex-1 px-2 py-1.5 text-sm rounded-lg border border-brand-red focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => handleRename(cat.id)} className="text-green-600 text-xs font-bold px-1">✓</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 text-xs font-bold px-1">✕</button>
                </div>
              ) : (
                <button
                  onClick={() => onSelect(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeCategoryId === cat.id
                      ? 'bg-brand-red text-white shadow-btn'
                      : 'text-brand-gray hover:bg-white hover:text-brand-dark'
                  }`}
                >
                  {CATEGORY_ICONS.default}
                  <span className="truncate">{cat.name}</span>
                </button>
              )}

              {/* Context actions (show on hover) */}
              {editingId !== cat.id && activeCategoryId === cat.id && (
                <div className="flex gap-1 mt-1 px-1">
                  <button
                    onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                    className="text-[10px] text-white/80 hover:text-white"
                  >
                    Renommer
                  </button>
                  <span className="text-white/40">•</span>
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="text-[10px] text-white/80 hover:text-white"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add category */}
          {adding ? (
            <form onSubmit={handleCreate} className="flex gap-1 mt-2">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Nom..."
                className="flex-1 px-2 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-brand-red"
                autoFocus
              />
              <button type="submit" className="text-green-600 text-xs font-bold px-1">✓</button>
              <button type="button" onClick={() => setAdding(false)} className="text-gray-400 text-xs font-bold px-1">✕</button>
            </form>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-brand-gray hover:bg-white hover:text-brand-dark transition mt-2 border border-dashed border-gray-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
              Ajouter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
