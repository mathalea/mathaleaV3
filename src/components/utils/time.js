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

/**
 * Fabriquer une chaîne de caractères unique basée sur un time stamp.
 * @param {string} prefix Préfixe à ajouter devant la chaîne de caractères unique (vide par défaut)
 * @returns {string} La chaîne de caractère unique
 * @author sylvain
 */
export function getUniqueStringBasedOnTimeStamp (prefix = '') {
  const timeStamp = String(new Date().getTime())
  let unique = ''

  for (let i = 0; i < timeStamp.length; i += 2) {
    unique += Number(timeStamp.substring(i, 2)).toString(36)
  }
  return `${prefix}${unique}`
}
