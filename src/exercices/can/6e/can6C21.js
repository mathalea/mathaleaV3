import { calcul, randint, texNombrec, texteEnCouleur } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'
export const titre = 'Trouver le complément à 1*'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 * Référence can6C21
 */
export default function ComplementAUn () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.typeExercice = 'simple'

  this.nouvelleVersion = function () {
    const a = calcul(randint(1, 9) / 10 + randint(1, 9) / 100)
    this.question = `$1-${texNombrec(a)}=$`
    this.correction = `$1-${texNombrec(a)}=${texNombrec(1 - a)}$`
    this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    $1$ unité = $100$ centièmes.<br>
    On enlève $${texNombrec(100 * a)}$ centièmes à $100$ centièmes, il en reste $${texNombrec(100 * (1 - a))}$.<br>
    Ainsi, $1-${texNombrec(a)}=${texNombrec(1 - a)}$.  `)
    this.reponse = calcul(1 - a)
  }
}
