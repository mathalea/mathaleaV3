import 'boxicons/css/boxicons.min.css'
import './app.css'
import App from './components/App.svelte'
import { exercicesParams, globalOptions } from './components/store'
import type { InterfaceGlobalOptions, InterfaceParams } from './lib/types'

type ScoreCallback = () => { score: number, contenu: object }

interface LoaderParams {
  container: HTMLElement,
  scoreCallback?: ScoreCallback
  exerciceParams?: InterfaceParams[]
  globalOptions?: InterfaceGlobalOptions
}

export default function mathaleaLoader (loaderParam: LoaderParams) {
  if (loaderParam.globalOptions !== undefined) {
    globalOptions.set(loaderParam.globalOptions)
  }
  if (loaderParam.exerciceParams !== undefined) {
    exercicesParams.set(loaderParam.exerciceParams)
  }
  // eslint-disable-next-line no-unused-vars
  const app = new App({
    target: loaderParam.container
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
