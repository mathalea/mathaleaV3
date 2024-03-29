import problemesTrigoLongueur from '../3e/3G32-0.js'
export const titre = "Calculer la largeur d'une rivière"
export { interactifReady, interactifType } from '../3e/3G32-0.js'
export { amcReady, amcType } from '../3e/3G32-0.js'

/**
 * @author Guillaume Valmont
 * reference 3G32
 */
export const uuid = '95adb'
export const ref = '3G32'
export default function CalculHauteurMontagne () {
  problemesTrigoLongueur.call(this)
  this.titre = titre
  this.sup2 = 1
  this.besoinFormulaireCaseACocher = false
}
