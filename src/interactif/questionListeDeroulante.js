import { context } from '../modules/context'
import { addElement, get, setStyles } from '../modules/dom'

export function verifQuestionListeDeroulante (exercice/** Exercice */, i/** number */) {
  // Le get est non strict car on sait que l'élément n'existe pas à la première itération de l'exercice
  let eltFeedback = get(`resultatCheckEx${exercice.numeroExercice}Q${i}`, false)
  // On ajoute le div pour le feedback
  if (!eltFeedback) {
    const eltExercice = (document.querySelector(`#exercice${exercice.numeroExercice}Q${i}`))
    if (eltExercice) eltFeedback = addElement(eltExercice, 'div', { id: `resultatCheckEx${exercice.numeroExercice}Q${i}` })
  }
  setStyles(eltFeedback, 'marginBottom: 20px')
  if (eltFeedback) eltFeedback.innerHTML = ''
  let resultat
  const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${i}`)
  const optionsChoisies = document.querySelectorAll(`#ex${exercice.numeroExercice}Q${i}`)
  let reponses = []
  if (!Array.isArray(exercice.autoCorrection[i].reponse.valeur)) {
    reponses = [exercice.autoCorrection[i].reponse.valeur]
  } else {
    reponses = exercice.autoCorrection[i].reponse.valeur
  }
  let saisie = []
  for (const option of optionsChoisies) {
    saisie.push(option.value)
  }
  saisie = saisie.join('-')
  for (const reponse of reponses) {
    // Pour les exercices où on associe plusieurs liste déroulantes, la réponse est un tableau (cf 6N43-4)
    // On concatène les saisies et les réponses pour les comparer
    if (Array.isArray(reponse)) {
      if (reponse.join('-') === saisie) {
        resultat = 'OK'
        spanReponseLigne.innerHTML = '😎'
      }
    } else {
      // Pour les exercices classiques, on compare directement
      if (reponse === saisie) {
        resultat = 'OK'
        spanReponseLigne.innerHTML = '😎'
      }
    }
  }
  if (resultat !== 'OK') {
    spanReponseLigne.innerHTML = '☹️'
    resultat = 'KO'
  }
  spanReponseLigne.style.fontSize = 'large'
  return resultat
}
/**
 *
 * @param {object} exercice l'exercice appelant pour pouvoir atteindre ses propriétés.
 * @param {number} i le numéro de la question
 * @param {number} c le numéro de la liste pour un exercice en comportant plusieurs afin de permettre des test d'association
 * @param {array} choix Les différentes propositions de la liste
 * @param {string} type 'nombre' si les choix sont des nombres à choisir, sinon on demande une 'réponse'
 * @author Rémi Angot
 * @returns {string} le code html de la liste
 */
export const choixDeroulant = (exercice, i, c, choix, type = 'nombre') => {
  if (!exercice.interactif || !context.isHtml) return ''
  let result = `<select class="ui fluid dropdown ex${exercice.numeroExercice}" id="ex${exercice.numeroExercice}Q${i}" data-choix="${c}">
      <option> Choisir ${type === 'nombre' ? 'un nombre' : 'une réponse'} </option>`
  for (const a of choix) {
    result += `<option>${a}</option>`
  }
  result += '</select>'
  return result
}
