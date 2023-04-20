import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint, choice, sp, combinaisonListes, rienSi1, reduireAxPlusB, ecritureAlgebriqueSauf1 } from '../../modules/outils.js'
import FractionX from '../../modules/FractionEtendue.js'
export const dateDePublication = '19/04/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Résoudre des équations avec un quotient'

/**
 * Mettre au même dénominateur des expressions littérales
* @author Gilles Mora
* 2N41-8
*/
export const uuid = 'b5828'
export const ref = ''
export default function ResoudreEquationsQuotient () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 2
  this.sup = 3
  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1, 2]
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = [3, 4]
    } else { typesDeQuestionsDisponibles = [1, 2, 3, 4] } // 1, 2, 3, 4, 5, 6, 7

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0, typesDeQuestions, choix, consigne1, a, b, c, d, e, f, f1, f2, f3, k1, k2; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      consigne1 = 'Préciser les valeurs interdites éventuelles, puis résoudre l\'équation : '
      switch (typesDeQuestions) {
        case 1:// (ax+b)/(cx+d)=0
          a = randint(-3, 9, 0)
          b = randint(-9, 9)
          c = randint(-9, 9, 0)
          d = randint(-9, 9)
          if (a * d - b * c === 0) {
            a = randint(-3, 9, 0)
            b = randint(-9, 9)
            c = randint(-9, 9, 0)
            d = randint(-9, 9)
          }
          f1 = new FractionX(-d, c).simplifie()
          f2 = new FractionX(-b, a).simplifie()
          choix = choice([true, false])
          texte = consigne1
          if (b === 0) {
            texte += `$\\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}=0$.`
          } else {
            texte += `${choix ? `$\\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}=0$` : `$\\dfrac{${b}${ecritureAlgebriqueSauf1(a)}x}{${reduireAxPlusB(c, d)}}=0$`}.`
          }
          if (context.isDiaporama) {
            texteCorr = ''
          } else {
            if (b === 0) {
              texteCorr = 'Déterminer les valeurs interdites revient à déterminer les valeurs qui annulent le dénominateur du quotient, puisque la division par $0$ n\'existe pas.<br>'
            } else {
              texteCorr = 'Déterminer les valeurs interdites revient à déterminer les valeurs qui annulent le dénominateur du quotient, puisque la division par $0$ n\'existe pas.<br>'
            }
          }
          texteCorr += `Or $${reduireAxPlusB(c, d)}=0$ si et seulement si  $x=${f1.texFraction}$. <br>
          Donc l'ensemble des valeurs interdites est  $\\left\\{${f1.texFraction}\\right\\}$. <br>`
          if (b === 0) {
            texteCorr += `Pour tout $x\\in \\mathbb{R}\\smallsetminus\\left\\{${f1.texFraction}\\right\\}$, <br>
 $\\begin{aligned}
 \\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}&=0 \\\\
 ${reduireAxPlusB(a, b)}&=0 ${sp(7)} \\text{ car }\\dfrac{A(x)}{B(x)}=0 \\text { si et seulement si } A(x)=0 \\text { et } B(x)\\neq 0\\\\
x&= ${f2.texFraction}
\\end{aligned}$<br>`
          } else {
            texteCorr += `Pour tout $x\\in \\mathbb{R}\\smallsetminus\\left\\{${f1.texFraction}\\right\\}$,<br>
 $\\begin{aligned}
 ${choix ? `\\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}&=0` : `\\dfrac{${b}${ecritureAlgebriqueSauf1(a)}x}{${reduireAxPlusB(c, d)}}&=0`}\\\\
 ${choix ? `${reduireAxPlusB(a, b)}&=0` : `${b}${ecritureAlgebriqueSauf1(a)}x&=0`}${sp(7)} \\text{ car }\\dfrac{A(x)}{B(x)}=0 \\text { si et seulement si } A(x)=0 \\text { et } B(x)\\neq 0\\\\
x&= ${f2.texFraction}
\\end{aligned}$<br>`
          }

          texteCorr += ` $${f2.texFraction}$ n'est pas une valeur interdite, donc l' ensemble des solutions de cette équation est  $\\mathscr{S}=\\left\\{${f2.texFraction}\\right\\}$.`
          break
        case 2:// (ax^2-b)/(cx+d)=0
          a = randint(1, 4)
          k1 = randint(1, 10)
          b = a * k1 * k1
          c = randint(-9, 9, 0)
          k2 = randint(-4, 4, 0)
          d = c * k2

          choix = choice([true, false])
          texte = consigne1
          texte += `${choix ? `$\\dfrac{${rienSi1(a)}x^2-${b}}{${reduireAxPlusB(c, d)}}=0$` : `$\\dfrac{${b}-${rienSi1(a)}x^2}{${reduireAxPlusB(c, d)}}=0$`}.`
          if (context.isDiaporama) {
            texteCorr = ''
          } else {
            texteCorr = 'Déterminer les valeurs interdites revient à déterminer les valeurs qui annulent le dénominateur du quotient, puisque la division par $0$ n\'existe pas.<br>'
          }
          texteCorr += `Or $${reduireAxPlusB(c, d)}=0$ si et seulement si  $x=${-k2}$. <br>
          Donc l'ensemble des valeurs interdites est  $\\left\\{${-k2}\\right\\}$.<br>
          Pour tout $x\\in \\mathbb{R}\\smallsetminus\\left\\{${-k2}\\right\\}$, <br>
            $\\begin{aligned}
            ${choix ? `\\dfrac{${rienSi1(a)}x^2-${b}}{${reduireAxPlusB(c, d)}}&=0` : `\\dfrac{${b}-${rienSi1(a)}x^2}{${reduireAxPlusB(c, d)}}&=0`}\\\\
            ${choix ? `${rienSi1(a)}x^2-${b}&=0` : `${b}-${rienSi1(a)}x^2&=0`}${sp(7)} \\text{ car }\\dfrac{A(x)}{B(x)}=0 \\text { si et seulement si } A(x)=0 \\text { et } B(x)\\neq 0\\\\
            x^2&=${k1 * k1}\\\\
           x= ${k1}&\\text{ ou } x= -${k1}
           \\end{aligned}$<br>
           `
          if (-k2 === k1 || k2 === k1) {
            if (-k2 === k1) {
              texteCorr += `  $${k1}$ est une valeur interdite, donc l' ensemble des solutions de cette équation est  $\\mathscr{S}=\\left\\{${-k1}\\right\\}$.
        `
            } else {
              texteCorr += `  $${-k1}$ est une valeur interdite, donc l' ensemble des solutions de cette équation est  $\\mathscr{S}=\\left\\{${k1}\\right\\}$.
        `
            }
          } else {
            texteCorr += `  $${-k1}$ et $${k1}$ ne sont pas des valeurs interdites, donc l' ensemble des solutions de cette équation est  $\\mathscr{S}=\\left\\{${-k1}\\,;\\,${k1}\\right\\}$.
        `
          }
          break
        case 3:// (ax+b)/(cx+d)=e
          a = randint(-3, 9, 0)
          b = randint(-9, 9)
          c = randint(-9, 9, 0)
          d = randint(-9, 9)
          e = randint(-9, 9, 0)
          if (a * d - b * c === 0) {
            a = randint(-3, 9, 0)
            b = randint(-9, 9, 0)
            c = randint(-9, 9, 0)
            d = randint(-9, 9)
          }
          f1 = new FractionX(-d, c).simplifie()
          f2 = new FractionX(e * d - b, a - e * c).simplifie()
          choix = choice([true, false])
          texte = consigne1
          if (b === 0) { texte += `$\\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}=${e}$.` } else {
            texte += `${choix ? `$\\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}=${e}$` : `$\\dfrac{${b}${ecritureAlgebriqueSauf1(a)}x}{${reduireAxPlusB(c, d)}}=${e}$`}.`
          } if (context.isDiaporama) {
            texteCorr = ''
          } else {
            texteCorr = 'Déterminer les valeurs interdites revient à déterminer les valeurs qui annulent le dénominateur du quotient, puisque la division par $0$ n\'existe pas.<br>'
          }
          texteCorr += `Or $${reduireAxPlusB(c, d)}=0$ si et seulement si  $x=${f1.texFraction}$. <br>
          Donc l'ensemble des valeurs interdites est  $\\left\\{${f1.texFraction}\\right\\}$ est une valeur interdite pour l'équation. <br>
          Pour tout $x\\in \\mathbb{R}\\smallsetminus\\left\\{${f1.texFraction}\\right\\}$,<br>`
          if (b === 0) {
            texteCorr += ` 
            $\\begin{aligned}
            \\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}&=${e}\\\\
            ${reduireAxPlusB(a, b)}&=${e}\\times(${reduireAxPlusB(c, d)})${sp(7)} \\text{ car les produits en croix sont égaux.}\\\\
            ${reduireAxPlusB(a, b)}&= ${reduireAxPlusB(e * c, e * d)}\\\\
           ${a - e * c}x&= ${e * d - b}\\\\
           x&=${f2.texFraction}
           \\end{aligned}$<br>`
          } else {
            texteCorr += ` 
            $\\begin{aligned}
           ${choix ? `\\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}&=${e}` : `\\dfrac{${b}${ecritureAlgebriqueSauf1(a)}x}{${reduireAxPlusB(c, d)}}&=${e}`}\\\\
            ${choix ? `${reduireAxPlusB(a, b)}&=${e}\\times(${reduireAxPlusB(c, d)})` : `${b}${ecritureAlgebriqueSauf1(a)}x&=${e}\\times(${reduireAxPlusB(c, d)})`}${sp(7)}\\text{ car les produits en croix sont égaux.}\\\\
            ${reduireAxPlusB(a, b)}&= ${reduireAxPlusB(e * c, e * d)}\\\\
            ${a - e * c}x&= ${e * d - b}\\\\
           x&=${f2.texFraction}
           \\end{aligned}$<br>`
          }

          if (-d * (a - e * c) - c * (e * d - b) === 0) {
            texteCorr += `$${f2.texFraction}$ est  une valeur interdite, donc l' ensemble des solutions de cette équation est  $\\mathscr{S}=\\varnothing$.`
          } else { texteCorr += `$${f2.texFraction}$ n'est pas une valeur interdite, donc l' ensemble des solutions de cette équation est  $\\mathscr{S}=\\left\\{${f2.texFraction}\\right\\}$.` }
          break

        case 4:// e/(ax+b)=f/(cx+d)
          a = randint(-3, 9, 0)
          b = randint(-9, 9)
          c = randint(-5, 9, 0)
          d = randint(-9, 9)
          e = randint(-9, 9, 0)
          f = randint(-9, 9, 0)
          if (c * (f * b - a * d) === -d * (e * c - f * a) || a * (f * b - a * d) === -b * (e * c - f * a)) { // pas de VI sol enfin normalement :-)
            a = randint(-3, 9, 0)
            b = randint(-9, 9)
            c = randint(-5, 9, 0)
            d = randint(-9, 9)
            e = randint(-9, 9, 0)
            f = randint(-9, 9, 0)
          }
          f1 = new FractionX(-d, c).simplifie()
          f2 = new FractionX(-b, a).simplifie()
          if (e * c - f * a === 0) { e = e + 10 }
          f3 = new FractionX(-e * d + f * b, e * c - f * a).simplifie()
          choix = choice([true, false])
          texte = consigne1
          texte += `$\\dfrac{${e}}{${reduireAxPlusB(a, b)}}=\\dfrac{${f}}{${reduireAxPlusB(c, d)}}$.`
          if (context.isDiaporama) {
            texteCorr = ''
          } else {
            texteCorr = 'Déterminer les valeurs interdites revient à déterminer les valeurs qui annulent les dénominateurs des quotients, puisque la division par $0$ n\'existe pas.<br>'
          }
          texteCorr += `Or $${reduireAxPlusB(a, b)}=0$ si et seulement si  $x=${f2.texFraction}$ et $${reduireAxPlusB(c, d)}=0$ si et seulement si  $x=${f1.texFraction}$. <br>
          Donc l'ensemble des valeurs interdites est  $\\left\\{${-d / c < -b / a ? `${f1.texFraction}\\,;\\,${f2.texFraction}` : `${f2.texFraction}\\,;\\,${f1.texFraction}`}\\right\\}$ sont des  valeurs interdites pour l'équation. <br>`

          texteCorr += `Pour tout $x\\in \\mathbb{R}\\smallsetminus\\left\\{${-d / c < -b / a ? `${f1.texFraction}\\,;\\,${f2.texFraction}` : `${f2.texFraction}\\,;\\,${f1.texFraction}`}\\right\\}$,<br>
 $\\begin{aligned}
 \\dfrac{${e}}{${reduireAxPlusB(a, b)}}&=\\dfrac{${f}}{${reduireAxPlusB(c, d)}}\\\\
 ${f}\\times (${reduireAxPlusB(a, b)})&=${e}\\times (${reduireAxPlusB(c, d)})${sp(7)} \\text{ car les produits en croix sont égaux.}\\\\
 ${reduireAxPlusB(f * a, f * b)}&=${reduireAxPlusB(e * c, e * d)}\\\\
${e * c - f * a}x&= ${-e * d + f * b}\\\\
x&=${f3.texFraction}
\\end{aligned}$<br>`

          texteCorr += ` $${f3.texFraction}$ n'est pas une valeur interdite, donc l'ensemble des solutions de cette équation est  $\\mathscr{S}=\\left\\{${f3.texFraction}\\right\\}$.`
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
  this.besoinFormulaireNumerique = ['Type d\'équations', 3, '1 : A(x)/B(x)=0$\n 2 : A(x)/B(x)=a$ ou a/A(x)=b/B(x)$\n 3 : Mélange']
}
