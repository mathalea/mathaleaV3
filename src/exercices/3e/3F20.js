import { droite, point, polyline, repere, texteParPoint, tracePoint } from '../../modules/2d.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import FractionX from '../../modules/FractionEtendue.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import {
  choice,
  combinaisonListes,
  contraindreValeur,
  ecritureParentheseSiNegatif,
  listeQuestionsToContenu,
  pgcd,
  premierAvec,
  randint,
  texNombre
} from '../../modules/outils.js'
import Exercice from '../Exercice.js'

export const titre = 'Fonctions linéaires'
export const interactifType = 'mathLive'
export const interactifReady = true
export const amcReady = true
export const amcType = 'AMCNum'
export const ref = '3F20'
export const uuid = 'aeb5a'

export default function FonctionLineaires () {
  Exercice.call(this)
  this.comment = `L'exercice propose différents type de questions sur les fonctions linéaires :<br>
calcul d'image, calcul d'antécédent ou détermination du coefficient.<br>
Ce coefficient peut être au choix entier relatif ou rationnel relatif.<br>
Certaines questions de calcul d'image nécessitent le calcul du coefficient au prélable.`
  this.sup = 1 // coefficient entier relatif
  this.nbQuestions = 5
  this.besoinFormulaireNumerique = ['Coefficient : ', 3, '1: Coefficient entier\n2: Coefficient rationnel\n3: Mélange']
  this.nouvelleVersion = function (numeroExercice) {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const typesDeQuestions = [
      'imageParExpression',
      'imageParValeurs',
      'imageParGraphique',
      'antecedentParExpression',
      'antecedentParValeurs',
      'antecedentParGraphique',
      'expressionParValeur',
      'expressionParGraphique'
    ]

    const listeTypesDeQuestions = combinaisonListes(typesDeQuestions, this.nbQuestions)
    const antecedents = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      this.sup = contraindreValeur(1, 3, this.sup, 1)
      let texte = ''; let texteCorr = ''
      // valeur associée à image0 pour le calcul de coefficient : image0 = coefficient * antecedent0
      // on retrouve ces valeurs antecedent0 et image0 dans l'énoncé pour certaines questions.
      // ce sont antecedent et image qui seront à calculer.
      const antecedent0 = 2 * randint(2, 10) + 1
      let coefficient, image
      switch (this.sup) {
        case 1:
          coefficient = randint(2, 15) * choice([-1, 1])
          break
        case 2:
          coefficient = new FractionX(premierAvec(antecedent0, antecedents, false), antecedent0)
          break
        case 3:
          if (Math.random() < 0.5) {
            coefficient = premierAvec(antecedent0, antecedents, false)
          } else {
            coefficient = new FractionX(premierAvec(antecedent0, antecedents, false), antecedent0)
          }
          break
      }
      let imageString, formatInteractif
      const antecedent = premierAvec(antecedent0, antecedents, false) * choice([-1, 1])
      const image0 = coefficient instanceof FractionX ? coefficient.num : coefficient * antecedent0
      if (coefficient instanceof FractionX) {
        image = coefficient.multiplieEntier(antecedent)
        imageString = image.texFSD
        formatInteractif = 'fractionEgale'
      } else {
        image = coefficient * antecedent
        imageString = texNombre(image, 0)
        formatInteractif = 'calcul'
      }
      antecedents.push(antecedent, antecedent0)
      const coefficientString = coefficient instanceof FractionX ? coefficient.simplifie().texFSD : coefficient.toString()
      let xUnite, yUnite, xThickDistance, yThickDistance, xThickMin, yThickMin
      const tableauEchelleX = [[5, 1, 1], [10, 0.5, 2], [20, 0.25, 4], [50, 0.1, 10], [100, 0.05, 20]]
      const tableauEchelleY = [[5, 1, 1], [10, 0.5, 2], [20, 0.25, 4], [50, 0.1, 10], [100, 0.05, 20], [200, 0.025, 40], [500, 0.01, 100]]
      xUnite = tableauEchelleX[0][1]
      xThickDistance = tableauEchelleX[0][2]
      xThickMin = -tableauEchelleX[0][0] - xThickDistance
      for (let k = 1; Math.abs(antecedent0) > tableauEchelleX[k - 1][0]; k++) {
        xUnite = tableauEchelleX[k][1]
        xThickDistance = tableauEchelleX[k][2]
        xThickMin = -tableauEchelleX[k][0] - xThickDistance
      }
      yUnite = tableauEchelleY[0][1]
      yThickDistance = tableauEchelleY[0][2]
      yThickMin = -tableauEchelleY[0][0] - yThickDistance
      for (let k = 1; Math.abs(image0) > tableauEchelleY[k - 1][0]; k++) {
        yUnite = tableauEchelleY[k][1]
        yThickDistance = tableauEchelleY[k][2]
        yThickMin = -tableauEchelleY[k][0] - yThickDistance
      }
      const xMin = xThickMin
      const xMax = -xThickMin
      const yMin = yThickMin
      const yMax = -yThickMin
      const xmin = xMin * xUnite
      const ymin = yMin * yUnite
      const xmax = xMax * xUnite
      const ymax = yMax * yUnite
      const r = repere({
        xUnite,
        yUnite,
        xMin,
        yMin,
        xMax,
        yMax,
        xThickDistance,
        yThickDistance,
        yLabelEcart: 0.8,
        grille: false
      })
      const origine = point(0, 0)
      const M = point(antecedent0 * xUnite, image0 * yUnite)
      const d = droite(origine, M)
      const t = tracePoint(M)
      const projeteX = point(M.x, 0)
      const projeteY = point(0, M.y)
      const pointilles = polyline([projeteY, M, projeteX], 'red')
      pointilles.pointilles = 2
      pointilles.epaisseur = 1
      const coordonnees = texteParPoint(`(${antecedent0};${image0})`, point(M.x + 0.2, M.y), 'droite')

      switch (listeTypesDeQuestions[i]) {
        // On détermine l'image à partir de l'expression générale de la fonction
        case 'imageParExpression':
          texte += `Soit $f(x)=${coefficient instanceof FractionX ? coefficient.texFSD : texNombre(coefficient)}x$.<br>`
          texte += `Calculer $f(${antecedent})$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `$f(${texNombre(antecedent, 0)})=${coefficient instanceof FractionX ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}`
          texteCorr += `=${coefficient instanceof FractionX ? image.texFSD : texNombre(image, 0)}$`
          setReponse(this, i, image, { formatInteractif })
          break
        case 'imageParValeurs':
          texte += `Soit $f$ une fonction linéaire telle que $f(${antecedent0})=${texNombre(image0, 0)}$.<br>`
          texte += `Calculer $f(${antecedent})$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax$ est :<br>`
          texteCorr += `$a=\\dfrac{${texNombre(image0, 0)}}{${antecedent0}}`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionX(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$<br>Donc $f(${texNombre(antecedent, 0)})=${coefficient instanceof FractionX ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}`
          texteCorr += `=${coefficient instanceof FractionX ? image.texFSD : texNombre(image, 0)}$`
          setReponse(this, i, image, { formatInteractif })
          break
        case 'imageParGraphique':
          texte += mathalea2d({
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texte += `La droite représentant la fonction linéaire $f$ passe par le point de coordonnées $(${antecedent0};${image0})$.<br>`
          texte += `Calculer l'image de $${antecedent}$ par $f$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $f(${antecedent0})=${image0}$ alors $f(x)=\\dfrac{${image0}}{${antecedent0}}x`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionX(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}x`
          }
          texteCorr += `$<br>Donc $f(${antecedent})=${coefficientString}\\times ${antecedent}=${imageString}$`
          setReponse(this, i, image, { formatInteractif })
          break
        case 'antecedentParExpression':
          texte += `Soit $f(x)=${coefficient instanceof FractionX ? coefficient.texFSD : texNombre(coefficient)}x$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$ par $f$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Posons $A$ l'antécédent de $${imageString}$, alors $f(A)=${coefficientString}\\times A=${imageString}$<br>`
          if (coefficient instanceof FractionX) {
            texteCorr += `Donc $A=\\dfrac{${image.texFSD}}{${coefficientString}}=`
            texteCorr += `${image.texFSD}\\times ${coefficient.inverse().texFSP}=`
          } else {
            texteCorr += `Donc $A=\\dfrac{${texNombre(image, 0)}}{${coefficientString}}=`
          }
          texteCorr += `${antecedent}$`
          setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'antecedentParValeurs':
          texte += `Soit $f$ une fonction linéaire telle que $f(${antecedent0})=${texNombre(image0, 0)}$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax$ est :<br>`
          texteCorr += `$a=\\dfrac{${texNombre(image0, 0)}}{${antecedent0}}`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionX(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$<br>Posons $A$ l'antécédent de $${imageString}$, alors $f(A)=${coefficientString} \\times A=${imageString}$.<br>`
          texteCorr += `On en déduit que $A=\\dfrac{${imageString}}{${coefficientString}}=`
          if (coefficient instanceof FractionX) {
            texteCorr += `${imageString}\\times ${coefficient.inverse().texFSP}=`
          }
          texteCorr += `${antecedent}$`
          setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'antecedentParGraphique':
          texte += mathalea2d({
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texte += `La droite représentant la fonction linéaire $f$ passe par le point de coordonnées $(${antecedent0};${image0})$.<br>`
          texte += `Calculer l'antécédent de $${imageString}$ par $f$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          texteCorr += `Comme $f(${antecedent0})=${image0}$ alors $f(x)=\\dfrac{${image0}}{${antecedent0}}x`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionX(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}x`
          }
          texteCorr += `$<br>Posons $A$ l'antécédent de $${imageString}$, alors $f(A)=${coefficientString}\\times A=${imageString}$.<br>`
          texteCorr += `On en déduit que $A=\\dfrac{${imageString}}{${coefficientString}}=`
          if (coefficient instanceof FractionX) {
            texteCorr += `${imageString}\\times ${coefficient.inverse().texFSP}=`
          }
          texteCorr += `${antecedent}$`
          setReponse(this, i, antecedent, { formatInteractif: 'calcul' })
          break
        case 'expressionParValeur':
          texte += `Soit $f$ une fonction linéaire telle que $f(${antecedent0})=${texNombre(image0, 0)}$.<br>`
          if (context.isAmc) {
            texte += 'Donner le coefficient de  $f$.'
          } else {
            texte += 'Donner l\'expression de  $f(x)$.' + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          }
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax$ est :<br>`
          texteCorr += `$a=\\dfrac{${texNombre(image0, 0)}}{${antecedent0}}`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionX(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$<br>Donc $f(x)=${coefficientString}x$`
          if (context.isAmc) {
            setReponse(this, i, coefficient, { formatInteractif: 'calcul' })
          } else {
            setReponse(this, i, [`f(x)=${coefficientString}x`, `${coefficientString}x`], { formatInteractif: 'calcul' })
          }
          break
        case 'expressionParGraphique':
          texte += mathalea2d({
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees, pointilles)
          texte += `La droite représentant la fonction linéaire $f$ passe par le point de coordonnées $(${antecedent0};${image0})$.<br>`
          if (context.isAmc) {
            texte += 'Donner le coefficient de  $f$.'
          } else {
            texte += 'Donner l\'expression de  $f(x)$.' + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          }
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax$ est :<br>`
          texteCorr += `$a=\\dfrac{${texNombre(image0, 0)}}{${antecedent0}}`
          if (pgcd(image0, antecedent0) !== 1) {
            const simplification = (new FractionX(image0, antecedent0)).simplifie().texFSD
            texteCorr += `=${simplification}`
          }
          texteCorr += `$<br>Donc $f(x)=${coefficientString}x$`
          if (context.isAmc) {
            setReponse(this, i, coefficient, { formatInteractif: 'calcul' })
          } else {
            setReponse(this, i, [`f(x)=${coefficientString}x`, `${coefficientString}x`], { formatInteractif: 'calcul' })
          }
          break
      }
      if (this.questionJamaisPosee(i, coefficient, antecedent, image)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
