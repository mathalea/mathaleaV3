import { writable, get } from 'svelte/store'

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
export const globalOptions = writable({ v: '', z: '1' } as {v?: string, z?: string, durationGlobal?: number, nbVues?: number, shuffle?: boolean, choice?: number, trans?: boolean, sound?: number, es?: string})

// utilisé pour les aller-retours entre le composant Diaporam et le composant Can
export const questionsOrder = writable({ isQuestionsShuffled: false, indexes: [] })
export const selectedExercises = writable({ isActive: false, indexes: [], count: 1 })
export const transitionsBetweenQuestions = writable({ isActive: true, isNoisy: false, tune: 0 })
export const eleveVueSetUp = writable({ title: 'Évaluation', presMode: 'page', isInteractive: false, isSolutionAccessible: true } as {title: string, presMode: string, isInteractive: boolean, isSolutionAccessible: boolean})

// pour la gestion du mode sombre
export const darkMode = writable({ isActive: false })

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

/**
 * Complète l'URL courante avec les éléments relatifs au diaporama
 */
export function updateGlobalOptionsInURL () {
  const options = get(globalOptions)
  const url = new URL(window.location.href)
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
  if (options.nbVues && parseInt(options.nbVues) > 1) {
    url.searchParams.append('nbVues', options.nbVues)
  } else {
    url.searchParams.delete('nbVues')
  }
  if (options.durationGlobal) {
    url.searchParams.append('dGlobal', options.durationGlobal)
  } else {
    url.searchParams.delete('dGlobal')
  }
  if (options.choice) {
    url.searchParams.append('choice', options.choice)
  } else {
    url.searchParams.delete('choice')
  }
  if (options.shuffle) {
    url.searchParams.append('shuffle', options.shuffle)
  } else {
    url.searchParams.delete('shuffle')
  }
  if (options.trans) {
    url.searchParams.append('trans', options.trans)
  } else {
    url.searchParams.delete('trans')
  }
  if (typeof options.sound !== 'undefined') {
    url.searchParams.append('sound', options.sound)
  } else {
    url.searchParams.delete('sound')
  }
  if (typeof options.es !== 'undefined') {
    url.searchParams.append('es', options.es)
  } else {
    url.searchParams.delete('es')
  }
  window.history.pushState({}, '', url)
}
