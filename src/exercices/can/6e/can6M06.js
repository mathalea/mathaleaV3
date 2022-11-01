import { creerNomDePolygone, randint, texNombre, texteEnCouleur, stringNombre } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import {
  tracePoint, point, milieu, texteParPosition, pointAdistance, longueur, cercle, pointIntersectionCC, polygoneAvecNom
} from '../../../modules/2d.js'
import Decimal from 'decimal.js/decimal.mjs'
export const titre = 'Calculer le périmètre d’une figure'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Gilles Mora
 * Créé pendant l'été 2021
 * Référence can6M06
 */
export const uuid = 'e52ba'
export const ref = 'can6M06'
export default function Perimetre () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1

  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const nom = creerNomDePolygone(4, ['QD'])
    const a = randint(3, 6)//
    const c = (new Decimal(randint(3, 5) * 10 + randint(3, 9))).div(10)
    const A = point(0, 0, nom[0])
    const B = pointAdistance(A, c, 0, nom[1])
    const C = pointAdistance(B, a, randint(7, 11) * 10, nom[2])
    const l = Math.ceil(longueur(A, C) + 1)
    const b = Math.floor(l / 2)
    const d = l - b - c + Math.floor(c)
    const c1 = cercle(C, d)
    const c2 = cercle(A, b)
    const D = pointIntersectionCC(c1, c2, nom[3], 1)
    const objets = []
    const xmin = Math.min(A.x, B.x, C.x, D.x) - 1.5
    const ymin = Math.min(A.y, B.y, C.y, D.y) - 1.5
    const xmax = Math.max(A.x, B.x, C.x, D.x) + 1.5
    const ymax = Math.max(A.y, B.y, C.y, D.y) + 1.5
    const pol = polygoneAvecNom(A, B, C, D) // polygoneAvecNom s'occupe du placement des noms des sommets
    const reponse = new Decimal(a).add(b).add(c).add(d)
    objets.push(pol[0], pol[1], tracePoint(A, B, C, D)) // pol[0], c'est le tracé et pol[1] ce sont les labels
    objets.push(texteParPosition(`${stringNombre(b)} m`, milieu(A, D).x - 0.8, milieu(A, D).y),
      texteParPosition(`${stringNombre(a)} m`, milieu(B, C).x + 0.8, milieu(B, C).y),
      texteParPosition(`${stringNombre(c)} m`, milieu(A, B).x, milieu(A, B).y - 0.6),
      texteParPosition(`${stringNombre(d)} m`, milieu(C, D).x, milieu(C, D).y + 0.5))

    this.question = `Quel est le périmètre du quadrilatère $${nom}$ ?<br>

    ` +
     mathalea2d({ xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax, pixelsParCm: 20, mainlevee: true, amplitude: 0.5, scale: 0.6, style: 'margin: auto' }, objets)
    this.reponse = reponse
    this.correction = ` Le périmètre est : $${texNombre(reponse, 1)}$ m. `
    this.optionsChampTexte = { texteApres: ' m' }
    this.correction += texteEnCouleur(`<br> Mentalement : <br>
   On doit calculer la somme des valeurs. On regroupe pour faciliter le calcul : <br>
   $\\underbrace{${texNombre(a, 1)}+${texNombre(b, 1)}}_{${texNombre(a + b, 1)}}+\\underbrace{${texNombre(c, 1)}+${texNombre(d, 1)}}_{${texNombre(new Decimal(c).add(d), 1)}}=${texNombre(reponse, 1)}$ m.`)
    this.canEnonce = this.question
    this.canReponseACompleter = ' $\\dots$ m'
  }
}
