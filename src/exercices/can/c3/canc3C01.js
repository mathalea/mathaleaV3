import { choice } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'
export const titre = 'Déterminer un nombre à partir d’une phrase'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Date de publication septembre 2021
 * Référence canc3C01
 */
export default function CalculsAutomatiques () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = choice([50, 100, 40, 10, 20, 60, 200, 1000, 500])
    if (choice([true, false])) {
      switch (choice([1, 2, 3])) {
        case 1:
          this.reponse = a << 1
          this.question = `Le double de ${a} est égal à : `
          this.correction = `$${a}\\times 2 = ${a << 1}$`
          break
        case 2:
          this.reponse = a * 3
          this.question = `Le triple de ${a} est égal à :`
          this.correction = `$${a}\\times 3 = ${a * 3}$`
          break
        case 3:
          this.reponse = a * 10
          this.question = `Le nombre dix fois plus grand que ${a} est égal à : `
          this.correction = `$${a}\\times 10 = ${a * 10}$`
          break
      }
    } else {
      this.question = `La moitié de ${a} est égale à :`
      this.reponse = a >> 1
      this.correction = `$${a}\\div 2 = ${a >> 1}$`
    }
  }
}
