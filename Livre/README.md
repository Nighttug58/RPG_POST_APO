# RUPTURE — Roman

**Auteur / protagoniste : Tugay**  
**Projet d'origine :** `RPG_POST_APO` — *Les Cendres du Monde*  
**État :** plan éditorial établi ; rédaction progressive, chapitre par chapitre.

## Ambition

Transformer l'aventure jouée en **roman de science-fiction post-apocalyptique complet**, pas en journal de partie, compte rendu de jeu ni transcription des réponses du MJ.

- **42 chapitres**, organisés en **7 parties**.
- **Objectif indicatif :** 90 000 à 110 000 mots, soit environ 300–400 pages selon la maquette.
- **Narrateur :** Tugay, première personne du singulier, narration au passé.
- **Progression :** survie âpre et intime → communauté → secrets / diplomatie → renaissance → prospérité → science-fiction → boucle temporelle.
- **Révélation finale :** ne pas annoncer la boucle temporelle au lecteur avant les derniers chapitres.
- **Unité :** une voix littéraire cohérente, des scènes dialoguées, des enjeux concrets et des conséquences, sans résumer des décennies en quelques lignes.

## Organisation des fichiers

- [PLAN.md](PLAN.md) — sommaire commenté des 42 chapitres.
- [CONTINUITE.md](CONTINUITE.md) — bible des personnages, faits importants, divergences chronologiques et méthode d'adaptation (**contient des spoilers**).
- `chapitres/chapitre-01.md`, puis `chapitre-02.md`, etc. — un fichier Markdown autonome par chapitre.

Le sous-répertoire `Livre/` est **indépendant** de `recit/`, `journal/`, `canon/`, des inventaires et du site GitHub Pages. Ne pas modifier les sauvegardes du RPG pour corriger la prose du roman.

## Travail chapitre par chapitre

1. Lire le plan, la continuité et les sources du chapitre.
2. Écrire un premier brouillon littéraire dans `Livre/chapitres/chapitre-NN.md`.
3. **Un commit identifiable par chapitre**, sans modifier les chapitres suivants.
4. Recueillir les demandes éditoriales de Tugay (style, longueur, faits, rythme).
5. Réviser le même fichier dans de nouveaux commits traçables.
6. Marquer `statut: valide` uniquement après accord explicite ; par défaut, `brouillon`.

Les métadonnées YAML en tête de chapitre permettent l'assemblage ultérieur (Pandoc, autres outils Markdown). Les résumés, notes et indications de fabrication doivent rester **hors du corps romanesque**.

## Sources et fidélité

**Sources archivées prioritaires :** `recit/`, `journal_journalier/`, `journal/`, `canon/` (jusqu'à J91 actuellement).  
**Suite du récit :** conversation RPG ultérieure (J92 et après, jusqu'à l'épilogue cosmique), non entièrement sauvegardée dans Git au moment de ce premier commit.

Les descriptions, dialogues, gestes, enchaînements et états d'âme peuvent être romancés, mais **les décisions, rencontres, découvertes, relations et événements établis doivent rester reconnaissables**. Ne pas confondre une rumeur, une hypothèse ou un témoignage avec un fait confirmé.

**Point éditorial à résoudre :** les archives Git situent la campagne en **2043–2044**, tandis que des épisodes de la conversation ultérieure ont été racontés avec des dates de **2027–2082**. Les chronologies ne sont pas compatibles telles quelles. Avant de dater précisément les chapitres tardifs, choisir une convention globale avec Tugay ; ne pas déplacer silencieusement les événements ni inventer une explication diégétique. Le chapitre 1 évite les dates absolues dans la prose.

## Assemblage futur

L'ordre des chapitres est donné par leur nom `chapitre-01.md` → `chapitre-42.md`. Les titres et métadonnées faciliteront la conversion en PDF, EPUB ou DOCX lorsqu'une version du roman sera stabilisée. Aucune génération d'un livre final n'est implicite dans les commits de préparation.
