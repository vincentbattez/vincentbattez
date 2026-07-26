# vincentbattez.dev

Portfolio statique (Nuxt SSG, Netlify) présentant Vincent Battez, développeur full-stack freelance, et facilitant la prise de contact.

## Language

**Créneau**:
Une plage horaire réservable pour un rendez-vous, exprimée par un début et une fin (ex. lundi 12h30–13h00). L'API amont les nomme _slots_.
_Avoid_: slot, disponibilité, plage

**Prochain créneau**:
Le premier Créneau libre à venir, tous agendas confondus, dans la fenêtre réservable. C'est ce qui s'affiche sous le bouton « Consulter mes disponibilités ».
_Avoid_: next slot

**Openings**:
La fonction de prise de rendez-vous de Fantastical (Flexibits) qui agrège tous les agendas de Vincent (iCloud + Google) et expose une page de réservation publique.
_Avoid_: Calendly, scheduling

**Engagement**:
Un type de rendez-vous réservable dans Openings, avec ses propres règles (durée, plage horaire, préavis). Ici : l'« Entretien freelance », identifié par un slug (`entretien`) et un uuid.
_Avoid_: meeting type, event type

**Fenêtre réservable**:
L'horizon pendant lequel un Créneau peut être proposé — 15 jours à l'avance (`bookahead`), à partir d'un préavis minimal de 15 minutes (`lead_time`).
_Avoid_: bookahead, horizon
