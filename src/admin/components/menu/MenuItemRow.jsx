export default function MenuItemRow({ item, onEdit, onDelete, onToggleAvailability }) {
  const price = typeof item.price === 'number'
    ? item.price.toLocaleString('fr-FR', { minimumFractionDigits: 0 })
    : item.price;

  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-xl transition-all ${
      item.is_available === false ? 'opacity-50' : ''
    }`}>
      {/* Media */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-gray-light flex-shrink-0 relative">
        {item.image_url ? (
          item.media_type === 'video' ? (
            <>
              <video src={item.image_url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
              <span className="absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">🎬</span>
            </>
          ) : (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-sm text-brand-dark mb-0.5">{item.name}</h3>
        <p className="text-xs text-brand-gray line-clamp-2 leading-relaxed">{item.description}</p>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <span className="font-display font-bold text-base text-green-600">{price} DA</span>
      </div>

      {/* Availability Toggle */}
      <button
        onClick={() => onToggleAvailability(item.id, !item.is_available)}
        className={`flex-shrink-0 w-10 h-5 rounded-full transition-colors relative ${
          item.is_available !== false ? 'bg-green-500' : 'bg-gray-300'
        }`}
        title={item.is_available !== false ? 'Disponible' : 'Indisponible'}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          item.is_available !== false ? 'left-5' : 'left-0.5'
        }`} />
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-green-500 text-green-600 hover:bg-green-50 rounded-lg text-xs font-semibold transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Modifier
        </button>
        <button
          onClick={() => onDelete(item)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-400 text-red-500 hover:bg-red-50 rounded-lg text-xs font-semibold transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Supprimer
        </button>
      </div>
    </div>
  );
}
