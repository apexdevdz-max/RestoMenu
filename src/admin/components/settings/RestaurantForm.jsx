import { useState, useRef } from 'react';
import { restaurantService } from '../../services/restaurantService';

export default function RestaurantForm({ restaurant, onUpdate }) {
  const [form, setForm] = useState({
    name: restaurant?.name || '',
    address: restaurant?.address || '',
    phone: restaurant?.phone || '',
    email: restaurant?.email || '',
  });
  const [logoPreview, setLogoPreview] = useState(restaurant?.logo_url || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef(null);

  async function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    try {
      const url = await restaurantService.uploadLogo(file);
      await onUpdate({ logo_url: url });
    } catch (err) {
      console.error('Logo upload error:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await onUpdate(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 max-w-2xl space-y-5">
      <h2 className="font-display font-bold text-lg text-brand-dark mb-1">Informations du restaurant</h2>
      <p className="text-sm text-brand-gray mb-4">Gérez les informations de votre établissement.</p>

      {/* Logo */}
      <div>
        <label className="block text-sm font-semibold text-brand-dark mb-2">Logo</label>
        <div className="flex items-center gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-brand-red/50 transition overflow-hidden"
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          <p className="text-xs text-brand-gray">Cliquez pour modifier le logo.</p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-brand-dark mb-1.5">Nom du restaurant</label>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition" />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-brand-dark mb-1.5">Adresse</label>
        <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition" />
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-1.5">Téléphone</label>
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-1.5">Email</label>
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition" />
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="border-t border-gray-100 pt-4 mt-4">
        <h3 className="font-display font-semibold text-sm text-brand-gray mb-2">Paramètres supplémentaires</h3>
        <div className="bg-brand-gray-light rounded-xl p-4 text-center">
          <p className="text-sm text-brand-gray">Horaires, paiement, notifications — à venir.</p>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-btn transition-all disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          Enregistrer
        </button>
        {success && <span className="text-sm text-green-600 font-medium">✓ Enregistré</span>}
      </div>
    </form>
  );
}
