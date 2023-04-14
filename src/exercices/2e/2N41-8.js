import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint, choice, combinaisonListes, rienSi1, texFractionReduite, texFraction } from '../../modules/outils.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Mettre au même dénominateur des expressions littérales'

/**
 * Mettre au même dénominateur des expressions littérales
* @author Gilles Mora
* 2N41-8
*/
export const uuid = '641bc'
export const ref = ''
export default function MettreAuMemeDenominateurLit () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 2
  this.sup = 1

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const listeFractions = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
      [1, 6], [5, 6], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [1, 8], [3, 8], [5, 8], [7, 8],
      [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [1, 10], [3, 10], [7, 10], [9, 10]]
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1] // coef de x = 1
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = [4, 5, 6] // coef de x > 1
    } else { typesDeQuestionsDisponibles = [7, 8, 9] } // coef de x relatif

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0, a, b, typesDeQuestions, fraction = [], consigne, consigneI, ds, ns; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      a = randint(1, 9)
      b = randint(2, 9)
      fraction = choice(listeFractions)
      ns = fraction[0]
      ds = fraction[1]
      consigne = 'Préciser les valeurs interdites éventuelles, puis écrire l\'expression avec un seul quotient : '
      consigneI = ' Écrire avec un seul quotient :<br>'
      switch (typesDeQuestions) {
        case 1:
          { const a = randint(1, 9)
            const b = randint(-9, 9, 0)
            texte = consigne
            texte += `$${rienSi1(b)}x+\\dfrac{${a}}{x}$.`
            texteCorr = `$${rienSi1(b)}x+\\dfrac{${a}}{x}=\\dfrac{${rienSi1(b)}x^2}{x}+\\dfrac{${a}}{x}=\\dfrac{${rienSi1(b)}x^2+${a}}{x}$`
            const reponse = [`\\dfrac{${b}x^2+${a}}{x}`]
            setReponse(this, i, reponse)
            if (this.interactif) {
              texte = consigneI
              texte += ` $${rienSi1(b)}x+\\dfrac{${a}}{x}=$` +
                    ajouteChampTexteMathLive(this, i, 'largeur25 inline')
            }
          }
          break
        case 2:
          { const a = randint(1, 9)
            const b = randint(-9, 9, 0)
            texte = `Préciser les valeurs interdites éventuelles, puis écrire l'expression avec un seul quotient : $${rienSi1(b)}x+\\dfrac{${a}}{x}$.`
            texteCorr = `$${rienSi1(b)}x+\\dfrac{${a}}{x}=\\dfrac{${rienSi1(b)}x^2}{x}+\\dfrac{${a}}{x}=\\dfrac{${rienSi1(b)}x^2+${a}}{x}$`
            const reponse = [`\\dfrac{${b}x^2+${a}}{x}`]
            setReponse(this, i, reponse)
            if (this.interactif) {
              texte = ` Écrire avec un seul quotient : $${rienSi1(b)}x+\\dfrac{${a}}{x}=$` +
                    ajouteChampTexteMathLive(this, i, 'largeur25 inline')
            }
          }
          break
        case 3:
          texte = `$(x-${a})(x+${a})$` // (x-a)(x+a)
          texteCorr = `$(x-${a})(x+${a})=x^2-${a}^2=x^2-${a * a}$`
          break
        case 4:
          texte = `$(${b}x+${a})^2$` // (bx+a)²  b>1
          texteCorr = `$(${b}x+${a})^2=(${b}x)^2+2 \\times ${b}x \\times ${a} + ${a}^2=${b * b}x^2+${2 * b * a}x+${a * a}$`
          break
        case 5:
          texte = `$(${b}x-${a})^2$` // (bx-a)² b>1
          texteCorr = `$(${b}x-${a})^2=(${b}x)^2-2 \\times ${b}x \\times ${a} + ${a}^2=${b * b}x^2-${2 * b * a}x+${a * a}$`
          break
        case 6:
          texte = `$(${b}x-${a})(${b}x+${a})$` // (bx-a)(bx+a) b>1
          texteCorr = `$(${b}x-${a})(${b}x+${a})=(${b}x)^2-${a}^2=${b * b}x^2-${a * a}$`
          break
        case 7:
          texte = `$\\left(${texFraction(ns, ds)}x+${a}\\right)^2$` // (kx+a)² k rationnel
          texteCorr = `$\\left(${texFraction(ns, ds)}x+${a}\\right)^2=\\left(${texFraction(ns, ds)}x\\right)^2+2 \\times ${texFraction(ns, ds)}x \\times ${a} + ${a}^2=\\left(${texFraction(ns, ds)}x+${a}\\right)^2=${texFraction(ns * ns, ds * ds)}x^2+${texFractionReduite(ns * 2 * a, ds)}x+${a * a}$`
          break
        case 8:
          texte = `$\\left(${texFraction(ns, ds)}x-${a}\\right)^2$` // (kx-a)² k rationnel
          texteCorr = `$\\left(${texFraction(ns, ds)}x-${a}\\right)^2=\\left(${texFraction(ns, ds)}x\\right)^2-2 \\times ${texFraction(ns, ds)}x \\times ${a} + ${a}^2=${texFraction(ns * ns, ds * ds)}x^2-${texFractionReduite(ns * 2 * a, ds)}x+${a * a}$`
          break
        case 9:
          //  (bx-a)(bx+a) avec a entier et b rationnel simple
          texte = `$\\left(${texFraction(ns, ds)}x-${a}\\right)\\left(${texFraction(ns, ds)}x+${a}\\right)$` // b>1
          texteCorr = `$\\left(${texFraction(ns, ds)}x-${a}\\right)\\left(${texFraction(ns, ds)}x+${a}\\right)=\\left(${texFraction(ns, ds)}x\\right)^2-${a}^2=${texFraction(ns * ns, ds * ds)}x^2-${a * a}$`
          break
      }

      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Coefficient de x égal à 1\n 2 : Coefficient de x supérieur à 1\n 3 : Coefficient de x rationnel']
}
