import { globalOptions } from '../store'

/**
   * Gérer le changement d'affichage (quel composant remplace l'autre dans App.svelte)
   * @param {string} oldComponent composant à changer
   * @param {string} newComponent composant à afficher
   * @author sylvain
   */
export function handleComponentChange (oldComponent, newComponent) {
  const oldPart = '&v=' + oldComponent
  const newPart = newComponent === '' ? '' : '&v=' + newComponent
  const urlString = window.location.href.replace(oldPart, newPart)
  window.history.pushState(null, '', urlString)
  globalOptions.update((l) => {
    l.v = newComponent
    return l
  })
}
