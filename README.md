# RPG_POST_APO — Les Cendres du Monde

Campagne RPG narrative post-apocalyptique en Suisse romande, en 2043, onze ans après La Rupture. Narration immersive et détaillée, simulation exigeante, décisions et conséquences persistantes.

**État : fin du jour 19, novembre 2043. Après les villas J16–J18, Tugay rapporte un grand cerf avec l'équipe J19 ; premier fumoir communautaire essayé et résurgence souterraine découverte à ~5 min du refuge. Mode = narration continue, sans CI.**

## Architecture V2

| Répertoire | Contenu |
| --- | --- |
| `docs/` | Règles, protocole MJ et contrat de données |
| `canon/` | Monde établi, PNJ, lieux et factions connus |
| `personnage/` | Identité et capacités structurées, portrait biographique |
| `sauvegarde/` | État présent, inventaire et point de reprise |
| `journal/` | Historique des décisions, jets et chronologie |
| `recit/` | Index, chapitres et scènes vécues |
| `intrigues/` | Pistes, missions et objectifs |
| `scripts/` | Outils de validation locale des sauvegardes (sans CI) |
| `mj/` | Avertissement : aucune information secrète n'est à stocker dans un dépôt public |

### Sources maîtresses
- [ETAT.json](sauvegarde/ETAT.json) : phase, tour, date, lieu, environnement, progression.
- [PERSONNAGE.json](personnage/PERSONNAGE.json) : identité, attributs, compétences, santé et besoins.
- [INVENTAIRE.json](sauvegarde/INVENTAIRE.json) : objets, ressources et capacité de charge.
- [DECISIONS.jsonl](journal/DECISIONS.jsonl) : un choix validé par ligne, immuable.
- [JETS.jsonl](journal/JETS.jsonl) : jets réellement effectués.
- [INDEX.md](recit/INDEX.md) : chapitres et scènes, avec une fiche par scène.
- [POINT_DE_REPRISE.md](sauvegarde/POINT_DE_REPRISE.md) : **à lire en premier** en ouvrant une nouvelle conversation.

Les fichiers Markdown de personnage et d'inventaire renvoient aux JSON plutôt que de dupliquer les quantités.

### Règles et continuité
- [Règles de simulation](docs/REGLES.md)
- [Protocole de commits et reprise](docs/PROTOCOLE_MJ.md)
- [Schéma de données V2](docs/SCHEMA.md)
- [Chronologie](journal/CHRONOLOGIE.md)
- [Canon du monde](canon/MONDE.md), [PNJ](canon/PNJ.md), [lieux](canon/LIEUX.md), [factions](canon/FACTIONS.md)
- [Pistes](intrigues/PISTES.md)

## Reprendre la campagne
Avec l'accès GitHub connecté, envoyer :

> Reprends Les Cendres du Monde depuis Nighttug58/RPG_POST_APO. Lis le point de reprise, l'état, le personnage, l'inventaire, les règles, les dernières décisions et les scènes récentes, puis continue au dernier tour committé.

**NOUVEAU MODE : pas de tour par tour.** Le joueur peut donner des plans couvrant des actions simultanées ou des journées entières. Le MJ raconte en continu sans imposer des menus; commits aux jalons importants ou à la demande. Les 16 tours historiques restent conservés. Aucun travail différé promis.

## Vérification
Pour vérifier manuellement une sauvegarde, lancer `python3 scripts/valider_sauvegarde.py` (et éventuellement `node --check docs/dashboard.js`). **Aucune CI ni aucun workflow GitHub Actions n'est configuré dans ce dépôt.** La validation locale ne remplace pas le contrôle de cohérence du récit.

**Confidentialité :** le dépôt est public, donc les secrets du MJ seraient visibles. Les coulisses non révélées ne sont pas archivées ici. Il faudrait un dépôt privé distinct pour cela.

Création initiale : 3 novembre 2026. Migration V2 : sans avancer le temps fictif ni les décisions.

## Interface de visualisation

Les fichiers [`docs/index.html`](docs/index.html), [`docs/dashboard.js`](docs/dashboard.js) et [`docs/dashboard.css`](docs/dashboard.css) composent un **tableau de bord en lecture seule**. Le JavaScript charge les trois sauvegardes JSON publiques de la branche `main`, puis affiche les informations du protagoniste, les compétences, l'état physique, les consommables et l'équipement.

Pour l'ouvrir comme un site web, activer **Settings → Pages → Deploy from a branch → main → /docs → Save** (si GitHub Pages est disponible). Une fois déployé, l'adresse habituelle est `https://nighttug58.github.io/RPG_POST_APO/`. **Ne pas présumer que le site est actif tant qu'il n'a pas été vérifié.**

Depuis ChatGPT, demander **« Affiche ma fiche et mon inventaire »** : le MJ lit directement les JSON GitHub et présente un panneau dans le chat. Le navigateur GitHub Pages et la fiche du chat consultent les mêmes fichiers, mais **le JavaScript du dépôt ne s'exécute pas dans le chat**.

Voir [la procédure d'affichage](docs/AFFICHAGE_CHAT.md).

## Reprise actuelle
Voir [POINT_DE_REPRISE](sauvegarde/POINT_DE_REPRISE.md) et [INVENTAIRE](sauvegarde/INVENTAIRE.json). Fin J19 à 19 h 30 : Tugay a réussi une chasse solitaire la nuit J18–J19 et le groupe a ramené un gros cerf adulte, viande non pesée et fumoir utilisé pour premier essai seulement. Henri/Sophie construisent le fumoir à partir de pièces disponibles sans toucher aux roues du deuxième chariot. Kübra/Élise découvrent une résurgence souterraine à ~5 min à pied du refuge et rapportent ~30 L bruts. Eau traitée connue au refuge ~59 L et eau brute ~10 L, en plus d'un éventuel reliquat d'expédition inconnu ; pureté chimique non certifiée. Bois sec final inconnu. Dernier récit : [Chapitre 028](recit/chapitre-028/scene-001.md). Jour 20 à commencer.
