import { useState, useEffect, useRef } from 'react';
import { menuItemService } from '../../services/menuItemService';

// ─── Selection mode selector for a group ───
function SelectionModeRow({ mode, maxSelections, onChange }) {
  return (
    <div className="flex items-center gap-3 mt-1.5 mb-2 pl-1">
      <label className="flex items-center gap-1 text-[11px] text-brand-gray cursor-pointer">
        <input
          type="radio"
          checked={mode === 'single'}
          onChange={() => onChange({ mode: 'single', max_selections: 1 })}
          className="accent-brand-red w-3 h-3"
        />
        Choix unique
      </label>
      <label className="flex items-center gap-1 text-[11px] text-brand-gray cursor-pointer">
        <input
          type="radio"
          checked={mode === 'multi'}
          onChange={() => onChange({ mode: 'multi', max_selections: 0 })}
          className="accent-brand-red w-3 h-3"
        />
        Choix multiple
      </label>
      {mode === 'multi' && (
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-brand-gray">Max :</span>
          <select
            value={maxSelections || 0}
            onChange={e => onChange({ mode: 'multi', max_selections: parseInt(e.target.value) })}
            className="text-[11px] px-1.5 py-0.5 rounded border border-gray-200 bg-white focus:outline-none focus:border-brand-red"
          >
            <option value="0">Illimité</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      )}
    </div>
  );
}

