# MathALÉA

MathALÉA est un générateur d'exercices de mathématiques qui suit le programme actuel de mathématiques en France.

Il propose plusieurs utilisations possibles : 

* Affichage des exercices dans le navigateur
* Export LaTeX des énoncés des exercices
* Création de liens personnalisés à destination des élèves
* Exercices avec ou sans interactivité
* Affichage des questions en mode diaporama
* ...

Le moteur développé par Rémi Angot depuis 2018 connait un développement régulier grâce à une communauté de professeurs de mathématiques en exercice qui améliorent l'interface et proposent toujours de nouveaux exercices.


## Utilisation en local

La dernière version est disponible sur https://coopmaths.fr/alea.

Vous pouvez récupérer une copie du dépot et l'utiliser en local. Pour cela, vous aurez besoin d'une version récente de NodeJS afin d'exécuter les commandes suivantes.

De notre côté, on utilise pnpm, mais vous pouvez le remplacer par npm.

```
npm install
npm start
```

## Utilisation depuis un site extérieur

MathALÉA a été développé comme une librairie. Vous pouvez importer coopmaths.fr/alea/mathaleaLoader.js.

Exemple d'utilisation : 

```js
import mathaleaLoader from 'https://coopmaths.fr/alea/mathaleaLoader'
const app = document.getElementById('app')
const loaderParams: InterfaceLoaderParams = {
  container: app
  globalOptions: { v: 'eleve' },
  exercicesParams: [{ uuid: 'b72b0', nbQuestions: 4 }]
}
mathaleaLoader(loaderParams)
```

Cela permet d'intégrer la vue `eleve` de MathALÉA dans l'élément `app` avec l'exercice qui a pour uuid `b72b0`.






