import { useState } from 'react';
import OrderItemList from '../orders/OrderItemList';

export default function TableDrawer({ table, open, onClose, onRelease }) {
  const [releasing, setReleasing] = useState(false);

  if (!open || !table) return null;

  const orders = table.activeOrders || [];
  const isFree = table.status === 'free';
  const grandTotal = table.grandTotal || 0;

  async function handleRelease() {
    setReleasing(true);
    try {
      await onRelease(table.table_number);
      onClose();
    } catch (err) {
      console.error('Error releasing table:', err);
    } finally {
      setReleasing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-[fadeIn_0.2s_ease-out]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-[slideInRight_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFree ? 'bg-green-50' : 'bg-red-50'}`}>
              <svg className={`w-5 h-5 ${isFree ? 'text-green-600' : 'text-brand-red'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 6v2a2 2 0 002 2h12a2 2 0 002-2V6M6 10v8m12-8v8M8 18h8" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-brand-dark">Table {table.table_number}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isFree ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isFree ? 'Libre' : 'Occupée'}
                </span>
                {orders.length > 0 && (
                  <span className="text-xs text-brand-gray">{orders.length} commande{orders.length > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Table Info */}
          <div className="flex items-center gap-2 mb-5 text-sm text-brand-gray">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {table.seats} couverts
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, idx) => {
                const time = new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={order.id} className="bg-gray-50 rounded-xl p-4">
                    {/* Order header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-red/10 text-brand-red text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-display font-semibold text-sm text-brand-dark">
                          Commande #{idx + 1}
                        </span>
                      </div>
                      <span className="text-xs text-brand-gray">{time}</span>
                    </div>

                    {/* Customer info */}
                    {order.customer_name && (
                      <p className="text-xs text-brand-gray mb-1">
                        <span className="font-medium text-brand-dark">Client :</span> {order.customer_name}
                      </p>
                    )}
                    {order.notes && (
                      <p className="text-xs text-brand-gray italic mb-2">
                        <span className="font-medium not-italic text-brand-dark">Note :</span> {order.notes}
                      </p>
                    )}

                    {/* Items */}
                    <OrderItemList items={order.order_items} />

                    {/* Order subtotal */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                      <span className="text-xs font-medium text-brand-gray">Sous-total</span>
                      <span className="font-display font-bold text-sm text-brand-dark">{order.total} DA</span>
                    </div>
                  </div>
                );
              })}

              {/* Grand Total */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-brand-red/20">
                <span className="font-display font-bold text-brand-dark">Total Général</span>
                <span className="font-display font-bold text-2xl text-brand-red">{grandTotal} DA</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-brand-gray font-medium">Cette table est libre</p>
              <p className="text-xs text-brand-gray mt-1">Aucune commande en cours</p>
            </div>
          )}
        </div>

        {/* Footer action */}
        {orders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button
              onClick={handleRelease}
              disabled={releasing}
              className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold text-sm py-3 rounded-xl shadow-btn transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {releasing ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {releasing ? 'En cours...' : `Encaisser ${grandTotal} DA / Libérer la table`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
