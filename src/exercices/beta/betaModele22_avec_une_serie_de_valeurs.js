import { formTextSerializer, listeQuestionsToContenu } from '../../modules/outils.js'
import Exercice from '../Exercice.js'

export const titre = 'Nom de l\'exercice'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '25/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Description didactique de l'exercice
 * @author
 * Référence
 */
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.consigne = 'Consigne'
    this.nbQuestions = 10
    
    this.besoinFormulaireTexte = ['Choix des problèmes', 'Nombres séparés par des tirets\n1 : Fleuriste\n2 : Professeur\n3 : Boulanger\n4 : Mélange']
    this.sup = '1-1-2-3'
    
    this.nbCols = 2
    this.nbColsCorr = 2
    this.tailleDiaporama = 3
    this.video = ''
  }
  
  nouvelleVersion (numeroExercice) {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    
    const typeQuestionsDisponibles = ['type1', 'type2', 'type3']
    const listeTypeQuestions = formTextSerializer( // retourne une liste de choix pour les questions à partir du paramètre saisie
      {
        saisie: this.sup ?? '1-2-3',
        min: 1,
        max: 3,
        random: 4, // si renseigné indique que le choix 4 signifie un choix aléatoire entre min et max
        listeOfCase: typeQuestionsDisponibles, // si cette liste est fournie, la fonction retournera des valeurs de la liste, sinon des nombres
        nbQuestions: this.nbQuestions,
        shuffle: true, // la liste est brassée, si false, l'ordre des choix correspond à la saisie
        defaut: 1 // si dans la saisie, une valeur est invalide, ce sera cette valeur
      }
    )
    
    for (let i = 0, texte, texteCorr, typeDeProbleme, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (listeTypeQuestions[i] === 'type1') { // On ajuste le type de problème selon le paramètre.
        typeDeProbleme = 'fleuriste'
      } else if (listeTypeQuestions[i] === 'type2') {
        typeDeProbleme = 'professeur'
      } else if (listeTypeQuestions[i] === 'type3') {
        typeDeProbleme = 'boulanger'
      } else {
        window.notify('listeDesProblemes[i] a une valeur inattendue.\nPeut-être que valMaxParametre est incorrect ?')
      }
      switch (listeTypeQuestions[i]) {
        case 'type1':
          texte = `Problème de ${typeDeProbleme} ${i + 1} de type 1`
          texteCorr = `Correction ${i + 1} de type 1`
          break
        case 'type2':
          texte = `Problème de ${typeDeProbleme} ${i + 1} de type 2`
          texteCorr = `Correction ${i + 1} de type 2`
          break
        case 'type3':
          texte = `Problème de ${typeDeProbleme} ${i + 1} de type 3`
          texteCorr = `Correction ${i + 1} de type 3`
          break
      }
      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
