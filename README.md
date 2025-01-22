# DevBlog

DevBlog est une plateforme de blogging dédiée aux développeurs et passionnés de technologie. Cette application web permet aux utilisateurs de partager leurs connaissances, expériences et découvertes dans le domaine des technologies. (encore en cours de developpement)

## Fonctionnalités implémentées

- Authentification des utilisateurs
- Publication d'articles
- Lecture d'articles
- Likes, commentaires, et partage d'articles
- Recherche d'articles
- Interface utilisateur moderne et responsive
- Protection des routes privées

## Technologies Utilisées

- Next.js 14 (App Router)
- React
- TypeScript
- NextAuth.js pour l'authentification
- Tailwind CSS pour le style
- Radix UI pour les composants
- React Server Components
- Zustand pour le state management

## Installation

1. Clonez le repository : `git clone https://github.com/RudelAv/chroniksfrontend.git`
2. Installez les dépendances : `npm install`
3. Configurez les variables d'environnement : 
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
ACCESS_TOKEN_SECRET=LA_CLE_SECRETE_POUR_LE_TOKEN_D_ACCES
```
NB: La clé secrète pour le token d'accès doit être la même que celle utilisée dans le serveur backend.
4. Démarrez le serveur de développement : `npm run dev`

## Utilisation
Pour pouvoir démarrer l'application, il faut démarrer le serveur backend de chroniks. vous pouvez cloner le repository [chroniksbackend](https://github.com/RudelAv/chroniksbackend.git) et suivre les instructions de son README.md.
Pour accéder à l'application, rendez-vous sur `http://localhost:3000`.


