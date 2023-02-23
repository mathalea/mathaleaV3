/**
   * Afficher un écran (élément <dialog>) pendant un nombre de millisecondes
   * @param {string} dialogId id de l'élément <dialog> à activer
   * @param {number} nbOfMilliseconds durée de l'affichage en ms
   */
export async function showDialogForLimitedTime (dialogId, nbOfMilliseconds) {
  const dialog = document.getElementById(dialogId)
  if (dialog) {
    dialog.showModal()
    await sleep(nbOfMilliseconds)
    dialog.close()
  }
}

/**
   * Faire une pause pendant l'exécution d'un programme
   * {@link https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep?page=1&tab=scoredesc#tab-top | Source}
   * @param {number} ms nb de millisecondes de la pause
   * @author sylvain
   */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
