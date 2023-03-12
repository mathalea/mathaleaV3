import { fraction } from '../../../modules/fractions.js'
import Exercice from '../../Exercice.js'
import { randint, rienSi1, ecritureParentheseSiNegatif, choice, texteEnCouleur, reduireAxPlusB, sp, listeQuestionsToContenuSansNumero } from '../../../modules/outils.js'
import { propositionsQcm } from '../../../modules/interactif/questionQcm.js'
export const titre = 'Déterminer le signe d’une fonction affine (V/F)'
export const interactifReady = true
export const interactifType = 'qcm'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can2F03
 * Date de publication 24/10/2021
*/
export const uuid = '03b1d'
export const ref = 'can2F03'
export default function SigneFonctionAffine () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.date = 1635094684684
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    let texte, texteCorr, monQcm, a, b, n, maFraction
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (choice(['a', 'b'])) { //, 'b'
        case 'a':
          a = randint(-5, 5, 0)
          n = randint(2, 7) * choice([-1, 1])
          b = n * a
          maFraction = fraction(-b, a)
          texte = `$${reduireAxPlusB(a, b)}$ est strictement positif pour $x>${maFraction.texFractionSimplifiee}$ .<br>`
          this.canEnonce = texte
          this.autoCorrection[i] = {
            enonce: texte,
            propositions: [
              {
                texte: 'V',
                statut: a > 0
              },
              {
                texte: 'F',
                statut: a < 0
              }
            ],
            options: { ordered: true }
          }
          monQcm = propositionsQcm(this, i)
          texte += monQcm.texte
          if (a > 0) {
            texteCorr = monQcm.texteCorr + `<br>$${reduireAxPlusB(a, b)}>0$.<br>
            En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
            $${rienSi1(a)}x>${-b}$<br>
            En divisant par $${a}$ dans chaque membre, on obtient :<br>
            $x>${maFraction.texFractionSimplifiee}$.`
          } else {
            texteCorr = monQcm.texteCorr + `<br>$${reduireAxPlusB(a, b)}>0$.<br>
            En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
            $${rienSi1(a)}x>${-b}$<br>
            En divisant par $(${a})$ dans chaque membre, on obtient :<br>
            $x$${texteEnCouleur('$<$')}$${maFraction.texFractionSimplifiee}$ ${sp(3)} 
            ${texteEnCouleur('(quand on divise par un nombre strictement négatif, on change le sens de l’inégalité).')}
            
            `
          }

          break
        case 'b':

          a = randint(-5, 5, 0)
          n = randint(2, 7) * choice([-1, 1])
          b = n * a
          maFraction = fraction(-b, a)
          texte = `$${reduireAxPlusB(a, b)}$ est strictement positif pour $x<${maFraction.texFractionSimplifiee}$ .<br>`
          this.canEnonce = texte
          this.autoCorrection[i] = {
            enonce: texte,
            propositions: [
              {
                texte: 'V',
                statut: a < 0
              },
              {
                texte: 'F',
                statut: a > 0
              }
            ],
            options: { ordered: true }
          }
          monQcm = propositionsQcm(this, i)
          texte += monQcm.texte
          if (a < 0) {
            texteCorr = monQcm.texteCorr + `<br>$${reduireAxPlusB(a, b)}>0$.<br>
              En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
              $${rienSi1(a)}x>${-b}$<br>
              En divisant par $(${a})$ dans chaque membre, on obtient :<br>
              $x$${texteEnCouleur('$<$')}$${maFraction.texFractionSimplifiee}$ ${sp(3)} 
              ${texteEnCouleur('(quand on divise par un nombre strictement négatif, on change le sens de l’inégalité).')}
             `
          } else {
            texteCorr = monQcm.texteCorr + `<br>$${reduireAxPlusB(a, b)}>0$.<br>
              En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
              $${rienSi1(a)}x>${-b}$<br>
              En divisant par $${a}$ dans chaque membre, on obtient :<br>
              $x>${maFraction.texFractionSimplifiee}$.         
              
              `
          }

          break
      }
      if (this.questionJamaisPosee(i, a, b, n)) {
        // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.canReponseACompleter = monQcm.texte
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
}
