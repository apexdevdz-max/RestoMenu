import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useSubmitOrder } from '../hooks/useSubmitOrder';

export default function CheckoutModal({ open, tableId, orderType = 'dine_in', onClose, onSuccess }) {
  const { items, totalPrice, clearCart, isShared, submitSharedOrder, isValidating } = useCart();
  const { submitOrder, loading: legacyLoading } = useSubmitOrder();
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const loading = isShared ? isValidating : legacyLoading;
  const isTakeaway = orderType === 'takeaway';

  useEffect(() => {
    if (open) {
      setCustomerName('');
      setCustomerPhone('');
      setNotes('');
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function handleClose() {
    if (loading) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate takeaway required fields
    if (isTakeaway && !customerName.trim()) return;
    if (isTakeaway && !customerPhone.trim()) return;

    const orderData = {
      customerName: customerName.trim(),
      customerPhone: isTakeaway ? customerPhone.trim() : null,
      notes: notes.trim(),
      orderType,
    };

    if (isShared && submitSharedOrder) {
      const result = await submitSharedOrder(orderData);
      if (result.success) onSuccess();
    } else {
      const result = await submitOrder({
        tableNumber: isTakeaway ? null : (parseInt(tableId) || 1),
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        notes: orderData.notes,
        orderType,
        items,
        totalPrice,
      });
      if (result.success) {
        clearCart();
        onSuccess();
      }
    }
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center ${isClosing ? 'animate-[fadeOut_0.3s_ease-out_forwards]' : 'animate-[fadeIn_0.3s_ease-out_forwards]'}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div
        className={`relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl ${
          isClosing ? 'animate-[sheetDown_0.3s_ease-out_forwards]' : 'animate-[sheetUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]'
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-display font-bold text-lg text-brand-dark">{t('checkout.title')}</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            disabled={loading}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-4">
            {/* Context badge: Table or Takeaway */}
            {isTakeaway ? (
              <div className="flex items-center gap-2 bg-violet-50 rounded-xl px-4 py-3">
                <svg className="w-5 h-5 text-violet-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-sm font-semibold text-violet-700">{t('header.takeaway')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-brand-yellow-light rounded-xl px-4 py-3">
                <svg className="w-5 h-5 text-brand-yellow-dark flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5.5c-4.1 0-7.5 1.6-7.5 3.5 0 .4.2.8.5 1.1V18c0 1.1 3.1 2 7 2s7-.9 7-2v-7.9c.3-.3.5-.7.5-1.1 0-1.9-3.4-3.5-7.5-3.5zm0 1.5c3.3 0 6 1.2 6 2s-2.7 2-6 2-6-1.2-6-2 2.7-2 6-2z" />
                </svg>
                <span className="text-sm font-semibold text-brand-dark">{t('checkout.tableLabel')} {tableId}</span>
              </div>
            )}

            {/* Customer Name */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-semibold text-brand-dark mb-1.5">
                {t('checkout.customerName')} {!isTakeaway && <span className="text-brand-gray font-normal">(optionnel)</span>}
                {isTakeaway && <span className="text-red-500">*</span>}
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder={t('checkout.customerNamePlaceholder')}
                required={isTakeaway}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
              />
            </div>

            {/* Phone (takeaway only) */}
            {isTakeaway && (
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-semibold text-brand-dark mb-1.5">
                  {t('checkout.phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder={t('checkout.phonePlaceholder')}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label htmlFor="orderNotes" className="block text-sm font-semibold text-brand-dark mb-1.5">
                {t('checkout.notes')} <span className="text-brand-gray font-normal">(optionnel)</span>
              </label>
              <textarea
                id="orderNotes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t('checkout.notesPlaceholder')}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-dark placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-brand-gray-light rounded-xl p-4 space-y-2">
              <h3 className="font-display font-semibold text-sm text-brand-dark mb-2">{t('cart.total')}</h3>
              {items.map(item => (
                <div key={item.cartItemId} className="flex justify-between text-sm">
                  <span className="text-brand-gray">
                    {item.quantity}x {item.name}
                    {item.selectedOptions.length > 0 && (
                      <span className="text-[10px] block text-brand-gray/70">
                        {item.selectedOptions.map(o => o.name).join(', ')}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-brand-dark">{item.lineTotal} {t('product.currency')}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                <span className="font-display font-bold text-brand-dark">{t('cart.total')}</span>
                <span className="font-display font-bold text-xl text-brand-red">{totalPrice} {t('product.currency')}</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="px-5 pb-5">
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full bg-brand-red hover:bg-brand-red-dark active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 text-white font-bold text-sm py-3.5 rounded-xl shadow-btn transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('checkout.submitting')}
                </>
              ) : (
                <>
                  {t('checkout.submit').toUpperCase()} — {totalPrice} {t('product.currency')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
