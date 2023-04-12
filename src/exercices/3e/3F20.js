import { droite, point, repere, texteParPoint, tracePoint } from "../../modules/2d.js";
import { mathalea2d } from "../../modules/2dGeneralites.js";
import FractionX from "../../modules/FractionEtendue.js";
import { setReponse } from "../../modules/gestionInteractif.js";
import { ajouteChampTexteMathLive } from "../../modules/interactif/questionMathLive.js";
import {
  choice,
  combinaisonListes,
  contraindreValeur,
  ecritureParentheseSiNegatif,
  listeQuestionsToContenu,
  premierAvec,
  randint,
  texNombre
} from "../../modules/outils.js";
import Exercice from '../Exercice.js'

export const titre = "Fonctions linéaires"
export const interactifType = 'mathLive'
export const interactifReady = true
export const amcReady = true
export const amcType = 'amcNum'
export const ref = '3F20'
export const uuid = 'aeb5a'

export default function FonctionLineaires () {
  Exercice.call(this)
  this.comment = `L'exercice propose différents type de questions sur les fonctions linéaires :<br>
Calcul d'image, calcul d'antécédent, détermination du coefficient.<br>
Ce coefficient peut être au choix entier relatif ou rationnel relatif.<br>
Certaines questions de calcul d'image nécessite le calcul du coefficient au prélable.`
  this.sup = 1 // coefficient entier relatif
  this.besoinFormulaireNumerique = ['Coefficient : ', 3, '1: Coefficient entier\n2: Coefficient rationnel\n3: Mélange']
  this.nouvelleVersion = function (numeroExercice) {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const typesDeQuestions = [
      // 'imageParExpression',
      //  'imageParValeurs',
      'imageParGraphique',
      'antecedentParExpression']/*,
         'antecedentParValeurs',
         'antecedentParGraphique',
         'expressionParValeur',
         'expressionParGraphique'
       ]
       */
    const listeTypesDeQuestions = combinaisonListes(typesDeQuestions, this.nbQuestions)
    const antecedents = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      this.sup = contraindreValeur(1, 3, this.sup, 1)
      let texte = '', texteCorr = ''
      // valeur associée à image0 pour le calcul de coefficient : image0 = coefficient * antecedent0
      // on retrouve ces valeurs antecedent0 et image0 dans l'énoncé pour certaines questions.
      // ce sont antecedent et image qui seront à calculer.
      const antecedent0 = 2 * randint(2, 10) + 1
      let image0, coefficient, image
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
      const antecedent = premierAvec(antecedent0, antecedents, false) * choice([-1, 1])
      image0 = coefficient instanceof FractionX ? coefficient.num : coefficient * antecedent0
      image = coefficient instanceof FractionX ? coefficient.multiplieEntier(antecedent) : coefficient * antecedent
      antecedents.push(antecedent, antecedent0)
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
      switch (listeTypesDeQuestions[i]) {
        // On détermine l'image à partir de l'expression générale de la fonction
        case 'imageParExpression':
          texte += `Soit $f(x)=${coefficient instanceof FractionX ? coefficient.texFSD : texNombre(coefficient)}x$.<br>`
          texte += `Calculer $f(${antecedent})$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          setReponse(this, i, image)
          texteCorr += `$f(${texNombre(antecedent, 0)})=${coefficient instanceof FractionX ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}`
          texteCorr += `=${coefficient instanceof FractionX ? image.texFSD : texNombre(image, 0)}$`
          break
        case 'imageParValeurs':
          texte += `Soit $f(x)$ une fonction linéaire telle que $f(${antecedent0})=${texNombre(image0, 0)}$.<br>`
          texte += `Calculer $f(${antecedent})$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          setReponse(this, i, image)
          texteCorr += `Comme $f(${antecedent0})=${texNombre(image0, 0)}$, le coefficient $a$ tel que de $f(x)=ax$ est :<br>`
          texteCorr += `$a=\\dfrac{${texNombre(image0, 0)}}{${antecedent0}}$<br>`
          texteCorr += `Donc $f(${texNombre(antecedent, 0)})=${coefficient instanceof FractionX ? coefficient.texFSD : texNombre(coefficient, 0)} \\times ${ecritureParentheseSiNegatif(antecedent)}`
          texteCorr += `=${coefficient instanceof FractionX ? image.texFSD : texNombre(image, 0)}$`
          break
        case 'imageParGraphique':
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
            grille: false
          })
          const origine = point(0, 0)
          const M = point(antecedent0 * xUnite, image0 * yUnite)
          const d = droite(origine, M)
          const t = tracePoint(M)
          const coordonnees = texteParPoint(`(${antecedent0};${image0})`, point(M.x + 0.2, M.y), 'droite')
          texte += mathalea2d({
            xmin,
            ymin,
            xmax,
            ymax
          }, r, d, t, coordonnees)
          texte += `La droite représentant la fonction linéaire $f$ passe par le point de coordonnées (${antecedent0};${image0}).<br>`
          texte += `Calculer l'image de $${antecedent}$ par $f$.`
          texteCorr += `Comme $f(${antecedent0})=${image0}$, $f(x)=\\dfrac{${image0}}{${antecedent0}}x$.<br>`
          texteCorr += `Donc $f(${antecedent})=\\dfrac{${image0}}{${antecedent0}}\\times ${antecedent}=${image}$`
          break
        case 'antecedentParExpression':
          texte += `Soit $f(x)=${coefficient instanceof FractionX ? coefficient.texFSD : texNombre(coefficient)}x$.<br>`
          texte += `Calculer l'antécédent de $${coefficient instanceof FractionX ? image.texFSD : texNombre(image, 0)}$ par $f$.` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
          setReponse(this, i, antecedent)
          texteCorr += `$f(x)=${coefficient instanceof FractionX ? coefficient.texFSD : texNombre(coefficient, 0)}x=${coefficient instanceof FractionX ? image.texFSD : texNombre(image, 0)}$<br>`
          if (coefficient instanceof FractionX) {
            texteCorr += `Donc $x=\\dfrac{${image.texFSD}}{${coefficient.texFSD}}=`
            texteCorr += `${image.texFSD}\\times ${coefficient.inverse().texFSP}=`
          } else {
            texteCorr += `Donc $x=\\dfrac{${texNombre(image, 0)}}{${coefficient}}=`
          }
          texteCorr += `${antecedent}$`
          break
        case 'antecedentParValeurs':
          
          break
        case 'antecedentParGraphique':
          
          break
        case 'expressionParValeur':
          
          break
        case 'expressionParGraphique':
          
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
