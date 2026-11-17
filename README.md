# Gestionnaire de tâches

Application web de gestion de tâches réalisée en binôme, en **HTML, CSS et JavaScript pur** (sans framework, sans classe).

## Fonctionnalités

| Réf. | Fonctionnalité |
|------|----------------|
| R1 | Formulaire (titre, description, statut) pour ajouter une tâche. Le titre est obligatoire. |
| R2 | Les tâches s'affichent en cartes générées en JavaScript, avec une couleur et un badge par statut. |
| R3 | Modification d'une tâche (titre, description, statut) via le formulaire. |
| R4 | Suppression d'une tâche (avec confirmation). |
| R5 | Filtre par statut : toutes, à faire, en cours, terminées, bloquées. |
| R6 | Recherche dans le titre et la description. |
| R7 | Sauvegarde dans `localStorage` et rechargement à l'ouverture. |

Validation : un titre vide ou un statut invalide est refusé avec un message clair. Quand aucune tâche n'est affichée, un message l'indique.

### Couleurs des statuts

| Statut | Couleur |
|--------|---------|
| À faire | Bleu |
| En cours | Orange |
| Terminée | Vert |
| Bloquée | Rouge |

## Lancer le projet

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/mangonte72-dotcom/gestionnaire-taches.git
   ```
2. Ouvrir le dossier dans VS Code.
3. Ouvrir `index.html` dans un navigateur (double-clic), ou utiliser l'extension **Live Server** (clic droit sur `index.html` → *Open with Live Server*).

Aucune installation n'est nécessaire.

## Structure

```
gestionnaire-taches/
├── index.html      # Structure de la page, formulaire, filtre, recherche
├── css/
│   └── style.css   # Mise en forme, couleurs des statuts, responsive
├── js/
│   └── app.js      # Données, CRUD, filtre, recherche, affichage, localStorage
└── README.md
```

## Modèle de données

Une tâche est un objet JavaScript rangé dans le tableau `tasks` :

```js
{
	id: "lx3k9a2b1c",            // identifiant unique
	titre: "Préparer la démo",
	description: "Slides + scénario",
	statut: "en-cours",          // a-faire | en-cours | terminee | bloquee
	date: "2026-11-17T09:30:00.000Z"
}
```

## Organisation du binôme

| Rôle | Travail | Branche |
|------|---------|---------|
| Apprenant A | Structure HTML, mise en forme CSS, intégration de l'interface | `apprenant-a` |
| Apprenant B | Tableau de tâches, fonctions JavaScript, événements, CRUD, localStorage | `apprenant-b` |
| Ensemble | Filtres, recherche, tests, corrections, validation finale | — |

### Workflow Git

1. Création du dépôt et d'une branche par personne.
2. Chacun développe sur sa branche et fait des commits explicites.
3. Chacun ouvre une Pull Request vers `main`, relue par l'autre membre du binôme.
4. Fusion dans `main` après validation.

## Tests réalisés

- Ajout d'une tâche avec et sans titre (message d'erreur si vide).
- Modification puis annulation d'une modification.
- Suppression d'une tâche.
- Filtre sur chaque statut et recherche (titre, description, majuscules/minuscules).
- Rechargement de la page : les tâches sont conservées.
- Message affiché quand la liste est vide ou qu'aucun résultat ne correspond.

## Notions JavaScript utilisées

- Tableaux d'objets : `push`, `filter`, `find`, `map`
- DOM : `createElement`, `textContent`, `addEventListener`
- `classList` et `event.preventDefault()`
- `localStorage` avec `JSON.stringify` et `JSON.parse`
