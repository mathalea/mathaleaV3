import Exercice from '../../Exercice.js'
import { randint, choice, miseEnEvidence } from '../../../modules/outils.js'
export const titre = 'Déterminer un multiple'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '12/04/2023'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 * Date de publication
*/
export const uuid = 'ed8da'
export const ref = 'can5N03'
export default function PlusGrandMultiple () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = randint(2, 16)
    const b = randint(2, 9)
    const c = randint(3, 9) * 10
    if (choice([true, false])) {
      this.question = `Quel est le plus grand entier  à deux chiffres divisible par $${a}$ ?`
      this.correction = `Cela revient à chercher le plus grand multiple de $${a}$ strictement inférieur à $100$.<br>`
      if (100 % a === 0) {
        this.reponse = 100 - a
        this.correction += `Comme $100$ est divisible par $${a}$, le plus grand mutiple cherché est $100-${a}=${miseEnEvidence(this.reponse)}$.`
      } else {
        this.reponse = Math.floor(100 / a) * a
        this.correction += ` Comme $${a}\\times ${Math.floor(100 / a)}=${Math.floor(100 / a) * a} < 100$ et  
        $ ${a}\\times ${Math.floor(100 / a) + 1}=${(Math.floor(100 / a) + 1) * a} > 100$,
        alors le plus grand multiple cherché est $${miseEnEvidence(this.reponse)}$.`
      }
    } else {
      this.question = `Quel est le plus grand entier multiple de $${b}$ strictement inférieur à $${c}$ ?`

      if (c % b === 0) {
        this.reponse = c - b
        this.correction = `Comme $${c}$ est divisible par $${b}$, le plus grand mutiple cherché est $${c}-${b}=${miseEnEvidence(this.reponse)}$.`
      } else {
        this.reponse = Math.floor(c / b) * b
        this.correction = ` Comme $${b}\\times ${Math.floor(c / b)} =${Math.floor(c / b) * b} < ${c}$ et  
        $ ${b}\\times${Math.floor(c / b) + 1}=${(Math.floor(c / b + 1)) * b} > ${c}$,
        alors le plus grand mutiple cherché est $${miseEnEvidence(this.reponse)}$.`
      }
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
