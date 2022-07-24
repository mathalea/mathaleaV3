import { choice, randint } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'
export const titre = 'Calculer le prochain multiple de 3 ou de 9'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can5C08
 */
export default function ProchainMultipleDeTroisOuDeNeuf () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.typeExercice = 'simple'
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = randint(225, 528) * 3 + choice([0, 1, 2])
    const b = randint(143, 254) * 9 + randint(0, 8)
    const aString = Number(a).toString()
    const bString = Number(b).toString()
    let sommeA = 0
    let sommeB = 0
    for (let i = 0; i < aString.length; i++) {
      sommeA += parseInt(aString[i])
    }
    for (let i = 0; i < bString.length; i++) {
      sommeB += parseInt(bString[i])
    }

    if (choice([0, 1])) {
      this.reponse = a + 3 - a % 3
      this.question = `Quel est le plus petit entier supérieur strictement à $${a}$ qui soit divisible par $3$ ?`
      this.correction = `On calcule mentalement la somme des chiffres de $${a}$, on trouve $${sommeA}$.<br>`
      this.correction += sommeA % 3 === 0 ? `C'est un multiple de $3$ donc $${a}$ en est un et le prochain multiple de $3$ est $${a + 3}$<br>` : `C'est $${a % 3}$ de trop pour qu'il soit divisible par $3$, donc $${a}$ n'est pas un multiple de $3$ mais $${a - a % 3}$ en est un et $${this.reponse}$ aussi.<br>`
      this.correction += `Le prochain multiple de 3 est donc : $${this.reponse}$.`
    } else {
      this.reponse = b + 9 - b % 9
      this.question = `Quel est le plus petit entier supérieur strictement à $${b}$ qui soit divisible par $9$ ?`
      this.correction = `On calcule mentalement la somme des chiffres de $${b}$, on trouve $${sommeB}$.<br>`
      this.correction += sommeB % 9 === 0 ? `C'est un multiple de $9$ donc $${b}$ en est un et le prochain multiple de $9$ est $${b + 9}$<br>` : `C'est $${b % 9}$ de trop pour qu'il soit divisible par $9$, donc $${b}$ n'est pas un multiple de $9$ mais $${b - b % 9}$ en est un et $${this.reponse}$ aussi.<br>`
      this.correction += `Le prochain multiple de 9 est donc : $${this.reponse}$.`
    }
  }
}
