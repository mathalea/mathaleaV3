import CalculDeVolumes from '../6e/6M30.js'
export const titre = 'Calculs de volumes'
export { interactifReady, interactifType, amcReady, amcType } from '../6e/6M30.js'

/**
 * Clone de 6M30 pour les 2nde
 *
 * @author Sébastien LOZANO
 */
export const uuid = '65bed'
export const ref = '2G11-5'
export default function CalculDeVolumes2nde () {
  CalculDeVolumes.call(this)
  this.titre = titre
  this.sup = 1
  this.classe = 3
  this.besoinFormulaire4Texte = ['Type de solides', 'Nombres séparés par des tirets\n1  : Cubes\n2 : Pavés droits\n3 : Cylindres\n4 : Prismes droits\n5 : Cônes\n6 : Pyramides\n7 : Boules\n8: Mélange']
}
