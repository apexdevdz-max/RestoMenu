export default function TableStats({ tables }) {
  const free = tables.filter(t => t.status === 'free').length;
  const occupied = tables.filter(t => t.status === 'occupied').length;
  const totalSeats = tables.reduce((sum, t) => sum + t.seats, 0);

  return (
    <div className="flex items-center justify-center gap-6 py-4 border-t border-gray-200 mt-4">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="text-sm text-brand-dark font-medium">{free} libres</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="text-sm text-brand-dark font-medium">{occupied} occupées</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm text-brand-dark font-medium">{totalSeats} couverts au total</span>
      </div>
    </div>
  );
}
