import { globalOptions } from '../store'
import { get } from 'svelte/store'
/**
   * Construit les éléments à ajouter à l'URL afin d'accéder à la vue élève
   * @returns {string} chaîne à ajouter
   * @author sylvain
   */
export function buildUrlAddendumForEsParam () {
  const options = get(globalOptions)
  const presentationMode = new Map([
    ['page', 0],
    ['exos', 1],
    ['liste', 2],
    ['question', 3]
  ])
  let addendum = '&v=eleve&title=' + options.title
  // Paramètre 'es' : presMode|setInteractive|isSolutionAccessible|isInteractiveFree
  addendum += '&es=' + presentationMode.get(options.presMode)
  addendum += options.setInteractive
  addendum += options.isSolutionAccessible ? '1' : '0'
  addendum += options.isInteractiveFree ? '1' : '0'
  return addendum
}
