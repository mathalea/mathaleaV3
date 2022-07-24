import { choice, randint } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'
export const titre = 'Calculer à partir d’une décomposition'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Date de publication septembre 2021
 * Référence canc3C02
 */
export default function CompositionDeNombreEntier () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = randint(1, 9)
    const b = randint(1, 9, a)
    const c = randint(1, 9, [a, b])
    switch (choice([1, 2, 3])) {
      case 1:
        this.reponse = a * 1000 + b * 100 + c
        this.question = `$(${a}\\times 1000) + (${b}\\times 100) + (${c}\\times 1)=$`
        this.correction = `$(${a}\\times 1000) + (${b}\\times 100) + (${c}\\times 1)=${a * 1000}+${b * 100}+${c}=${a * 1000 + b * 100 + c}$`
        break
      case 2:
        this.reponse = a * 1000 + b * 10 + c
        this.question = `$(${a}\\times 1000) + (${b}\\times 10) + (${c}\\times 1)=$`
        this.correction = `$(${a}\\times 1000) + (${b}\\times 10) + (${c}\\times 1)=${a * 1000}+${b * 10}+${c}=${a * 1000 + b * 10 + c}$`
        break
      case 3:
        this.reponse = a * 1000 + b * 100 + c * 10
        this.question = `$(${a}\\times 1000) + (${b}\\times 100) + (${c}\\times 10)=$`
        this.correction = `$(${a}\\times 1000) + (${b}\\times 100) + (${c}\\times 10)=${a * 1000}+${b * 100}+${c * 10}=${a * 1000 + b * 100 + c * 10}$`
        break
    }
  }
}
