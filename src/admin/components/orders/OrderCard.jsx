import OrderItemList from './OrderItemList';

export default function OrderCard({ order, type, onMarkProcessed }) {
  const isNew = type === 'new';
  const isTakeaway = order.order_type === 'takeaway';
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

          {/* Order type badge */}
          {isTakeaway ? (
            <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              À emporter
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5.5c-4.1 0-7.5 1.6-7.5 3.5 0 .4.2.8.5 1.1V18c0 1.1 3.1 2 7 2s7-.9 7-2v-7.9c.3-.3.5-.7.5-1.1 0-1.9-3.4-3.5-7.5-3.5zm0 1.5c3.3 0 6 1.2 6 2s-2.7 2-6 2-6-1.2-6-2 2.7-2 6-2z" />
              </svg>
              Table {order.table_number}
            </span>
          )}
        </div>
        <span className="text-xs text-brand-gray font-medium">{time}</span>
      </div>

      {/* Items */}
      <OrderItemList items={order.order_items} />

      {/* Customer info */}
      {order.customer_name && (
        <p className="text-xs text-brand-gray">
          <span className="font-medium">Client:</span> {order.customer_name}
          {isTakeaway && order.customer_phone && (
            <span className="ms-2 text-violet-600 font-medium">📞 {order.customer_phone}</span>
          )}
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
