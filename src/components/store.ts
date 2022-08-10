import { writable } from 'svelte/store'

export const listeExercices = writable([])

// displayOptions est utilisé dans Mathalea.updateUrl() et dans Mathalea.loadExercicesFromUrl()
export const displayOptions = writable({})

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
