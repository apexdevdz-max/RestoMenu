export default function Header({ tableId, onMenuOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-nav">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Hamburger */}
        <button
          onClick={onMenuOpen}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
          aria-label="Menu"
        >
          <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <img src="/images/logo.png" alt="El-Mawid logo" className="w-8 h-8 rounded-full object-cover" />
          <div className="text-center">
            <h1 className="font-display font-extrabold text-[17px] leading-tight text-brand-dark tracking-tight">El-Mawid</h1>
            <p className="text-[9px] font-medium text-brand-red -mt-0.5 tracking-wide">Goûtez l'Algérie</p>
          </div>
        </div>

        {/* Table Button */}
        <button className="flex items-center gap-1.5 bg-brand-yellow hover:bg-brand-yellow-dark active:scale-95 text-brand-dark font-semibold text-xs px-3 py-1.5 rounded-full transition-all shadow-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5.5c-4.1 0-7.5 1.6-7.5 3.5 0 .4.2.8.5 1.1V18c0 1.1 3.1 2 7 2s7-.9 7-2v-7.9c.3-.3.5-.7.5-1.1 0-1.9-3.4-3.5-7.5-3.5zm0 1.5c3.3 0 6 1.2 6 2s-2.7 2-6 2-6-1.2-6-2 2.7-2 6-2z" />
          </svg>
          Table {tableId}
        </button>
      </div>
    </header>
  );
}
