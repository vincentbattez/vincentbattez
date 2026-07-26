/**
 * Source de vérité unique pour le statut de disponibilité.
 *
 * Ces deux variables pilotent les différents états du site (badge navbar,
 * etc.). Importé côté build (`./config/status`) comme côté composants
 * (`~/config/status`).
 */

// Passer à `false` quand je suis indisponible pour une mission freelance.
export const isAvailableForFreelance = true;

// Date de dernière mise à jour du statut (format ISO).
export const statusUpdatedAt = "2026-07-24";
