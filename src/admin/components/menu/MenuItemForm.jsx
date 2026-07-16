import { useState, useEffect, useRef } from 'react';
import { menuItemService } from '../../services/menuItemService';

export default function MenuItemForm({ open, item, categories, categoryId, onClose, onSave }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    name: '', description: '', price: '', category_id: '', is_available: true, image_url: '', media_type: 'image',
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [previewType, setPreviewType] = useState('image');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (item) {
        setForm({
          name: item.name || '',
          description: item.description || '',
          price: item.price?.toString() || '',
          category_id: item.category_id || categoryId || '',
          is_available: item.is_available !== false,
          image_url: item.image_url || '',
          media_type: item.media_type || 'image',
        });
        setMediaPreview(item.image_url || '');
        setPreviewType(item.media_type || 'image');
      } else {
        setForm({ name: '', description: '', price: '', category_id: categoryId || '', is_available: true, image_url: '', media_type: 'image' });
        setMediaPreview('');
        setPreviewType('image');
      }
      setMediaFile(null);
      setError('');
    }
  }, [open, item, categoryId]);

  function handleMediaChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setPreviewType(file.type.startsWith('video/') ? 'video' : 'image');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price || !form.category_id) {
      setError('Nom, prix et catégorie sont obligatoires.');
      return;
    }

    setSaving(true);
    try {
      let image_url = form.image_url;
      let media_type = form.media_type;

      if (mediaFile) {
        const result = await menuItemService.uploadMedia(mediaFile);
        image_url = result.url;
        media_type = result.mediaType;
      }

      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseInt(form.price),
        category_id: form.category_id,
        is_available: form.is_available,
        image_url,
        media_type,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-lg text-brand-dark">
            {isEdit ? 'Modifier le plat' : 'Ajouter un plat'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Media Upload (Image or Video) */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Image / Vidéo</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-brand-red/50 transition overflow-hidden relative"
            >
              {mediaPreview ? (
                previewType === 'video' ? (
                  <video
                    src={mediaPreview}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-brand-gray">Cliquez pour ajouter une image ou vidéo</p>
                </div>
              )}
              {/* Media type badge */}
              {mediaPreview && (
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  previewType === 'video'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {previewType === 'video' ? '🎬 Vidéo' : '🖼️ Image'}
                </span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleMediaChange} className="hidden" />
            <p className="text-[10px] text-brand-gray mt-1">Formats acceptés : JPG, PNG, WebP, MP4, WebM</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Nom *</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Salade Marocaine"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Courte description du plat..."
              rows="2"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
            />
          </div>

          {/* Price + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1.5">Prix (DA) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1.5">Catégorie *</label>
              <select
                value={form.category_id}
                onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
              >
                <option value="">Sélectionner...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-dark">Disponible</span>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, is_available: !f.is_available }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                form.is_available ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                form.is_available ? 'left-[22px]' : 'left-0.5'
              }`} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl">{error}</div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-brand-gray hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-sm font-bold shadow-btn transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enregistrement...
                </>
              ) : (
                isEdit ? 'Enregistrer' : 'Ajouter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
