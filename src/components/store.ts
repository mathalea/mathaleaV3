import { writable } from 'svelte/store'

/**
 * listeExercices est un tableau d'objets décrivant l'exercice souhaité
 * {id, uuid, nbQuestions, alea, interactif, cd, sup, sup2, sup3, sup4, n}
 */
export const exercicesParams = writable([])

/**
 * displayOptions est utilisé dans Mathalea.updateUrl() et dans Mathalea.loadExercicesFromUrl()
 * Il permet de sauvegarder le type de vue (v=...)
 */
export const displayOptions = writable({ v: '', z: '1' } as {v?: string, z?: string})

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
