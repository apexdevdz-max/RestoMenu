import { useState } from 'react';
import { usePurgeSettings } from '../../hooks/usePurgeSettings';

const DELAY_OPTIONS = [
  { value: '1', label: '1 heure' },
  { value: '2', label: '2 heures' },
  { value: '4', label: '4 heures' },
  { value: '6', label: '6 heures' },
];

export default function OrderPurgeSettings() {
  const { settings, saveSettings, saving, success } = usePurgeSettings();
  const [form, setForm] = useState({
    purge_mode: settings.purge_mode,
    purge_value: settings.purge_value,
  });

  function handleModeChange(e) {
    const mode = e.target.value;
    setForm({
      purge_mode: mode,
      purge_value: mode === 'delay' ? '4' : '05:00',
    });
  }

  function handleValueChange(e) {
    setForm(f => ({ ...f, purge_value: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await saveSettings(form);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 space-y-5 h-fit">
      <div>
        <h2 className="font-display font-bold text-lg text-brand-dark mb-1">Nettoyage Automatique</h2>
        <p className="text-sm text-brand-gray">
          Définissez la règle pour faire disparaître automatiquement les commandes traitées du dashboard.
        </p>
      </div>

      {/* Mode de nettoyage */}
      <div>
        <label className="block text-sm font-semibold text-brand-dark mb-1.5">
          Mode de nettoyage
        </label>
        <div className="relative">
          <select
            value={form.purge_mode}
            onChange={handleModeChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-dark bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition pr-10"
          >
            <option value="delay">Par délai (ex: X heures après le service)</option>
            <option value="fixed_time">À heure fixe (ex: tous les jours à 05:00)</option>
          </select>
          <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Valeur / Réglage dynamique */}
      <div>
        <label className="block text-sm font-semibold text-brand-dark mb-1.5">
          {form.purge_mode === 'delay' ? 'Délai de suppression' : 'Heure de réinitialisation'}
        </label>
        {form.purge_mode === 'delay' ? (
          <div className="relative">
            <select
              value={form.purge_value}
              onChange={handleValueChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-dark bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition pr-10"
            >
              {DELAY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <input
            type="time"
            value={form.purge_value}
            onChange={handleValueChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
          />
        )}
        <p className="text-xs text-brand-gray mt-2">
          {form.purge_mode === 'delay'
            ? `Les commandes traitées disparaîtront ${form.purge_value === '1' ? '1 heure' : form.purge_value + ' heures'} après avoir été marquées comme traitées.`
            : `Les commandes traitées seront réinitialisées chaque jour à ${form.purge_value || '05:00'}.`
          }
        </p>
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
          Enregistrer les règles
        </button>
        {success && <span className="text-sm text-green-600 font-medium">✓ Enregistré</span>}
      </div>
    </form>
  );
}
