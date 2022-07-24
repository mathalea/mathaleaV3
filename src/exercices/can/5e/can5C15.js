import Exercice from '../../Exercice.js'
import { randint, ecritureParentheseSiNegatif, texteEnCouleur, calcul, abs } from '../../../modules/outils.js'
export const titre = 'Rechercher un nombre à ajouter'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 * Date de publication
*/
export default function NombreATrouver () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
  this.nbQuestions = 1
  this.tailleDiaporama = 1
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = randint(-9, 9, 0)
    const b = randint(1, 8)
    const c = a - b

    this.question = `Quel nombre doit-on ajouter à $${a}$ pour obtenir $${c}$ ? <br>
    `
    this.correction = `Le nombre $n$ à ajouter vérifie $${a}+n=${c}$, soit
    $n=${c}-${ecritureParentheseSiNegatif(a)}=${c - a}$. <br>
    `
    this.correction += texteEnCouleur(` Mentalement : <br>
    Le nombre cherché est négatif car le résultat est plus petit que le nombre de départ. <br>
L'"écart" entre les deux nombres est $${abs(c - a)}$. Il faut donc ajouter $${c - a}$.
`)
    this.reponse = calcul(c - a)
  }
}
