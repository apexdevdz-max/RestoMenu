/**
 * Get translated field from a JSONB object or plain string.
 * Supports: { fr: "...", ar: "...", en: "..." } or "plain string"
 * Falls back: requested lang → fr → raw value
 */
export function getTranslation(field, lang = 'fr') {
  if (!field) return '';
  if (typeof field === 'object' && field !== null) {
    return field[lang] || field['fr'] || Object.values(field)[0] || '';
  }
  return field;
}
