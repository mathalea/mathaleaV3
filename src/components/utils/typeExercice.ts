type Exercice = {
  titre?: string
  id?: string
  uuid?: string
  sup?: boolean | string | number
  sup2?: boolean | string | number
  sup3?: boolean | string | number
  sup4?: boolean | string | number
  nouvelleVersion?: (numeroExercice?: number) => void
  correctionInteractive?: (i?: number) => string
  seed?: string
  numeroExercice?: number
  typeExercice?: string
  duration?: number
  boutonAide?: boolean | HTMLButtonElement
  consigne?: string
  consigneCorrection?: string
  introduction?: string
  listeQuestions?: string[]
  listeCorrections?: string[]
  listeCanReponsesACompleter?: string[]
  listeCanEnonces?: string[]
  contenu?: string
  contenuCorrection?: string
  autoCorrection?: object[]
  tableauSolutionsDuQcm?: object[]
  spacing?: number
  spacingCorr?: number
  pasDeVersionLatex?: boolean
  listePackages?: string[]
  consigneModifiable?: boolean
  nbQuestionsModifiable?: boolean
  nbCols?: number
  nbColsCorr?: number
  nbColsModifiable?: boolean
  nbColsCorrModifiable?: boolean
  spacingModifiable?: boolean
  spacingCorrModifiable?: boolean
  beamer?: boolean
  tailleDiaporama?: number
  nbQuestions?: number
  pointsParQuestions?: number
  correctionDetailleeDisponible?: boolean
  correctionDetaillee?: boolean
  correctionIsCachee?: boolean
  video?: string
  interactif?: boolean
  interactifObligatoire?: boolean
  interactifReady?: boolean
  interactifType?: string
  besoinFormulaireNumerique?: boolean | any[]
  besoinFormulaireTexte?: boolean | any[]
  besoinFormulaireCaseACocher?: boolean | any[]
  besoinFormulaire2Numerique?: boolean | any[]
  besoinFormulaire2Texte?: boolean | any[]
  besoinFormulaire2CaseACocher?: boolean | any[]
  besoinFormulaire3Numerique?: boolean | any[]
  besoinFormulaire3Texte?: boolean | any[]
  besoinFormulaire3CaseACocher?: boolean | any[]
  besoinFormulaire4Numerique?: boolean | any[]
  besoinFormulaire4Texte?: boolean | any[]
  besoinFormulaire4CaseACocher?: boolean | any[]
  mg32Editable?: boolean
  listeArguments?: string[] // Variable servant à comparer les exercices pour ne pas avoir deux exercices identiques
}

export default Exercice
