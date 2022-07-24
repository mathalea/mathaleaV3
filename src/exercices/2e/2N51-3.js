import EqResolvantesThales from '../3e/3L13-2.js'
export const titre = 'Equations du type $\\dfrac{x}{a}=\\dfrac{b}{c}$'
// export { interactifReady, interactifType } from '../3e/3L13-2.js'
// export { amcReady, amcType } from '../3e/3L13-2.js'

/**
 * Clone de 3L13-2 version déclinée 4L15-1 pour les 2nde
 *
 * @author Sébastien LOZANO
 */
export default function EqResolvantesThales2nde () {
  EqResolvantesThales.call(this)
  this.exo = '4L15-1'
  this.sup = 1
}
