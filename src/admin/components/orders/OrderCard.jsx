import OrderItemList from './OrderItemList';

export default function OrderCard({ order, type, onMarkProcessed }) {
  const isNew = type === 'new';
  const time = new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const processedTime = order.processed_at
    ? new Date(order.processed_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="bg-white rounded-xl shadow-card p-4 flex flex-col gap-3 transition-all hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {isNew ? (
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <h3 className="font-display font-bold text-sm text-brand-dark">Table {order.table_number}</h3>
        </div>
        <span className="text-xs text-brand-gray font-medium">{time}</span>
      </div>

      {/* Items */}
      <OrderItemList items={order.order_items} />

      {/* Customer info */}
      {order.customer_name && (
        <p className="text-xs text-brand-gray">
          <span className="font-medium">Client:</span> {order.customer_name}
        </p>
      )}
      {order.notes && (
        <p className="text-xs text-brand-gray italic">
          <span className="font-medium not-italic">Note:</span> {order.notes}
        </p>
      )}

      {/* Total */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="text-xs font-semibold text-brand-gray">Total</span>
        <span className="font-display font-bold text-sm text-brand-dark">
          {order.total || order.total_price} DA
        </span>
      </div>

      {/* Action */}
      {isNew && onMarkProcessed && (
        <button
          onClick={() => onMarkProcessed(order.id)}
          className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-xs font-semibold py-2 rounded-lg transition-all duration-200"
        >
          Marquer comme traitée
        </button>
      )}

      {!isNew && processedTime && (
        <p className="text-center text-[11px] text-brand-gray">
          Servie à {processedTime}
        </p>
      )}
    </div>
  );
}
