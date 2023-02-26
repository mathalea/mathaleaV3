import { addElement, get, setStyles } from '../modules/dom'
import { verifQuestionMathLive } from './mathLive'
import { verifQuestionQcm } from './qcm'
import { verifQuestionListeDeroulante } from './questionListeDeroulante'

export function exerciceInteractif (exercice /** Exercice */, divScore /** HTMLDivElement */, buttonScore /** HTMLButtonElement */) {
  if (exercice.interactifType === 'mathLive') return verifExerciceMathLive(exercice, divScore, buttonScore)
  if (exercice.interactifType === 'qcm') return verifExerciceQcm(exercice, divScore, buttonScore)
  if (exercice.interactifType === 'listeDeroulante') return verifExerciceListeDeroulante(exercice, divScore, buttonScore)
  if (exercice.interactifType === 'cliqueFigure') return verifExerciceCliqueFigure(exercice, divScore, buttonScore)
  // Pour les exercices de type custom, on appelle la méthode correctionInteractive() définie dans l'exercice
  if (exercice.interactifType === 'custom') return verifExerciceCustom(exercice, divScore, buttonScore)
  //  if (exercice.interactifType === undefined) exerciceNonInteractif(exercice)
  // Il faudra gérer ces exercices non interactifs qui pourraient apparaitre dans une évaluation
}

function verifExerciceMathLive (exercice /** Exercice */, divScore /** HTMLDivElement */, divButton /** HTMLButtonElement */) {
  let nbBonnesReponses = 0
  let nbMauvaisesReponses = 0
  const besoinDe2eEssai = false
  let resultat
  for (const i in exercice.autoCorrection) {
    resultat = verifQuestionMathLive(exercice, i)
    if (resultat === 'OK') {
      nbBonnesReponses++
    } else {
      nbMauvaisesReponses++ // Il reste à gérer le 2e essai
    }
  }
  if (!besoinDe2eEssai) {
    return afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses, divScore, divButton)
  }
}

function verifExerciceQcm (exercice /** Exercice */, divScore /** HTMLDivElement */, divButton /** HTMLButtonElement */) {
  // On vérifie le type si jamais il a été changé après la création du listenner (voir 5R20)
  let nbQuestionsValidees = 0
  let nbQuestionsNonValidees = 0
  for (let i = 0; i < exercice.autoCorrection.length; i++) {
    const resultat = verifQuestionQcm(exercice, i)
    resultat === 'OK' ? nbQuestionsValidees++ : nbQuestionsNonValidees++
  }
  const uichecks = document.querySelectorAll(`.ui.checkbox.ex${exercice.numeroExercice}`)
  uichecks.forEach(function (uicheck) {
    uicheck.classList.add('read-only')
  })
  return afficheScore(exercice, nbQuestionsValidees, nbQuestionsNonValidees, divScore, divButton)
}

function verifExerciceListeDeroulante (exercice /** Exercice */, divScore /** HTMLDivElement */, divButton /** HTMLButtonElement */) {
  let nbQuestionsValidees = 0
  let nbQuestionsNonValidees = 0
  const uiselects = document.querySelectorAll(`.ui.dropdown.ex${exercice.numeroExercice}`)
  uiselects.forEach(function (uiselect) {
    uiselect.classList.add('disabled')
  })
  for (let i = 0; i < exercice.nbQuestions; i++) {
    const resultat = verifQuestionListeDeroulante(exercice, i)
    resultat === 'OK' ? nbQuestionsValidees++ : nbQuestionsNonValidees++
  }
  return afficheScore(exercice, nbQuestionsValidees, nbQuestionsNonValidees, divScore, divButton)
}

function verifExerciceCustom (exercice /** Exercice */, divScore /** HTMLDivElement */, buttonScore /** HTMLButtonElement */) {
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
    afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses, divScore, buttonScore)
  } else {
    for (let i = 0; i < exercice.nbQuestions; i++) {
      exercice.correctionInteractive(i) === 'OK' ? nbBonnesReponses++ : nbMauvaisesReponses++
    }
    return afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses, divScore, buttonScore)
  }
}

