import ExercicePerimetresEtAires from './_Exercice_perimetres_et_aires.js'

export const titre = 'Calculer périmètre et aire de disques'
export { interactifReady, interactifType, amcReady, amcType } from './_Exercice_perimetres_et_aires.js'

/** */
// Référence 6M22
export const uuid = 'ac571'
export const ref = '6M22'
export default function Reglages6M22 () {
  ExercicePerimetresEtAires.call(this)
  this.titre = titre
  this.sup = '4-5'
  this.besoinFormulaireTexte = false
}
