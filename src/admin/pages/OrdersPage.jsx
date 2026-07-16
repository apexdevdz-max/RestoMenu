import { useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useNotificationSound } from '../hooks/useNotificationSound';
import OrderSection from '../components/orders/OrderSection';

export default function OrdersPage() {
  const { newOrders, processedOrders, loading, markAsProcessed, setOnNewOrder } = useOrders();
  const { playSound, needsInteraction, enableSound } = useNotificationSound();

  // Play sound on new order
  useEffect(() => {
    setOnNewOrder(() => playSound());
  }, [setOnNewOrder, playSound]);

  if (loading) {
    return (
      <div className="flex gap-4">
        {[1, 2].map(i => (
          <div key={i} className="flex-1">
            <div className="skeleton h-10 rounded-t-xl mb-3" />
            <div className="space-y-3 p-3">
              {[1, 2].map(j => <div key={j} className="skeleton h-40 rounded-xl" />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Sound permission banner */}
      {needsInteraction && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-yellow-800">
            🔔 Cliquez pour activer les notifications sonores
          </p>
          <button
            onClick={enableSound}
            className="text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-lg transition"
          >
            Activer
          </button>
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        <OrderSection
          title="NOUVELLES"
          orders={newOrders}
          type="new"
          onMarkProcessed={markAsProcessed}
        />
        <OrderSection
          title="TRAITÉES"
          orders={processedOrders}
          type="processed"
        />
      </div>
    </div>
  );
}
