# Afficher le prochain créneau via l'API privée d'Openings (Fantastical)

## Contexte

On veut afficher un « Prochain créneau » **véritable** sous le bouton « Consulter mes disponibilités » (`pages/index.vue`). Les agendas de Vincent sont répartis entre iCloud et Google, et agrégés par Openings (Fantastical). Il fallait une source qui donne le premier créneau réellement libre, busy-aware, sans recopier les règles de disponibilité.

## Décision

On consomme l'**API privée non documentée** que le front d'Openings utilise lui-même :
`GET https://api.flexibits.com/v1/openings/engagement/{uuid}/availability?range_start&range_end&duration`. Elle renvoie les créneaux libres busy-aware (iCloud + Google déjà fusionnés) sans authentification. Le `uuid` et le slug (`vincentbattez/entretien`) sont déjà publics dans le SPA de Fantastical.

## Considered Options

- **Fusion de flux `.ics` (Google + iCloud)** — écartée : double auth (secret Google + mot de passe d'app CalDAV iCloud), cache Google jusqu'à ~24h, et il faudrait recopier à la main les règles de disponibilité d'Openings.
- **API Google `freebusy` + OAuth** — écartée : ne couvre pas iCloud, ajoute de l'OAuth, et duplique les règles.
- **Scraper la page HTML d'Openings** — écartée : aussi fragile que l'API privée mais sans JSON propre.
- **API privée `/availability`** — retenue : une seule requête, JSON structuré, busy-aware, multi-agendas, aucun secret.

## Consequences

- **CORS** : l'API n'autorise que l'origine `https://fantastical.app`. Un fetch navigateur direct est bloqué → l'appel **doit** transiter par une Netlify Function proxy (server-to-server), comme `notify-call.mts`.
- **Aucun contrat de stabilité** : API interne, elle peut changer de forme ou disparaître sans préavis. Le design **dégrade vers rien** — si le fetch échoue, renvoie `[]`, ou change de forme, la ligne ne s'affiche pas. On ne montre **jamais** un créneau faux ni un message négatif.
- **Cache 5 min** côté Function pour protéger l'amont (rate-limit `Retry-After` exposé) sans afficher un créneau périmé au-delà de la fenêtre de préavis.
