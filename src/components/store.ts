import { writable, get } from 'svelte/store'
import type { InterfaceGlobalOptions, InterfaceParams, InterfaceResultExercice } from '../lib/types'

/**
 * Pour bloquer la mise à jour de l'url
 */
export const freezeUrl = writable<Boolean>(false)

/**
 * exercicesParams est un tableau d'objets décrivant les exercices
 * {id, uuid, alea, interactif, cd, sup, sup2, sup3, sup4, n}
 */
export const exercicesParams = writable<InterfaceParams[]>([])

/**
 * * v: vue
 * * z: zoom
 * * title : titre pour la vue élève uniquement
 * * presMode : type d'affichage pour la vue eleve uniquement (page, exos, liste, questions)
 * * setInteractive : uniquement pour la vue eleve (0 : pas d'interactivité, 1 : tout interactif, 2 : au choix exercice par exercice)
 * * isSolutionAccessible : uniquement pour la vue eleve, pour savoir si les corrections sont disponibles ou pas
 * * isInteractiveFree : uniquement pour la vue eleve, pour savoir si l'élève peut changer l'interactivité ou pas
 * globalOptions est utilisé dans Mathalea.updateUrl() et dans Mathalea.loadExercicesFromUrl()
 * Il permet de sauvegarder le type de vue (v=...)
 *
 * Le paramètre 'es' est utilisé pour renseigner les réglages de la vue élève :
 * une unique chaîne de caractères contient dans l'ordre : titre + mode présentation + interactivité +  accès solutions
 */
export const globalOptions = writable<InterfaceGlobalOptions>({ v: '', z: '1', title: 'Évaluation', presMode: 'page', setInteractive: '2', isSolutionAccessible: true, isInteractiveFree: true})

// utilisé pour les aller-retours entre le composant Diaporam et le composant Can
export const questionsOrder = writable({ isQuestionsShuffled: false, indexes: [] })
export const selectedExercises = writable({ isActive: false, indexes: [], count: 1 })
interface InterfaceTransitionsBetweenQuestions {isActive: boolean, isNoisy: boolean, isQuestThenSolModeActive: boolean, questThenQuestAndSolDisplay: boolean, tune: '0'|'1'|'2'|'3' }
export const transitionsBetweenQuestions = writable<InterfaceTransitionsBetweenQuestions>({ isActive: true, isNoisy: false, isQuestThenSolModeActive: false, questThenQuestAndSolDisplay: false, tune: '0' })

// pour la gestion du mode sombre
export const darkMode = writable({ isActive: false })

// sauvegarde des résultats des exercices
export const resultsByExercice = writable<InterfaceResultExercice[]>([])

// vue Élève : détecter la nécessité d'un menu
export const isMenuNeededForExercises = writable<boolean>(false)
export const isMenuNeededForQuestions = writable<boolean>(false)
export const isSettingsMenuVisible = writable<boolean>(false)
export const isExportMenuVisible = writable<boolean>(false)

// pour garder trace du statut d'ouverture du menu de choix
export const isSideMenuVisible = writable<boolean>(true)

/**
 * Déplace un exercice dans exercicesParams
 */
export function moveExercice (liste: InterfaceParams[], iDepart: number, iArrivee: number): InterfaceParams[] {
  liste.splice(iArrivee, 0, liste.splice(iDepart, 1)[0])
  return liste
}

let urlToWrite: URL
let timerId: ReturnType<typeof setTimeout>

/**
 * Complète l'URL courante avec les éléments relatifs au diaporama
 */
export function updateGlobalOptionsInURL (url: URL) {
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
  if (options.recorder) {
    url.searchParams.append('recorder', options.recorder)
  } else {
    url.searchParams.delete('recorder')
  }
  if (options.done) {
    url.searchParams.append('done', options.done)
  } else {
    url.searchParams.delete('done')
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
    if (options.title.length > 0) {
      url.searchParams.append('title', options.title)
    } else {
      url.searchParams.delete('title')
    }
    if (options.iframe !== undefined) {
      url.searchParams.append('iframe', options.iframe)
    }
    if (options.answers !== undefined && JSON.stringify(options.answers).length > 0) {
      url.searchParams.append('answers', JSON.stringify(options.answers))
    }
    if (typeof options !== 'undefined') {
      let es = presModeId.indexOf(options.presMode).toString()
      es += options.setInteractive
      es += options.isSolutionAccessible ? '1' : '0'
      es += options.isInteractiveFree ? '1' : '0'
      url.searchParams.append('es', es)
    }
  } else {
    url.searchParams.delete('title')
    url.searchParams.delete('es')
  }
  const currentUrl = new URL(window.location.href)
  if (currentUrl.searchParams.has('triche')) {
    url.searchParams.append('triche', '1')
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

export const presModeId: ['page', 'exos', 'liste', 'questions'] = ['page', 'exos', 'liste', 'questions']
