import { useState, useRef, useEffect } from 'react';

export default function TableCard({ table, onViewOrder, onEdit, onDelete }) {
  const isFree = table.status === 'free';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div className="relative bg-white rounded-xl shadow-card p-4 flex flex-col items-center gap-2.5 transition-all hover:shadow-card-hover">
      {/* 3-dot menu */}
      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[120px] z-10 animate-[fadeIn_0.15s_ease-out]">
            <button
              onClick={() => { setMenuOpen(false); onEdit?.(table); }}
              className="w-full text-left px-3 py-2 text-sm text-brand-dark hover:bg-gray-50 flex items-center gap-2 transition"
            >
              <svg className="w-3.5 h-3.5 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDelete?.(table); }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Table Icon */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isFree ? 'bg-gray-100' : 'bg-red-50'}`}>
        <svg className={`w-6 h-6 ${isFree ? 'text-gray-500' : 'text-brand-red'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 6v2a2 2 0 002 2h12a2 2 0 002-2V6M6 10v8m12-8v8M8 18h8" />
        </svg>
      </div>

      {/* Table Number */}
      <h3 className="font-display font-bold text-sm text-brand-dark">Table {table.table_number}</h3>

      {/* Status Badge */}
      <span className={`text-[11px] font-semibold px-3 py-0.5 rounded-full ${
        isFree
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}>
        {isFree ? 'Libre' : 'Occupée'}
      </span>

      {/* Seats */}
      <div className="flex items-center gap-1 text-xs text-brand-gray">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {table.seats} couverts
      </div>

      {/* Order count + total for occupied tables */}
      {!isFree && table.orderCount > 0 && (
        <div className="text-center">
          <span className="text-xs font-semibold text-brand-red">{table.orderCount} commande{table.orderCount > 1 ? 's' : ''}</span>
          <p className="text-[11px] font-bold text-brand-dark">{table.grandTotal} DA</p>
        </div>
      )}

      {/* Action Button */}
      {isFree ? (
        <button
          onClick={() => onViewOrder?.(table)}
          className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 text-brand-gray hover:border-green-500 hover:text-green-600 text-xs font-semibold rounded-lg transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Détails
        </button>
      ) : (
        <button
          onClick={() => onViewOrder?.(table)}
          className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-semibold rounded-lg transition-all active:scale-[0.98]"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Voir commande
        </button>
      )}
    </div>
  );
}