// ─── Reusable: editable list with +price ───
function PricedList({ items, onChange, label, placeholder, onRemoveGroup, mode, maxSelections, onModeChange }) {
  function add() { onChange([...items, { name: '', price: 0 }]); }
  function update(idx, field, value) {
    const next = items.map((it, i) => i === idx ? { ...it, [field]: value } : it);
    onChange(next);
  }
  function remove(idx) { onChange(items.filter((_, i) => i !== idx)); }
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-sm font-semibold text-brand-dark">{label}</label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={add} className="text-xs font-semibold text-brand-red hover:underline">+ Ajouter</button>
          {onRemoveGroup && (
            <button type="button" onClick={onRemoveGroup} className="text-xs text-gray-400 hover:text-red-500 transition" title="Supprimer ce groupe">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {onModeChange && (
        <SelectionModeRow mode={mode} maxSelections={maxSelections} onChange={onModeChange} />
      )}
      {items.length === 0 && <p className="text-xs text-brand-gray italic mb-1">Aucun élément</p>}
      <div className="space-y-1.5">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              value={it.name}
              onChange={e => update(idx, 'name', e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
            />
            <div className="relative w-24">
              <input
                type="number"
                value={it.price}
                onChange={e => update(idx, 'price', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition pr-8"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-brand-gray">DA</span>
            </div>
            <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600 transition flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reusable: simple string list ───
function StringList({ items, onChange, label, placeholder, onRemoveGroup, mode, maxSelections, onModeChange }) {
  function add() { onChange([...items, '']); }
  function update(idx, value) {
    const next = items.map((it, i) => i === idx ? value : it);
    onChange(next);
  }
  function remove(idx) { onChange(items.filter((_, i) => i !== idx)); }
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-sm font-semibold text-brand-dark">{label}</label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={add} className="text-xs font-semibold text-brand-red hover:underline">+ Ajouter</button>
          {onRemoveGroup && (
            <button type="button" onClick={onRemoveGroup} className="text-xs text-gray-400 hover:text-red-500 transition" title="Supprimer ce groupe">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {onModeChange && (
        <SelectionModeRow mode={mode} maxSelections={maxSelections} onChange={onModeChange} />
      )}
      {items.length === 0 && <p className="text-xs text-brand-gray italic mb-1">Aucun élément</p>}
      <div className="space-y-1.5">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              value={it}
              onChange={e => update(idx, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
            />
            <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600 transition flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Form ───
export default function MenuItemForm({ open, item, categories, categoryId, onClose, onSave }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    name: '', description: '', price: '', category_id: '', is_available: true, image_url: '', media_type: 'image',
  });
  const [options, setOptions] = useState({
    sizes: [], supplements: [], removals: [], sauces: [],
    sizes_mode: 'single', sizes_max: 1,
    supplements_mode: 'multi', supplements_max: 0,
    removals_mode: 'multi', removals_max: 0,
    sauces_mode: 'single', sauces_max: 1,
  });
  const [customGroups, setCustomGroups] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [addingGroup, setAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState('priced');
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
        const opts = item.options || {};
        setOptions({
          sizes: opts.sizes || [],
          supplements: opts.supplements || [],
          removals: opts.removals || [],
          sauces: opts.sauces || [],
          sizes_mode: opts.sizes_mode || 'single',
          sizes_max: opts.sizes_max ?? 1,
          supplements_mode: opts.supplements_mode || 'multi',
          supplements_max: opts.supplements_max ?? 0,
          removals_mode: opts.removals_mode || 'multi',
          removals_max: opts.removals_max ?? 0,
          sauces_mode: opts.sauces_mode || 'single',
          sauces_max: opts.sauces_max ?? 1,
        });
        setCustomGroups((opts.custom_groups || []).map(g => ({
          ...g,
          mode: g.mode || 'multi',
          max_selections: g.max_selections ?? 0,
        })));
        const hasOpts = (opts.sizes?.length > 0 || opts.supplements?.length > 0 || opts.removals?.length > 0 || opts.sauces?.length > 0 || opts.custom_groups?.length > 0);
        setShowOptions(hasOpts);
        setMediaPreview(item.image_url || '');
        setPreviewType(item.media_type || 'image');
      } else {
        setForm({ name: '', description: '', price: '', category_id: categoryId || '', is_available: true, image_url: '', media_type: 'image' });
        setOptions({
          sizes: [], supplements: [], removals: [], sauces: [],
          sizes_mode: 'single', sizes_max: 1,
          supplements_mode: 'multi', supplements_max: 0,
          removals_mode: 'multi', removals_max: 0,
          sauces_mode: 'single', sauces_max: 1,
        });
        setCustomGroups([]);
        setShowOptions(false);
        setMediaPreview('');
        setPreviewType('image');
      }
      setMediaFile(null);
      setError('');
      setAddingGroup(false);
      setNewGroupName('');
    }
  }, [open, item, categoryId]);

  function handleMediaChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setPreviewType(file.type.startsWith('video/') ? 'video' : 'image');
  }

  function cleanOptions() {
    return {
      sizes: options.sizes.filter(s => s.name.trim()),
      sizes_mode: options.sizes_mode,
      sizes_max: options.sizes_max,
      supplements: options.supplements.filter(s => s.name.trim()),
      supplements_mode: options.supplements_mode,
      supplements_max: options.supplements_max,
      removals: options.removals.filter(r => r.trim()),
      removals_mode: options.removals_mode,
      removals_max: options.removals_max,
      sauces: options.sauces.filter(s => s.trim()),
      sauces_mode: options.sauces_mode,
      sauces_max: options.sauces_max,
      custom_groups: customGroups
        .map(g => ({
          ...g,
          items: g.type === 'priced'
            ? g.items.filter(i => i.name.trim())
            : g.items.filter(i => (typeof i === 'string' ? i.trim() : i.name?.trim())),
        }))
        .filter(g => g.name.trim()),
    };
  }

  function handleAddCustomGroup() {
    if (!newGroupName.trim()) return;
    setCustomGroups(prev => [...prev, { name: newGroupName.trim(), type: newGroupType, items: [], mode: 'multi', max_selections: 0 }]);
    setNewGroupName('');
    setAddingGroup(false);
  }

  function removeCustomGroup(idx) {
    setCustomGroups(prev => prev.filter((_, i) => i !== idx));
  }

  function updateCustomGroupItems(idx, items) {
    setCustomGroups(prev => prev.map((g, i) => i === idx ? { ...g, items } : g));
  }

  function updateCustomGroupMode(idx, { mode, max_selections }) {
    setCustomGroups(prev => prev.map((g, i) => i === idx ? { ...g, mode, max_selections } : g));
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
        options: cleanOptions(),
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
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
          {/* Media Upload */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Image / Vidéo</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-brand-red/50 transition overflow-hidden relative"
            >
              {mediaPreview ? (
                previewType === 'video' ? (
                  <video src={mediaPreview} className="w-full h-full object-cover" autoPlay loop muted playsInline />
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
              {mediaPreview && (
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  previewType === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
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

          {/* Price + Category */}
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

          {/* ═══════════════ OPTIONS & DÉCLINAISONS ═══════════════ */}
          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-brand-red transition"
            >
              <svg className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Options & Déclinaisons
            </button>

            {showOptions && (
              <div className="mt-4 space-y-5 pl-1">
                {/* Tailles */}
                <PricedList
                  items={options.sizes}
                  onChange={sizes => setOptions(o => ({ ...o, sizes }))}
                  label="Tailles"
                  placeholder="Ex: 33cl, 1L..."
                  mode={options.sizes_mode}
                  maxSelections={options.sizes_max}
                  onModeChange={({ mode, max_selections }) => setOptions(o => ({ ...o, sizes_mode: mode, sizes_max: max_selections }))}
                />

                {/* Suppléments */}
                <PricedList
                  items={options.supplements}
                  onChange={supplements => setOptions(o => ({ ...o, supplements }))}
                  label="Suppléments"
                  placeholder="Ex: Extra fromage..."
                  mode={options.supplements_mode}
                  maxSelections={options.supplements_max}
                  onModeChange={({ mode, max_selections }) => setOptions(o => ({ ...o, supplements_mode: mode, supplements_max: max_selections }))}
                />

                {/* Retirer */}
                <StringList
                  items={options.removals}
                  onChange={removals => setOptions(o => ({ ...o, removals }))}
                  label="Retirer"
                  placeholder="Ex: Sans oignons..."
                  mode={options.removals_mode}
                  maxSelections={options.removals_max}
                  onModeChange={({ mode, max_selections }) => setOptions(o => ({ ...o, removals_mode: mode, removals_max: max_selections }))}
                />

                {/* Sauces */}
                <StringList
                  items={options.sauces}
                  onChange={sauces => setOptions(o => ({ ...o, sauces }))}
                  label="Sauces"
                  placeholder="Ex: Ketchup..."
                  mode={options.sauces_mode}
                  maxSelections={options.sauces_max}
                  onModeChange={({ mode, max_selections }) => setOptions(o => ({ ...o, sauces_mode: mode, sauces_max: max_selections }))}
                />

                {/* ── Custom Groups ── */}
                {customGroups.map((group, idx) => (
                  <div key={idx}>
                    {group.type === 'priced' ? (
                      <PricedList
                        items={group.items}
                        onChange={items => updateCustomGroupItems(idx, items)}
                        label={group.name}
                        placeholder={`Ex: élément de ${group.name}...`}
                        onRemoveGroup={() => removeCustomGroup(idx)}
                        mode={group.mode}
                        maxSelections={group.max_selections}
                        onModeChange={({ mode, max_selections }) => updateCustomGroupMode(idx, { mode, max_selections })}
                      />
                    ) : (
                      <StringList
                        items={group.items}
                        onChange={items => updateCustomGroupItems(idx, items)}
                        label={group.name}
                        placeholder={`Ex: élément de ${group.name}...`}
                        onRemoveGroup={() => removeCustomGroup(idx)}
                        mode={group.mode}
                        maxSelections={group.max_selections}
                        onModeChange={({ mode, max_selections }) => updateCustomGroupMode(idx, { mode, max_selections })}
                      />
                    )}
                  </div>
                ))}

                {/* Add new custom group */}
                {addingGroup ? (
                  <div className="border border-dashed border-gray-300 rounded-xl p-3 space-y-2">
                    <input
                      value={newGroupName}
                      onChange={e => setNewGroupName(e.target.value)}
                      placeholder="Nom du groupe (ex: Viandes, Cuisson...)"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomGroup())}
                    />
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-brand-gray cursor-pointer">
                        <input type="radio" name="groupType" checked={newGroupType === 'priced'} onChange={() => setNewGroupType('priced')} className="accent-brand-red" />
                        Avec prix
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-brand-gray cursor-pointer">
                        <input type="radio" name="groupType" checked={newGroupType === 'simple'} onChange={() => setNewGroupType('simple')} className="accent-brand-red" />
                        Sans prix
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setAddingGroup(false)} className="flex-1 text-xs font-semibold text-brand-gray py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">Annuler</button>
                      <button type="button" onClick={handleAddCustomGroup} className="flex-1 text-xs font-bold text-white bg-brand-red hover:bg-brand-red-dark py-1.5 rounded-lg transition">Créer</button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingGroup(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-gray-300 text-xs font-semibold text-brand-gray hover:border-brand-red hover:text-brand-red transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                    </svg>
                    Ajouter un groupe d'options
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl">{error}</div>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-brand-gray hover:bg-gray-50 transition">Annuler</button>
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
              ) : (isEdit ? 'Enregistrer' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
