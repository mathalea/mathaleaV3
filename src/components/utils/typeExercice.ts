class Exercice {
  titre?: string
  id?: string
  uuid?: string
  sup?: boolean | string | number
  sup2?: boolean | string | number
  sup3?: boolean | string | number
  sup4?: boolean | string | number
  nouvelleVersion?: (numeroExercice?: number) => void
  correctionInteractive?: (i?: number) => string
  questionJamaisPosee?: (i: number, question: string) => boolean
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
  question?: string // Seulement pour les exercices de type simple
  reponse?: string // Seulement pour les exercices de type simple
  correction?: string // Seulement pour les exercices de type simple
  canEnonce?: string // Seulement pour les exercices de type simple
  canReponseACompleter?: string // Seulement pour les exercices de type simple
  formatChampTexte?: string // Seulement pour les exercices de type simple
  optionsChampTexte?: object // Seulement pour les exercices de type simple
  formatInteractif?: string
  contenu?: string
  contenuCorrection?: string
  autoCorrection?: object[]
  amcType?: string
  tableauSolutionsDuQcm?: object[]
  spacing?: number
  spacingCorr?: number
  pasDeVersionLatex?: boolean
  listePackages?: string[]
  consigneModifiable?: boolean
  nbQuestionsModifiable?: boolean
  nbCols?: number // Nombre de colonnes pour la sortie LaTeX
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
  examen?: string // Pour les exercices statiques
  mois?: string // Pour les exercices statiques
  annee?: string // Pour les exercices statiques
  lieu?: string // Pour les exercices statiques
  content?: string // Pour les exercices statiques
  contentCorr?: string // Pour les exercices statiques
  comment?: string // Commentaire facultatif de l'auteur de l'exercice
  answers?: string[]
  applyNewSeed: () => void
}

export default Exercice
