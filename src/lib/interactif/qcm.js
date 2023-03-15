import { get } from '../../modules/dom'
import { messageFeedback } from '../../modules/messages'
export function verifQuestionQcm (exercice, i) {
  let resultat
  const monRouge = 'rgba(217, 30, 24, 0.5)'
  const monVert = 'rgba(123, 239, 178, 0.5)'
  // i est l'indice de la question
  let nbBonnesReponses = 0
  let nbMauvaisesReponses = 0
  let nbBonnesReponsesAttendues = 0
  let indiceFeedback
  // Compte le nombre de réponses justes attendues
  for (let k = 0; k < exercice.autoCorrection[i].propositions.length; k++) {
    if (exercice.autoCorrection[i].propositions[k].statut) { nbBonnesReponsesAttendues++ }
  }
  const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${i}`)
  let aucuneMauvaiseReponseDonnee = true
  exercice.autoCorrection[i].propositions.forEach((proposition, indice) => {
    const label = document.querySelector(`#labelEx${exercice.numeroExercice}Q${i}R${indice}`)
    const check = document.querySelector(`#checkEx${exercice.numeroExercice}Q${i}R${indice}`)
    if (proposition.statut) {
      if (check.checked) {
        nbBonnesReponses++
        if (aucuneMauvaiseReponseDonnee) {
          indiceFeedback = indice
          label.style.backgroundColor = monVert
        }
      } else { // Bonnes réponses non cochées
        label.style.backgroundColor = monVert
      }
    } else if (check.checked === true) {
      label.style.backgroundColor = monRouge
      nbMauvaisesReponses++
      indiceFeedback = indice
      aucuneMauvaiseReponseDonnee = false
    }
  })
  let typeFeedback = 'positive'
  if (nbMauvaisesReponses === 0 && nbBonnesReponses === nbBonnesReponsesAttendues) {
    spanReponseLigne.innerHTML = '😎'
    resultat = 'OK'
  } else {
    spanReponseLigne.innerHTML = '☹️'
    typeFeedback = 'error'
    resultat = 'KO'
  }
  spanReponseLigne.style.fontSize = 'large'
  if (indiceFeedback > -1 && exercice.autoCorrection[i].propositions[indiceFeedback].feedback) {
    const eltFeedback = get(`feedbackEx${exercice.numeroExercice}Q${i}`, false)
    if (eltFeedback) { eltFeedback.innerHTML = '' }
    // Message par défaut qui est celui de la dernière réponse cochée
    let message = exercice.autoCorrection[i].propositions[indiceFeedback].feedback
    if (resultat === 'KO') {
      // Juste mais incomplet
      if (nbBonnesReponses > 0 && nbBonnesReponses < nbBonnesReponsesAttendues) {
        message = `${nbBonnesReponses} bonne${nbBonnesReponses > 1 ? 's' : ''} réponse${nbBonnesReponses > 1 ? 's' : ''} mais c'est incomplet.`
      }
      // Du juste et du faux
      if (nbBonnesReponses > 0 && nbMauvaisesReponses > 0) {
        message = `${nbMauvaisesReponses} erreur${nbMauvaisesReponses > 1 ? 's' : ''}`
      }
    }
    messageFeedback({
      id: `feedbackEx${exercice.numeroExercice}Q${i}`,
      message,
      type: typeFeedback
    })
  }
  return resultat
}
