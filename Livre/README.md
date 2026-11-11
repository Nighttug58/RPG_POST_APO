# RUPTURE — Roman

**Projet :** adaptation littéraire de la campagne RPG_POST_APO.  
**Auteur et narrateur :** Tugay (récit à la première personne).  
**État au 11 novembre 2026 :** chapitres 1 à 43 présents ; chapitre 43 achevé en rédaction, au statut `brouillon`. Prochain chapitre à écrire : **44 — Le soleil des Vaeloriens**. L'achèvement ne vaut pas validation explicite par l'auteur.

## Format retenu

- **58 chapitres**, répartis en **10 parties**.
- **3 000 à 5 000 mots de récit par nouveau chapitre dès le chapitre 44** ; soit 45 000 à 75 000 mots pour les quinze chapitres restants. Recalculer le volume total à l'assemblage ; l'ancienne cible globale est caduque.
- Narration principalement en « je » de Tugay, y compris après sa réapparition ; exception motivée au chapitre 49, chronique incarnée à la troisième personne. Une brève coda externe est permise après la Rupture finale.
- La catastrophe initiale survient **en 2026** ; la reconstruction mène aux décennies suivantes.
- **Kübra est la seconde figure centrale** du roman et une actrice autonome des décisions.
- Le volet financier est simplifié : **PhenixCoin uniquement** ; aucune création de RuptureCoin.
- Cap de clôture : mystère des Ruptures expliqué, acquisition effective de l'ancrage autonome par les Vaeloriens, réapparition du couple, bouclier, guerre et révélation du correspondant futur. **Une nouvelle Rupture clôt le chapitre 58 ; le sort final des Vaeloriens demeure délibérément inconnu.**
- Les détails scientifiques Q-EUV sont des **lois propres à la fiction**, pas des affirmations sur la physique réelle.

## Fichiers éditoriaux

- [PLAN.md](PLAN.md) — sommaire commenté et développement des 58 chapitres.
- [DECISIONS_EDITORIALES.md](DECISIONS_EDITORIALES.md) — modifications demandées par Tugay et choix narratifs.
- [CONTINUITE.md](CONTINUITE.md) — bible des personnages et des faits, **avec spoilers**.
- [AUDIT_COHERENCE.md](AUDIT_COHERENCE.md) — contradictions, risques et contrôles obligatoires avant chaque chapitre.
- [CHRONOLOGIE_ROMAN.md](CHRONOLOGIE_ROMAN.md) — repères calendaires depuis 2026 ; adaptations par rapport au RPG initial.
- [SCIENCE_FICTION.md](SCIENCE_FICTION.md) — lois imaginaires Q-EUV, Genesis-S, permanence et Vaeloriens (**spoilers majeurs**).
- [FIN_REVISEE.md](FIN_REVISEE.md) — causalité et calendrier des révélations jusqu'à la Rupture finale (**spoilers absolus**).
- [PREPARATION_CHAPITRE_44.md](PREPARATION_CHAPITRE_44.md) — reprise exacte du chapitre 43, scènes prévues et limites des révélations.
- [chapitres/chapitre-43.md](chapitres/chapitre-43.md) — dernier chapitre achevé : **Le premier langage**.

## Longueur éditoriale

Décision du **11 novembre 2026** : du chapitre **44** à la fin, chaque chapitre contient **entre 3 000 et 5 000 mots de récit**, hors métadonnées YAML, titre et intertitres de datation. Cette fourchette remplace l'ancien minimum de 10 000 mots. Les chapitres 1 à 43 sont préservés : aucune réduction ni extension automatique pour les faire entrer dans la nouvelle règle.

Pour un comptage reproductible, retirer le bloc YAML initial et les lignes de titre, de datation et de séparation ; compter les unités contenant au moins une lettre ou un chiffre, séparées par des espaces. Une apostrophe ou un trait d'union interne ne scinde pas un mot ; un tiret de dialogue isolé ne compte pas. Annoncer le nombre effectivement vérifié avec le chapitre.

Chaque chapitre doit faire progresser l'intrigue par une découverte, une décision ou une conséquence durable. Privilégier les scènes complètes, les sensations et les dialogues naturels ; couper les débats répétés et les exposés qui remplacent l'aventure. Les grands climax disposent de plusieurs scènes et de conséquences vécues.

## Méthode de rédaction

À chaque demande **« next »**, effectuer le travail complet sans demander systématiquement une validation préalable :

1. Lire sur GitHub le dernier chapitre et vérifier l'état de `main` dans `Nighttug58/RPG_POST_APO` ; consulter plan, continuité, science-fiction, décisions, chronologie et audit.
2. Vérifier les révélations autorisées, le savoir des personnages et les enjeux affectifs ; suivre le dossier de préparation lorsqu'il existe.
3. Rédiger intégralement `Livre/chapitres/chapitre-XX.md`, avec métadonnées YAML et narration principalement à la première personne ; appliquer la fourchette de longueur.
4. Vérifier le nombre de mots de récit, les dates, les identités, les règles scientifiques, l'autonomie de Kübra et les conséquences des choix de Mira et Lina. Corriger les contradictions avant publication.
5. Actualiser les documents de planification et l'état de reprise si le chapitre change la direction prévue. Documenter toute correction indispensable du canon ; ne jamais la faire silencieusement.
6. Enregistrer directement sur **`main`**, via les outils GitHub disponibles, avec un commit explicite. Vérifier que le commit appartient à `main` et que le fichier est accessible avec le contenu attendu.
7. Fournir le lien GitHub du chapitre, son nombre de mots, un résumé concis et le titre du chapitre suivant. Si GitHub est inaccessible, le dire et fournir le texte intégral sans prétendre l'avoir commité.

Le statut **`validé`** reste réservé à une approbation explicite ; conserver **`brouillon`** n'empêche ni l'achèvement ni la continuation au prochain « next ». L'objectif est de **terminer ce livre en 58 chapitres**, sans prolongement indéfini ni annonce d'un tome suivant.

Les dossiers Livre et RPG sont distincts. **Ne pas retoucher les journaux historiques, sauvegardes, cartes ou données du site** pour répondre aux choix d'adaptation romanesque. Les fichiers du jeu documentent l'histoire telle qu'elle a été jouée ; Livre documente son adaptation.

## Sources et statut de l'adaptation

- Archives Git de la campagne : jusqu'au jour 91, avec journaux et scènes ; elles sont prioritaires pour les détails de la survie.
- Continuation dans les conversations : AURORE, reconstruction, Mira, PhenixCoin, ÉTERNITÉ, Vaeloriens et boucle ; elle n'est pas intégralement archivée dans le dépôt Git.
- **Modifications voulues pour le roman :** priorité aux décisions explicites consignées dans DECISIONS_EDITORIALES.md. **Liberté éditoriale accordée par Tugay :** ajuster, enrichir et parfois réordonner des événements quand cela sert la logique, la qualité et les personnages, en documentant les changements et en respectant les grandes étapes et la fin. Ne pas prétendre que ces changements ont déjà été vécus dans le RPG historique.

## Export futur

Une fois les chapitres écrits et validés, les fichiers Markdown numérotés pourront être assemblés en un livre PDF, EPUB ou DOCX. Ne pas inclure la bible, les documents de production ou les spoilers dans l'édition destinée aux lecteurs.
