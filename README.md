# RPG_POST_APO — Les Cendres du Monde

Campagne RPG narrative post-apocalyptique en Suisse romande, en 2043, onze ans après La Rupture. Narration immersive et détaillée, simulation exigeante, décisions et conséquences persistantes.

**État : tour 0 — création du personnage non commencée, aucun passé sélectionné.**

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
| `scripts/` et `.github/workflows/` | Contrôles automatiques des sauvegardes |
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

**Un choix de jeu validé = un commit** nommé `jeu(tour-XXXX): ...`. Une intervention hors-jeu ne change pas le tour. Le MJ ne promet jamais de commits en arrière-plan et signale explicitement tout échec GitHub.

## Vérification
Lancer `python3 scripts/valider_sauvegarde.py`. Un workflow GitHub Actions vérifie automatiquement le dépôt après les modifications. La validation structurelle ne remplace pas le contrôle de cohérence du récit.

**Confidentialité :** le dépôt est public, donc les secrets du MJ seraient visibles. Les coulisses non révélées ne sont pas archivées ici. Il faudrait un dépôt privé distinct pour cela.

Création initiale : 3 novembre 2026. Migration V2 : sans avancer le temps fictif ni les décisions.
