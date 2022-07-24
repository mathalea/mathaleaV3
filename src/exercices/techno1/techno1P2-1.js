import Exercice from '../Exercice.js'
import { randint, calcul, choice, texNombrec } from '../../modules/outils.js'
export const titre = 'Appliquer un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
* Modèle d'exercice très simple pour la course aux nombres
* @author Stéphane Guyon
* Référence
* Date de publication
*/
export default function Proportion () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = 'largeur25 inline'
  this.optionsChampTexte = { texteApres: ' €' }
  this.nouvelleVersion = function () {
    let a, b
    switch (choice(['simple'])) {
      case 'simple':
        b = randint(3, 80)/* Pourcentage */

        a = randint(10, 100)/* Valeur */

        this.question = `Calculer  $${b}\\%$ de $${a}$.  <br> `
        this.correction = `Calculer $p\\%$ d'un nombre, c'est multiplier ce nombre par $\\dfrac{p}{100}$.
<br>    Ainsi, $${b}\\%$  de $${a}$ est égal à $${texNombrec(b / 100)}\\times ${a}=${texNombrec(b * a / 100)}$.`
        this.reponse = calcul(b * a / 100)
        break
    }
  }
}
