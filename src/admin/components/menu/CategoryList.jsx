import { useState, useRef } from 'react';
import CategoryIcon, { ICON_OPTIONS } from '../../../components/CategoryIcon';
import { menuItemService } from '../../services/menuItemService';

export default function CategoryList({
  categories, loading, activeCategoryId, onSelect, onCreate, onRename, onDelete
}) {
  const [newName, setNewName] = useState('');
  const [newIconType, setNewIconType] = useState('lucide');
  const [newIconName, setNewIconName] = useState('LayoutGrid');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIconType, setEditIconType] = useState('lucide');
  const [editIconName, setEditIconName] = useState('LayoutGrid');
  const [editImageUrl, setEditImageUrl] = useState('');

  const [showPicker, setShowPicker] = useState(null); // 'add' | 'edit' | null
  const [pickerTab, setPickerTab] = useState('lucide'); // 'lucide' | 'image'
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  // ── Create ──
  async function handleCreate(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!newName.trim()) return;
    try {
      await onCreate(newName.trim(), newIconName, newIconType, newImageUrl);
      setNewName(''); setNewIconName('LayoutGrid'); setNewIconType('lucide'); setNewImageUrl('');
      setAdding(false); setShowPicker(null);
    } catch (err) { console.error('Error creating category:', err); }
  }

  // ── Rename / Update ──
  async function handleRename(id) {
    if (!editName.trim()) return;
    try {
      await onRename(id, {
        name: editName.trim(),
        icon_name: editIconName,
        icon_type: editIconType,
        image_url: editImageUrl || null,
      });
      setEditingId(null); setShowPicker(null);
    } catch (err) { console.error('Error renaming category:', err); }
  }

  // ── Upload image ──
  async function handleImageUpload(e, target) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await menuItemService.uploadMedia(file);
      if (target === 'add') { setNewImageUrl(result.url); setNewIconType('image'); }
      else { setEditImageUrl(result.url); setEditIconType('image'); }
    } catch (err) { console.error('Upload error:', err); }
    finally { setUploading(false); }
  }

  // ── Icon / Image Picker Panel ──
  function IconPickerPanel({ target }) {
    const isAdd = target === 'add';
    const currentIconName = isAdd ? newIconName : editIconName;
    const currentImageUrl = isAdd ? newImageUrl : editImageUrl;
    const setIconName = isAdd ? setNewIconName : setEditIconName;
    const setIconType = isAdd ? setNewIconType : setEditIconType;
    const setImageUrl = isAdd ? setNewImageUrl : setEditImageUrl;

    return (
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-lg mt-1 w-full max-w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => setPickerTab('lucide')}
            className={`flex-1 text-[11px] font-semibold py-1.5 transition ${pickerTab === 'lucide' ? 'text-brand-red border-b-2 border-brand-red' : 'text-brand-gray hover:text-brand-dark'}`}
          >
            Icônes
          </button>
          <button
            type="button"
            onClick={() => setPickerTab('image')}
            className={`flex-1 text-[11px] font-semibold py-1.5 transition ${pickerTab === 'image' ? 'text-brand-red border-b-2 border-brand-red' : 'text-brand-gray hover:text-brand-dark'}`}
          >
            Image
          </button>
        </div>

        {pickerTab === 'lucide' ? (
          <div className="grid grid-cols-5 gap-1 p-2">
            {ICON_OPTIONS.map(opt => (
              <button
                key={opt.name}
                type="button"
                onClick={() => { setIconName(opt.name); setIconType('lucide'); setShowPicker(null); }}
                className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition ${
                  currentIconName === opt.name && (isAdd ? newIconType : editIconType) === 'lucide'
                    ? 'bg-brand-red text-white'
                    : 'hover:bg-gray-100 text-brand-gray'
                }`}
                title={opt.label}
              >
                <CategoryIcon name={opt.name} className="w-4 h-4" />
                <span className="text-[7px] leading-tight truncate w-full text-center">{opt.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {/* Preview */}
            {currentImageUrl && (
              <div className="flex justify-center">
                <img src={currentImageUrl} alt="" className="w-10 h-10 object-contain rounded-lg border border-gray-200" />
              </div>
            )}
            {/* Upload */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full text-[11px] font-semibold py-1.5 rounded-lg border border-dashed border-gray-300 text-brand-gray hover:border-brand-red hover:text-brand-red transition disabled:opacity-50"
            >
              {uploading ? 'Upload...' : '📁 Importer un fichier'}
            </button>
            <p className="text-[9px] text-brand-gray/70 italic leading-tight">Conseil : Pour un résultat optimal, utilisez un fichier PNG à fond transparent ou SVG.</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.svg"
              className="hidden"
              onChange={e => handleImageUpload(e, target)}
            />
            {/* URL paste */}
            <input
              type="text"
              value={currentImageUrl}
              onChange={e => { setImageUrl(e.target.value); if (e.target.value.trim()) setIconType('image'); }}
              placeholder="Ou coller une URL..."
              className="w-full px-2 py-1.5 text-[11px] rounded-lg border border-gray-200 focus:outline-none focus:border-brand-red transition"
              onClick={e => e.stopPropagation()}
            />
            {currentImageUrl && (
              <button
                type="button"
                onClick={() => { setShowPicker(null); }}
                className="w-full text-[11px] font-bold text-white bg-brand-red hover:bg-brand-red-dark py-1.5 rounded-lg transition"
              >
                Valider
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Current icon preview for a button ──
  function IconPreviewBtn({ iconType, iconName, imageUrl, onClick }) {
    return (
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onClick(); }}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-brand-red transition"
        title="Changer l'icône"
      >
        <CategoryIcon name={iconName} iconType={iconType} imageUrl={imageUrl} className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="bg-brand-gray-light rounded-xl p-4 w-56 flex-shrink-0 overflow-hidden">
      <h2 className="font-display font-bold text-base text-brand-dark mb-3">Catégories</h2>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-1 w-full max-w-full">
          {categories.map(cat => (
            <div key={cat.id} className="group relative w-full max-w-full">
              {editingId === cat.id ? (
                <div className="w-full max-w-full overflow-hidden space-y-1" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1 w-full max-w-full">
                    <IconPreviewBtn
                      iconType={editIconType}
                      iconName={editIconName}
                      imageUrl={editImageUrl}
                      onClick={() => { setShowPicker(showPicker === 'edit' ? null : 'edit'); setPickerTab(editIconType === 'image' ? 'image' : 'lucide'); }}
                    />
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleRename(cat.id); } }}
                      onClick={e => e.stopPropagation()}
                      className="min-w-0 flex-1 px-2 py-1.5 text-sm rounded-lg border border-brand-red focus:outline-none"
                      autoFocus
                    />
                    <button onClick={e => { e.stopPropagation(); handleRename(cat.id); }} className="text-green-600 text-xs font-bold px-0.5 flex-shrink-0">✓</button>
                    <button onClick={e => { e.stopPropagation(); setEditingId(null); setShowPicker(null); }} className="text-gray-400 text-xs font-bold px-0.5 flex-shrink-0">✕</button>
                  </div>
                  {showPicker === 'edit' && <IconPickerPanel target="edit" />}
                </div>
              ) : (
                <button
                  onClick={() => onSelect(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeCategoryId === cat.id
                      ? 'bg-brand-red text-white shadow-btn'
                      : 'text-brand-gray hover:bg-white hover:text-brand-dark'
                  }`}
                >
                  <CategoryIcon
                    name={cat.icon_name}
                    iconType={cat.icon_type}
                    imageUrl={cat.image_url}
                    className="w-4 h-4 flex-shrink-0"
                    active={activeCategoryId === cat.id}
                  />
                  <span className="truncate">{cat.name}</span>
                </button>
              )}

              {/* Context actions */}
              {editingId !== cat.id && activeCategoryId === cat.id && (
                <div className="flex gap-1 mt-1 px-1">
                  <button
                    onClick={e => { e.stopPropagation(); setEditingId(cat.id); setEditName(cat.name); setEditIconName(cat.icon_name || 'LayoutGrid'); setEditIconType(cat.icon_type || 'lucide'); setEditImageUrl(cat.image_url || ''); }}
                    className="text-[10px] text-slate-900 font-semibold hover:underline"
                  >
                    Renommer
                  </button>
                  <span className="text-slate-900/50">•</span>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(cat.id); }}
                    className="text-[10px] text-slate-900 font-semibold hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add category */}
          {adding ? (
            <div className="w-full max-w-full overflow-hidden space-y-1 mt-2" onClick={e => e.stopPropagation()}>
              <form onSubmit={handleCreate} className="flex items-center gap-1 w-full max-w-full">
                <IconPreviewBtn
                  iconType={newIconType}
                  iconName={newIconName}
                  imageUrl={newImageUrl}
                  onClick={() => { setShowPicker(showPicker === 'add' ? null : 'add'); setPickerTab(newIconType === 'image' ? 'image' : 'lucide'); }}
                />
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Nom..."
                  className="min-w-0 flex-1 px-2 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-brand-red"
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
                <button type="submit" className="text-green-600 text-xs font-bold px-0.5 flex-shrink-0">✓</button>
                <button type="button" onClick={e => { e.stopPropagation(); setAdding(false); setShowPicker(null); }} className="text-gray-400 text-xs font-bold px-0.5 flex-shrink-0">✕</button>
              </form>
              {showPicker === 'add' && <IconPickerPanel target="add" />}
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); setAdding(true); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-brand-gray hover:bg-white hover:text-brand-dark transition mt-2 border border-dashed border-gray-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
              Ajouter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
