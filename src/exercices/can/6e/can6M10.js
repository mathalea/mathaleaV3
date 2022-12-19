import { pave } from '../../../modules/2d.js'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
export const titre = 'Volume de pavé droit'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '04/07/2022'

/*!
 * @author Jean-Claude Lhote
 *
 * Référence can6M10
 */
export const uuid = 'f8019'
export const ref = 'can6M10'
export default function VolumePaveSimple () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.sup = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const l = randint(2, 5)
    const L = randint(2, 4)
    const h = randint(2, 6, [l, L])
    const pav = pave(L, l, h)
    this.question = `L'unité de longueur est le centimètre. Quel est le volume du pavé droit ci-dessous ?<br>
  ${mathalea2d({ xmin: -2, ymin: -2, xmax: 10, ymax: h + l * 0.5, scale: 0.8 }, pav)}`
    this.reponse = L * l * h
    this.correction = `Le volume de ce pavé droit est : $${L}$ $\\text{cm}\\times ${l}$ $\\text{cm}\\times ${h}$ $\\text{cm}=${this.reponse}$ $\\text{cm}^3$.`
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dots$ cm$^3$'
  }
}
