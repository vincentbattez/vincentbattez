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

**Collègue**:
La personne invitée par lien direct à parler de Vincent. Ancien collaborateur, pas un prospect : elle ne vient pas acheter, elle vient témoigner.
_Avoid_: utilisateur, visiteur, user

**Ruby**:
La persona qui mène l'Entretien de recommandation face au Collègue. Chaleureuse, elle réclame des faits et se charge de la formulation.
_Avoid_: bot, assistant, IA, chatbot

**Entretien de recommandation**:
La conversation guidée, en cinq thèmes, entre un Collègue et Ruby. Bornée : elle a une fin, et cette fin est une Recommandation.
_Avoid_: chat, discussion, interview

**Recommandation**:
Le texte final rédigé par Ruby (~1000 caractères) à partir de l'Entretien, écrit à la première personne du Collègue et destiné à être copié tel quel sur LinkedIn ou dans un mail.
_Avoid_: témoignage, avis, review, feedback

**Dossier**:
Le corpus de faits sur Vincent (parcours, réalisations, anecdotes) fourni à Ruby pour orienter ses questions. Écrit pour briefer un intervieweur, pas pour être lu. Jamais montré au Collègue, jamais servi au navigateur.
_Avoid_: contexte, bio, prompt

**Valeurs**:
Les cinq traits que la Recommandation doit faire ressortir — qualité & rigueur, transmission, architecture & vision bout-en-bout, curiosité & IA, engagement & fiabilité. Ruby retient les trois que le Collègue a pu observer depuis son propre poste. Indépendantes du statut recherché (salariat ou freelance).
_Avoid_: soft skills, qualités, axes
