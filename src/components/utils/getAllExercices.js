/**
     * Retourne tous les objets qui ont une clé titre
     */
export function getAllExercices (referentiel) {
  const exercices = []
  function recursiveSearch (object) {
    Object.keys(object).forEach((key) => {
      const value = object[key]
      if (key === 'titre' && typeof value !== 'object') {
        exercices.push(object)
      } else if (typeof value === 'object') {
        recursiveSearch(value)
      }
    })
  }
  recursiveSearch(referentiel)
  return exercices
}
