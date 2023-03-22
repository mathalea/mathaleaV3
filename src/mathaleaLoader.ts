import 'boxicons/css/boxicons.min.css'
import './app.css'
import App from './components/App.svelte'
import { exercicesParams, globalOptions } from './components/store'
import type { InterfaceLoaderParams } from './lib/types'

export default function mathaleaLoader (loaderParams: InterfaceLoaderParams) {
  if (loaderParams.globalOptions !== undefined) {
    globalOptions.set(loaderParams.globalOptions)
  }
  if (loaderParams.exercicesParams !== undefined) {
    exercicesParams.set(loaderParams.exercicesParams)
  }
  // eslint-disable-next-line no-unused-vars
  const app = new App({
    target: loaderParams.container
  })

  // scoreCallback ():  // score est un number entre 0 et 1
  // https://bibliotheque.sesamath.net/doc/modules/sesatheque-client/Resultat.html
  // reponse?: string à éviter
  // score: number (entre 0 et 1)
  // contenu?: object (je choisis mes spécificités, pour l'instant pas utilisé mais dans le futur pour repérer les exercices classiques,
  // les réponses de l'élève, le nombre d'essais, avec ou sans aide, avec ou sans calculatrice) sera traité ensuite dans afficheur de résultats (à voir plus tard)
  // Faire un formateur de résultat dans le plugin
  // Je peux renvoyer contenu
}
