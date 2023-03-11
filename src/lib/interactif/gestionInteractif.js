import { context } from '../../modules/context.js'
import { addElement, get, setStyles } from '../../modules/dom.js'
import { exerciceCliqueFigure } from '../../modules/interactif/cliqueFigure.js'
import { exerciceListeDeroulante } from '../../modules/interactif/questionListeDeroulante.js'
import { verifExerciceMathLive } from './questionMathLive.js'
import { exerciceQcm } from '../../modules/interactif/questionQcm.js'
import { isUserIdOk } from '../../modules/interactif/isUserIdOk.js'
import { gestionCan } from '../../modules/interactif/gestionCan.js'

export function exerciceInteractif (exercice, divScore, buttonScore) {
  if (exercice.interactifType === 'qcm')exerciceQcm(exercice)
  if (exercice.interactifType === 'listeDeroulante')exerciceListeDeroulante(exercice)
  if (exercice.interactifType === 'cliqueFigure')exerciceCliqueFigure(exercice)
  if (exercice.interactifType === 'custom') exerciceCustom(exercice)
  // Pour les exercices de type custom, on appelle la méthode correctionInteractive() définie dans l'exercice
  if (exercice.interactifType === 'mathLive') verifExerciceMathLive(exercice, divScore, buttonScore)
  if (exercice.interactifType === undefined) exerciceNonInteractif(exercice)
}

/**
 * Lorsque l'évènement 'exercicesAffiches' est lancé par mathalea.js
 * on vérifie la présence du bouton de validation d'id btnValidationEx{i} créé par listeQuestionsToContenu
 * et on y ajoute un listenner pour vérifier les réponses cochées
 * @param {Exercice} exercice
 */
export function exerciceCustom (exercice) {
  document.addEventListener('exercicesAffiches', () => {
    if (context.vue === 'can') {
      gestionCan(exercice)
    }
    const button = document.querySelector(`#btnValidationEx${exercice.numeroExercice}-${exercice.id}`)
    if (button) {
      if (!button.hasMathaleaListener) {
        button.addEventListener('click', event => {
          let nbBonnesReponses = 0
          let nbMauvaisesReponses = 0
          // Le get est non strict car on sait que l'élément n'existe pas à la première itération de l'exercice
          let eltFeedback = get(`feedbackEx${exercice.numeroExercice}`, false)
          // On ajoute le div pour le feedback
          if (!eltFeedback) {
            const eltExercice = get(`exercice${exercice.numeroExercice}`)
            eltFeedback = addElement(eltExercice, 'div', { id: `feedbackEx${exercice.numeroExercice}` })
          }
          setStyles(eltFeedback, 'marginBottom: 20px')
          if (eltFeedback) eltFeedback.innerHTML = ''
          // On utilise la correction définie dans l'exercice
          if (exercice.exoCustomResultat) {
            for (let i = 0; i < exercice.nbQuestions; i++) {
              exercice.correctionInteractive(i) === 'OK' ? nbBonnesReponses++ : nbMauvaisesReponses++
            }
            afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses)
          } else {
            for (let i = 0; i < exercice.nbQuestions; i++) {
              exercice.correctionInteractive(i) === 'OK' ? nbBonnesReponses++ : nbMauvaisesReponses++
            }
            afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses)
          }
          button.classList.add('disabled')
        })
        button.hasMathaleaListener = true
      }
    }
  })
}

/**
 * Lorsque l'évènement 'exercicesAffiches' est lancé par mathalea.js
 * on vérifie la présence du bouton de validation d'id btnValidationEx{i} créé par listeQuestionsToContenu
 * et on y ajoute un listenner pour vérifier les réponses saisies dans les math-field
 * Si le bouton n'existe pas on le crée
 * @param {Exercice} exercice
 */
export function exerciceNonInteractif (exercice) {
  document.addEventListener('exercicesAffiches', () => {
    if (context.vue === 'can') {
      gestionCan(exercice)
    }

    if (context.vue === 'eval') {
      // Si c'est un exo dnb, bac, e3c ou crpe  on affiche plutôt :
      // => l'image de l'énoncé avec une largeur de 70% du container
      // => l'image de la correction avec une largeur de 60% du container
      const myImgs = []
      const myImgsCor = []
      if (exercice.typeExercice === 'dnb' || exercice.typeExercice === 'bac' || exercice.typeExercice === 'e3c') {
        myImgs.push(document.querySelector(`#${exercice.id}`))
        if (!exercice.correctionIsCachee) myImgsCor.push(document.querySelector(`#${exercice.id}Cor`))
      }
      if (exercice.typeExercice === 'crpe') {
        for (let i = 1; i < exercice.png.length + 1; i++) {
          myImgs.push(document.querySelector(`#${exercice.id}-${i}`))
          if (!exercice.correctionIsCachee) myImgsCor.push(document.querySelector(`#${exercice.id}-${i}Cor`))
        }
      }
      for (const myImg of myImgs) {
        myImg.removeAttribute('width')
        myImg.style.width = '70%'
      }
      if (!exercice.correctionIsCachee) {
        for (const myImgCor of myImgsCor) {
          myImgCor.removeAttribute('width')
          myImgCor.style.width = '60%'
        }
      }

      const divAffichageExo = document.querySelector(`#exercice${exercice.numeroExercice}`)

      const button = document.querySelector(`#btnValidationEx${exercice.numeroExercice}-${exercice.id}`)
      button.innerHTML = "Voir la correction pour s'auto-corriger"
      button.style.margin = '1em'

      let divMsg = document.querySelector(`#msgExNonIteractif${exercice.numeroExercice}-${exercice.id}`)
      if (!divMsg) divMsg = addElement(divAffichageExo, 'div', { className: '', id: `msgExNonIteractif${exercice.numeroExercice}-${exercice.id}` })
      divMsg.innerHTML = 'Cet exercice n’est pas interactif, faites-le au brouillon avant de vous auto-corriger.'
      divMsg.style.color = '#f15929'
      divMsg.style.fontWeight = 'bold'
      divMsg.style.fontSize = 'x-large'
      divMsg.style.display = 'block'
      divMsg.style.margin = '1em'

      if (button) {
        if (!button.hasMathaleaListener) {
          button.addEventListener('click', event => {
            // Ici on met 1 bonne réponse dans tous les cas car les exos ne sont pas interactifs
            // Cela signifie que l'exo a été visualisé
            // À améliorer pour l'enregistrement dans le fichier de scores
            const nbBonnesReponses = 1
            const nbMauvaisesReponses = 0
            const besoinDe2eEssai = false
            if (!besoinDe2eEssai) {
              button.classList.add('disabled')
              afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses)
            }
          })
          button.hasMathaleaListener = true
        }
      }
    }
  })
}

