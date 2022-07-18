import EcrireUneExpressionNumerique from './_Ecrire_une_expression_numerique.js'

export const titre = 'Traduire une phrase par une expression'

/**
 * @author Jean-Claude Lhote
 * Référence 5L10-1
 */
export const uuid = '98185'
export const ref = '5L10-1'
export default function TraduireUnePhraseParUneExpressionLitterale () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 1
  this.titre = titre
  this.sup = false
  this.sup2 = false
  this.litteral = true
}
