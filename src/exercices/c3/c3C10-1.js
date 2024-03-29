import TablesDeMultiplications from '../6e/_Tables_de_multiplications.js'
export const titre = 'Tables de multiplication'
export { interactifReady, interactifType, amcReady, amcType } from '../6e/_Tables_de_multiplications.js'

/**
 * Lire des nombres déciamux sur une portion de droite graduée
 * Une question demande la forme décimale, une autre, la partie entière plus la fraction décimale, et une troisième demande une seule fraction décimale.
 * ref 6N23-2
 *
 * @author Jean-Claude Lhote
 */
export const uuid = '4e27f'
export const ref = 'c3C10-1'
export default class TablesDeMultiplicationsCM extends TablesDeMultiplications {
  constructor () {
    super()
    this.sup2 = 1
  }
}
