import TransformationsDuPlanEtCoordonnees from '../3e/3G10-1.js'
export const titre = 'Trouver les coordonnée de l\'image d\'un point par une symétrie centrale'
export { interactifReady, interactifType, amcReady, amcType } from '../3e/3G10-1.js'
export const dateDePublication = '28/10/2021'
/**
 * Transformations : symétrie centrale et repérage
 * @author Jean-Claude Lhote
 * référence 5G11-4 réglage de 3G10-1
 */
export default function TransformationsDuPlanEtCoordonnees5e () {
  TransformationsDuPlanEtCoordonnees.call(this)
  this.sup = 2
  this.sup2 = true
  this.besoinFormulaire = false
  this.besoinFormulaire2 = false
}