export function afficheScore (exercice, nbBonnesReponses, nbMauvaisesReponses, divScore) {
  if (context.vue === 'exMoodle') {
    const hauteurExercice = window.document.querySelector('section').scrollHeight + 20
    if (!new URLSearchParams(window.location.search).get('moodleJson')) {
      const scoreRetenu = (score) => {
        const scoreAcceptes = [100, 90, 80, 75, 66.666, 60, 50, 40, 33.333, 30, 25, 20, 16.666, 14.2857, 12.5, 11.111, 10, 5, 0]
        return scoreAcceptes.reduce((prev, curr) => {
          return (Math.abs(curr - score) < Math.abs(prev - score) ? curr : prev)
        })
      }
      const score = scoreRetenu(nbBonnesReponses / (nbBonnesReponses + nbMauvaisesReponses) * 100)
      const reponses = {}
      try {
        for (let i = 0; i < exercice.autoCorrection.length; i++) {
          if (document.getElementById(`champTexteEx0Q${i}`)) {
            reponses[`reponse${i}`] = document.getElementById(`champTexteEx0Q${i}`).value
          }
          if (document.getElementById(`checkEx0Q${i}R0`)) {
            for (let j = 0; j < exercice.autoCorrection[i].propositions.length; j++) {
              if (document.getElementById(`checkEx0Q${i}R${j}`)) {
                reponses[`reponse${i}R${j}`] = document.getElementById(`checkEx0Q${i}R${j}`).checked
              }
            }
          }
        }
      } catch (error) {
        console.log('Réponse non sauvegardée')
      }
      window.parent.postMessage({ score, hauteurExercice, iMoodle: parseInt(new URLSearchParams(window.location.search).get('iMoodle')), reponses }, '*')
    } else {
      window.parent.postMessage({ hauteurExercice, iMoodle: parseInt(new URLSearchParams(window.location.search).get('iMoodle')) }, '*')
    }
  } else {
    // Envoie un message post avec le nombre de réponses correctes
    window.parent.postMessage({ url: window.location.href, graine: context.graine, titre: exercice.titre, nbBonnesReponses, nbMauvaisesReponses }, '*')
  }
  if (context.timer) {
    clearInterval(context.timer)
    // ToDo à sauvegarder dans les résultats
    // const tempsRestant = document.getElementById('timer').innerText
  }
  // Appel Fecth via une fonction est-ce que c'est ça qui multiplie les appels ?
  isUserIdOk(exercice, nbBonnesReponses, nbMauvaisesReponses)
  divScore.innerHTML = `${nbBonnesReponses} / ${nbBonnesReponses + nbMauvaisesReponses}`
  divScore.style.color = '#f15929'
  divScore.style.fontWeight = 'bold'
  divScore.style.fontSize = 'x-large'
  divScore.style.display = 'inline'
  // Si l'exercice n'est pas interactif on n'affiche pas la div pour le score
  if (exercice.interactifType === undefined) {
    divScore.style.display = 'none'
  }
  if (context.vue === 'eval') {
    const divCorr = get(`divexcorr${exercice.numeroExercice}`)
    divCorr.style.display = 'block'
    const divBoutonExercice = get(`btnEx${exercice.numeroExercice + 1}`)
    divBoutonExercice.classList.add('green')
    const divExercice = get(`exercice${exercice.numeroExercice}`)
    if (exercicesEvalRestants()[0]) {
      const btnExerciceSuivant = addElement(divExercice, 'button', { id: 'btnSuivant', class: 'ui blue button', style: 'display: block' }, 'Exercice suivant')
      btnExerciceSuivant.focus()
      if (!btnExerciceSuivant.hasMathaleaListener) {
        btnExerciceSuivant.addEventListener('click', () => {
          exercicesEvalRestants()[0].click()
        })
        btnExerciceSuivant.hasMathaleaListener = true
      }
    }
  }
}

const exercicesEvalRestants = () => document.querySelectorAll('[id ^= "btnEx"].circular.ui.button:not(.green):not(.red)')
