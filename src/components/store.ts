import { writable, get } from 'svelte/store'

/**
 * setInteractive à 0 on enlève tout, à 1 on les met tous en interactif, à 2 on ne change rien
 */
interface InterfaceGlobalOptions {v?: string, z?: string, durationGlobal?: number, nbVues?: number, shuffle?: boolean, choice?: number, trans?: boolean, sound?: number, es?: string, title: string, presMode: string, setInteractive: string, isSolutionAccessible: boolean, isInteractiveFree: boolean }

/**
 * listeExercices est un tableau d'objets décrivant l'exercice souhaité
 * {id, uuid, nbQuestions, alea, interactif, cd, sup, sup2, sup3, sup4, n}
 */
export const exercicesParams = writable([])

/**
 * globalOptions est utilisé dans Mathalea.updateUrl() et dans Mathalea.loadExercicesFromUrl()
 * Il permet de sauvegarder le type de vue (v=...)
 *
 * Le paramètre 'es' est utilisé pour renseigner les réglages de la vue élève :
 * une unique chaîne de caractères contient dans l'ordre : titre + mode présentation + interactivité +  accès solutions
 */
export const globalOptions = writable<InterfaceGlobalOptions>({ v: '', z: '1', title: 'Évaluation', presMode: 'page', setInteractive: '2', isSolutionAccessible: true, isInteractiveFree: true })

// utilisé pour les aller-retours entre le composant Diaporam et le composant Can
export const questionsOrder = writable({ isQuestionsShuffled: false, indexes: [] })
export const selectedExercises = writable({ isActive: false, indexes: [], count: 1 })
export const transitionsBetweenQuestions = writable({ isActive: true, isNoisy: false, tune: 0 })

// pour la gestion du mode sombre
export const darkMode = writable({ isActive: false })

// pour savoir si un exercice a été vérifié ou pas
export const exercicesCheckCount = writable(new Map())

// sauvegarde des résultats des exercices
export const resultsByExercice = writable([])

// export function changeExoStatus (idToFind: string, value: boolean) {
//   const listeExercices = get(exercicesCheckCount)
//   listeExercices.list.forEach((exo) => {

//   })
// }

/**
 *
 * @param liste
 * @param {number} iDepart
 * @param {number} iArrivee
 * @returns liste
 */
export function moveExercice (liste, iDepart, iArrivee) {
  liste.splice(iArrivee, 0, liste.splice(iDepart, 1)[0])
  return liste
}

let urlToWrite: URL
let timerId: number

/**
 * Complète l'URL courante avec les éléments relatifs au diaporama
 */
export function updateGlobalOptionsInURL (url) {
  const options = get(globalOptions)
  if (options.v) {
    url.searchParams.append('v', options.v)
  } else {
    url.searchParams.delete('v')
  }
  if (options.z && options.z !== '1') {
    url.searchParams.append('z', options.z)
  } else {
    url.searchParams.delete('z')
  }
  if (options.nbVues && options.nbVues > 1) {
    url.searchParams.append('nbVues', options.nbVues.toString())
  } else {
    url.searchParams.delete('nbVues')
  }
  if (options.durationGlobal) {
    url.searchParams.append('dGlobal', options.durationGlobal.toString())
  } else {
    url.searchParams.delete('dGlobal')
  }
  if (options.choice) {
    url.searchParams.append('choice', options.choice.toString())
  } else {
    url.searchParams.delete('choice')
  }
  if (options.shuffle) {
    url.searchParams.append('shuffle', options.shuffle ? '1' : '0')
  } else {
    url.searchParams.delete('shuffle')
  }
  if (options.trans) {
    url.searchParams.append('trans', options.trans ? '1' : '0')
  } else {
    url.searchParams.delete('trans')
  }
  if (typeof options.sound !== 'undefined') {
    url.searchParams.append('sound', options.sound.toString())
  } else {
    url.searchParams.delete('sound')
  }
  if (options.v === 'eleve') {
    if (typeof options.title !== 'undefined') {
      url.searchParams.append('title', options.title)
    } else {
      url.searchParams.delete('title')
    }
    if (typeof options !== 'undefined') {
      let es = getKeyByValue(presModeId, options.presMode)
      es += options.setInteractive
      es += options.isSolutionAccessible ? '1' : '0'
      es += options.isInteractiveFree ? '1' : '0'
      url.searchParams.append('es', es)
    }
  } else {
    url.searchParams.delete('title')
    url.searchParams.delete('es')
  }
  urlToWrite = url
  // On ne met à jour l'url qu'une fois toutes les 0,5 s
  // pour éviter l'erreur Attempt to use history.pushState() more than 100 times per 30 seconds
  if (timerId === undefined) {
    timerId = setTimeout(() => {
      window.history.pushState({}, '', urlToWrite)
      timerId = undefined
    }, 500)
  }
}

export const presModeId = {
  0: 'page',
  1: 'exos',
  2: 'liste',
  3: 'question'
}

function getKeyByValue (object, value) {
  return Object.keys(object).find(key => object[key] === value)
}
