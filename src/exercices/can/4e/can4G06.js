import Exercice from '../../Exercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint, choice, calcul, creerNomDePolygone, texNombrec, stringNombre } from '../../../modules/outils.js'
import {
  point, pointAdistance, polygoneAvecNom, labelPoint, segmentAvecExtremites, droite, segment, milieu, texteParPosition
} from '../../../modules/2d.js'
export const titre = 'Calculer une longueur avec le théorème de Thalès'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can4G06
 * Date de publication septembre 2021
*/
export const uuid = '61c07'
export const ref = 'can4G06'
export default function CalculLongueurThales () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
  this.formatChampTexte = 'largeur15 inline'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let nom, a, b, c, k, A, B, C, D, E, G, H, xmin, xmax, ymin, ymax, objets, pol
    if (choice([true, false])) {
      nom = creerNomDePolygone(5, ['QD'])
      k = choice([1.5, 2, 2.5])
      b = randint(2, 5)//
      a = k * b
      c = randint(2, 5, b)//

      A = point(0, 0, nom[0], 'below right')
      B = pointAdistance(A, b, 40, nom[1])
      D = pointAdistance(A, a, 40, nom[3])
      C = pointAdistance(D, k * c, -40, nom[2], 'below right')
      E = pointAdistance(B, c, -40, nom[4], 'below right')
      G = pointAdistance(A, 0.7, 120)
      H = pointAdistance(D, 0.7, 120)
      pol = polygoneAvecNom(A, D, C)
      xmin = Math.min(A.x, B.x, C.x, D.x, E.x) - 1
      ymin = Math.min(A.y, B.y, C.y, D.y, E.y) - 1
      xmax = Math.max(A.x, B.x, C.x, D.x, E.x) + 1
      ymax = Math.max(A.y, B.y, C.y, D.y, E.y) + 1
      objets = []
      objets.push(pol[0]) //, pol[1]
      objets.push(droite(A, B), segment(B, E), droite(A, C), segment(D, C), segmentAvecExtremites(G, H), labelPoint(A, B, C, D, E))
      objets.push(texteParPosition(`${stringNombre(a)}`, milieu(G, H).x, milieu(G, H).y + 0.9),
        texteParPosition(`${stringNombre(b)}`, milieu(A, B).x, milieu(A, B).y + 0.4), texteParPosition(`${stringNombre(c)}`, milieu(B, E).x, milieu(B, E).y + 0.3))
      this.question = `Les droites $(${nom[1]}${nom[4]})$ et $(${nom[3]}${nom[2]})$ sont parallèles.<br>

        Calculer $${nom[3]}${nom[2]}$.<br>
        
        `
      this.question += mathalea2d({ xmin, ymin, xmax, ymax, pixelsParCm: 15, mainlevee: false, amplitude: 0.5, scale: 0.5, style: 'margin: auto' }, objets)
      this.correction = ` Le triangle $${nom[0]}${nom[3]}${nom[2]}$ est un agrandissement du triangle $${nom[0]}${nom[3]}${nom[2]}$.<br>
    Le coefficient d'agrandissement est  donné par : $\\dfrac{${nom[0]}${nom[3]}}{${nom[0]}${nom[1]}}=\\dfrac{${texNombrec(a)}}{${b}}=${texNombrec(a / b)}$.<br>
    On en déduit que les longueurs du triangle $${nom[0]}${nom[3]}${nom[2]}$ sont $${texNombrec(a / b)}$ fois plus grandes que celles du triangle $${nom[0]}${nom[1]}${nom[4]}$. <br>
        Ainsi, $${nom[3]}${nom[2]}=${texNombrec(a / b)}\\times ${nom[1]}${nom[4]}=${texNombrec(a / b)}\\times ${c}=${texNombrec(a * c / b)}$.
                  <br>`
      this.reponse = calcul(a * c / b)
      this.canEnonce = this.question// 'Compléter'
      this.canReponseACompleter = `$${nom[3]}${nom[2]}=\\ldots$`
    } else {
      nom = creerNomDePolygone(5, ['QD'])
      k = choice([1.5, 2, 2.5])
      a = randint(2, 5)//
      b = randint(2, 5, a)//

      A = point(0, 0, nom[0], 'below right')
      B = pointAdistance(A, a, 40, nom[1])
      D = pointAdistance(A, k * a, 40, nom[3])
      C = pointAdistance(D, k * b, -40, nom[2], 'below right')
      E = pointAdistance(B, b, -40, nom[4], 'below right')
      pol = polygoneAvecNom(A, D, C)
      xmin = Math.min(A.x, B.x, C.x, D.x, E.x) - 1
      ymin = Math.min(A.y, B.y, C.y, D.y, E.y) - 1
      xmax = Math.max(A.x, B.x, C.x, D.x, E.x) + 1
      ymax = Math.max(A.y, B.y, C.y, D.y, E.y) + 1
      objets = []
      objets.push(pol[0]) //, pol[1]
      objets.push(droite(A, B), segment(B, E), droite(A, C), segment(D, C), labelPoint(A, B, C, D, E))
      objets.push(texteParPosition(`${stringNombre(a)}`, milieu(A, B).x, milieu(A, B).y + 0.4),
        texteParPosition(`${stringNombre(k * b)}`, milieu(D, C).x + 0.6, milieu(D, C).y + 0.2),
        texteParPosition(`${stringNombre(b)}`, milieu(B, E).x + 0.6, milieu(B, E).y + 0.2))
      this.question = `Les droites $(${nom[1]}${nom[4]})$ et $(${nom[3]}${nom[2]})$ sont parallèles. <br>

       Calculer $${nom[0]}${nom[3]}$.<br>
       
       `
      this.question += mathalea2d({ xmin, ymin, xmax, ymax, pixelsParCm: 15, mainlevee: false, amplitude: 0.5, scale: 0.5, style: 'margin: auto' }, objets)
      this.correction = ` Le triangle $${nom[0]}${nom[3]}${nom[2]}$ est un agrandissement du triangle $${nom[0]}${nom[3]}${nom[2]}$.<br>
   Le coefficient d'agrandissement est  donné par : $\\dfrac{${nom[2]}${nom[3]}}{${nom[1]}${nom[4]}}=\\dfrac{${texNombrec(k * b)}}{${b}}=${texNombrec(k)}$.<br>
   On en déduit que les longueurs du triangle $${nom[0]}${nom[3]}${nom[2]}$ sont $${texNombrec(k)}$ fois plus grandes que celles du triangle $${nom[0]}${nom[1]}${nom[4]}$. <br>
       Ainsi, $${nom[0]}${nom[3]}=${texNombrec(k)}\\times ${nom[0]}${nom[1]}=${texNombrec(k)}\\times ${a}=${texNombrec(k * a)}$.
                 <br>`
      this.reponse = calcul(k * a)
      this.canEnonce = this.question// 'Compléter'
      this.canReponseACompleter = `$${nom[0]}${nom[3]}=\\ldots$`
    }
  }
}
