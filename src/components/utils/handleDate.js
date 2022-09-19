export function isRecent (dateString) {
  if (dateString === undefined) return false
  const [jour, mois, annee] = dateString.split('/')
  const date = new Date(annee, mois - 1, jour)
  const elapsedTime = Date.now() - date
  const unMois = 3600 * 24 * 30 * 1000
  return (elapsedTime < unMois)
}