export function prepareExerciceCliqueFigure (exercice /** Exercice */) {
  // Dès que l'exercice est affiché, on rajoute des listenners sur chaque éléments de this.figures.
  for (let i = 0; i < exercice.nbQuestions; i++) {
    for (const objetFigure of exercice.figures[i]) {
      const figSvg = document.getElementById(objetFigure.id)
      if (figSvg) {
        if (!figSvg.hasMathaleaListener) {
          figSvg.addEventListener('mouseover', mouseOverSvgEffect)
          figSvg.addEventListener('mouseout', mouseOutSvgEffect)
          figSvg.addEventListener('click', mouseSvgClick)
          figSvg.etat = false
          figSvg.style.margin = '10px'
          figSvg.hasMathaleaListener = true
          // On enregistre que l'élément a déjà un listenner pour ne pas lui remettre le même à l'appui sur "Nouvelles Données"
        }
      }
    }
  }
}
function verifExerciceCliqueFigure (exercice /** Exercice */, divScore /** HTMLDivElement */, buttonScore /** HTMLButtonElement */) {
  // Gestion de la correction
  let nbBonnesReponses = 0
  let nbMauvaisesReponses = 0
  for (let i = 0; i < exercice.nbQuestions; i++) {
    verifQuestionCliqueFigure(exercice, i) === 'OK' ? nbBonnesReponses++ : nbMauvaisesReponses++
  }
  return afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses, divScore, buttonScore)
}

function verifQuestionCliqueFigure (exercice, i) {
  // Le get est non strict car on sait que l'élément n'existe pas à la première itération de l'exercice
  let eltFeedback = get(`resultatCheckEx${exercice.numeroExercice}Q${i}`, false)
  // On ajoute le div pour le feedback
  if (!eltFeedback) {
    const eltExercice = get(`exercice${exercice.numeroExercice}`)
    eltFeedback = addElement(eltExercice, 'div', { id: `resultatCheckEx${exercice.numeroExercice}Q${i}` })
  }
  setStyles(eltFeedback, 'marginBottom: 20px')
  if (eltFeedback) eltFeedback.innerHTML = ''
  const figures = []
  let erreur = false // Aucune erreur détectée
  let nbFiguresCliquees = 0
  for (const objetFigure of exercice.figures[i]) {
    const eltFigure = document.getElementById(objetFigure.id)
    figures.push(eltFigure)
    eltFigure.removeEventListener('mouseover', mouseOverSvgEffect)
    eltFigure.removeEventListener('mouseout', mouseOutSvgEffect)
    eltFigure.removeEventListener('click', mouseSvgClick)
    eltFigure.hasMathaleaListener = false
    if (eltFigure.etat) nbFiguresCliquees++
    if (eltFigure.etat !== objetFigure.solution) erreur = true
  }
  if (nbFiguresCliquees > 0 && !erreur) {
    eltFeedback.innerHTML = '😎'
    return 'OK'
  } else {
    eltFeedback.innerHTML = '☹️'
    return 'KO'
  }
}

function mouseOverSvgEffect () {
  this.style.border = '1px solid #1DA962'
}
function mouseOutSvgEffect () {
  this.style.border = 'none'
}
function mouseSvgClick () {
  if (this.etat) {
    // Déja choisi, donc on le réinitialise
    this.style.border = 'none'
    this.addEventListener('mouseover', mouseOverSvgEffect)
    this.addEventListener('mouseout', mouseOutSvgEffect)
    this.addEventListener('click', mouseSvgClick)
    this.etat = false
  } else {
    // Passe à l'état choisi donc on désactive les listenners pour over et pour out
    this.removeEventListener('mouseover', mouseOverSvgEffect)
    this.removeEventListener('mouseout', mouseOutSvgEffect)
    this.style.border = '3px solid #f15929'
    this.etat = true
  }
}

function afficheScore (exercice /** Exercice */, nbBonnesReponses /** number */, nbMauvaisesReponses /** number */, divScore /** HTMLDivElement */, divButton /** HTMLButtonElement */) {
  divButton.classList.add('cursor-not-allowed', 'opacity-50', 'pointer-events-none')
  divScore.innerHTML = `${nbBonnesReponses} / ${nbBonnesReponses + nbMauvaisesReponses}`
  divScore.style.color = '#f15929'
  divScore.style.fontWeight = 'bold'
  divScore.style.fontSize = 'x-large'
  divScore.style.display = 'inline'
  return { numberOfPoints: nbBonnesReponses, numberOfQuestions: nbBonnesReponses + nbMauvaisesReponses }
}
