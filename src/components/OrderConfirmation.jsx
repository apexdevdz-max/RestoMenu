import { useEffect, useState } from 'react';

export default function OrderConfirmation({ open, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 ${
        isClosing ? 'animate-[fadeOut_0.3s_ease-out_forwards]' : 'animate-[fadeIn_0.3s_ease-out_forwards]'
      }`}
    >
      <div
        className={`bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl transition-transform duration-300 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
      >
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="font-display font-bold text-xl text-brand-dark mb-2">Commande validée !</h3>
        <p className="text-sm text-brand-gray mb-5">
          Votre commande a été envoyée en cuisine. Merci de patienter.
        </p>

        <button
          onClick={handleClose}
          className="bg-brand-red hover:bg-brand-red-dark text-white font-semibold text-sm px-8 py-2.5 rounded-xl shadow-btn transition-all active:scale-95"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
