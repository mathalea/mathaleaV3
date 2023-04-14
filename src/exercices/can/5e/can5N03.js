import Exercice from '../../Exercice.js'
import { randint, calcul, texNombre, texNombrec, choice, miseEnEvidence } from '../../../modules/outils.js'
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
    if (choice([true, true])) {
      
      this.question = `Quel est le plus grand entier entier à deux chiffres divisible par $${a}$ ?`
      this.correction = `On cherche le plus grand multiple de $${a}$ inférieur à $100$.<br>`
      if (100 % a === 0) {
        this.reponse = 100 - a
        this.correction += `Comme $100$ est divisible par $${a}$, le plus grand mutiple cherché est $100-${a}=${miseEnEvidence(this.reponse)}$.`
      } else {
        this.reponse = Math.ceil(100 / a) * a
        this.correction += `Comme $100$ est divisible par $${a}$, le plus grand mutiple cherché est $100-${a}=${miseEnEvidence(this.reponse)}$.`
      }
    } else {
      this.question = `Quel est le plus grand entier entier à deux chiffres divisible par $${a}$ ?`
      this.correction = `On cherche le plus grand multiple de $${a}$ inférieur à $100$.<br>`
      if (100 % a === 0) {
        this.reponse = 100 - a
        this.correction += `Comme $100$ est divisible par $${a}$, le plus grand mutiple cherché est $100-${a}=${miseEnEvidence(this.reponse)}$.`
      } else {
        this.reponse = Math.ceil(100 / a) * a
        this.correction += `Comme $100$ est divisible par $${a}$, le plus grand mutiple cherché est $100-${a}=${miseEnEvidence(this.reponse)}$.`
      }
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
