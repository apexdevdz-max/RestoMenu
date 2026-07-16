import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      {/* Logo */}
      <img src="/images/logo.png" alt="El-Mawid" className="w-16 h-16 rounded-full object-cover mb-6" />

      {/* 404 */}
      <h1 className="font-display font-extrabold text-6xl text-brand-red mb-2">404</h1>
      <h2 className="font-display font-bold text-xl text-brand-dark mb-2">Page introuvable</h2>
      <p className="text-sm text-brand-gray mb-8 max-w-xs">
        Scannez le QR code sur votre table pour accéder au menu, ou utilisez le lien ci-dessous.
      </p>

      <Link
        to="/table/1"
        className="bg-brand-red hover:bg-brand-red-dark active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-btn transition-all duration-200"
      >
        Voir le menu — Table 1
      </Link>
    </div>
  );
}
