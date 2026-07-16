import OrderCard from './OrderCard';

export default function OrderSection({ title, orders, type, onMarkProcessed }) {
  const isNew = type === 'new';
  const count = orders.length;

  return (
    <div className="flex-1 min-w-0">
      {/* Section Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 rounded-t-xl ${
        isNew ? 'bg-brand-red' : 'bg-green-600'
      }`}>
        <h2 className="font-display font-bold text-sm text-white uppercase tracking-wide">
          {title}
        </h2>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
          isNew ? 'bg-white text-brand-red' : 'bg-white text-green-600'
        }`}>
          {count}
        </span>
      </div>

      {/* Cards Grid */}
      <div className={`p-3 rounded-b-xl min-h-[200px] ${
        isNew ? 'bg-red-50/50' : 'bg-green-50/50'
      }`}>
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-brand-gray">
            <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">
              {isNew ? 'Aucune nouvelle commande' : 'Aucune commande traitée'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                type={type}
                onMarkProcessed={onMarkProcessed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
