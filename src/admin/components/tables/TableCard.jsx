export default function TableCard({ table, onViewOrder }) {
  const isFree = table.status === 'free';

  return (
    <div className="bg-white rounded-xl shadow-card p-4 flex flex-col items-center gap-2.5 transition-all hover:shadow-card-hover">
      {/* Table Icon */}
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
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

      {/* Action Button */}
      {isFree ? (
        <button className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 text-brand-gray hover:border-green-500 hover:text-green-600 text-xs font-semibold rounded-lg transition-all">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Affecter
        </button>
      ) : (
        <button
          onClick={() => onViewOrder?.(table.activeOrderId)}
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
