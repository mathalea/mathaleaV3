import { writable, get } from 'svelte/store'

/**
 * listeExercices est un tableau d'objets décrivant l'exercice souhaité
 * {id, uuid, nbQuestions, alea, interactif, cd, sup, sup2, sup3, sup4, n}
 */
export const exercicesParams = writable([])

/**
 * globalOptions est utilisé dans Mathalea.updateUrl() et dans Mathalea.loadExercicesFromUrl()
 * Il permet de sauvegarder le type de vue (v=...)
 */
export const globalOptions = writable({ v: '', z: '1' } as {v?: string, z?: string, durationGlobal?: number, nbVues?: number, shuffle?: boolean, choice?: number})

export const questionsOrder = writable({ isQuestionsShuffled: false, indexes: [] })
export const selectedExercises = writable({ isActive: false, indexes: [], count: 1 })
export const transitionsBetweenQuestions = writable({ isActive: true, isNoisy: false, tune: 0 })

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
  window.history.pushState({}, '', url)
}
