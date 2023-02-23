/**
   * Retourne une chaîne formattée pour afficher une durée en (XXh XXmin XXs)
   * @param {number} nbOfSeconds durée en secondes
   * @return {string} durée en h min s
   */
export function formattedTimeStamp (nbOfSeconds) {
  const nbOfHours = Math.floor(nbOfSeconds / 3600)
  const nbOfMinutes = Math.floor((nbOfSeconds - nbOfHours * 3600) / 60)
  const nbOfSecondsLeft = nbOfSeconds - nbOfHours * 3600 - nbOfMinutes * 60
  if (nbOfHours > 0) {
    return `${nbOfHours}h ${nbOfMinutes}min ${nbOfSecondsLeft}s`
  } else {
    if (nbOfMinutes > 0) {
      if (nbOfSecondsLeft === 0) {
        return `${nbOfMinutes}min`
      } else {
        return `${nbOfMinutes}min ${nbOfSecondsLeft}s`
      }
    } else {
      return `${nbOfSecondsLeft}s`
    }
  }
}

/**
   * Gestion du message dans le modal de réglage de la durée de projection
   * @param duree valeur de la durée en secondes retournée par le curseur
   */
export function setPhraseDuree (duree) {
  if (duree >= 2) return duree + ' secondes'
  else if (duree === 0) return 'Défilement manuel'
  else return duree + ' seconde'
}
