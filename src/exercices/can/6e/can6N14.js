import Exercice from '../../Exercice.js'
import { listeQuestionsToContenu, randint, choice, texNombrec } from '../../../modules/outils.js'
import { propositionsQcm } from '../../../modules/interactif/questionQcm.js'
export const titre = 'Déterminer un nombre à partir de son nombre de dixièmes, centièmes, millièmes (QCM)'
export const interactifReady = true
export const interactifType = 'qcm'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '05/03/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export const uuid = 'dcf22'
export const ref = 'can6N14'
export default function DeterminerLeNombre () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.spacing = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []

    let texte, texteCorr, a, monQcm

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (choice([1, 2, 3])) { // 1
        case 1 :

          a = choice([randint(10, 99), randint(100, 999), randint(1000, 2000), randint(1, 9)])
          texte = `Quel est le nombre égal à $${a}$ dixièmes ?
          `
          this.canEnonce = texte
          this.autoCorrection[i] = {
            enonce: texte,
            options: { horizontal: true },
            propositions: [
              {
                texte: `$${texNombrec(a / 10)}$`,
                statut: true
              },
              {
                texte: `$${texNombrec(a * 10)}$`,
                statut: false
              },
              {
                texte: `$${texNombrec(a / 100)}$`,
                statut: false
              },
              {
                texte: `$${texNombrec(a / 1000)}$`,
                statut: false
              }
            ]
          }
          monQcm = propositionsQcm(this, i)
          texte += monQcm.texte
          texteCorr = ` $1$ dixième est égal à $0,1$. <br>
          Ainsi, $${a}$ dixièmes $=${a}\\times 0,1=${texNombrec(a / 10)}$. `

          break
        case 2 :

          a = choice([randint(10, 99), randint(100, 999), randint(1000, 2000), randint(1, 9)])
          texte = `Quel est le nombre égal à $${a}$ centièmes ?
          `
          this.canEnonce = texte
          this.autoCorrection[i] = {
            enonce: texte,
            options: { horizontal: true },
            propositions: [
              {
                texte: `$${texNombrec(a / 100)}$`,
                statut: true
              },
              {
                texte: `$${texNombrec(a * 100)}$`,
                statut: false
              },
              {
                texte: `$${texNombrec(a / 1000)}$`,
                statut: false
              },
              {
                texte: `$${texNombrec(a / 10000)}$`,
                statut: false
              }
            ]
          }
          monQcm = propositionsQcm(this, i)
          texte += monQcm.texte
          texteCorr = ` $1$ centième est égal à $0,01$. <br>
          Ainsi, $${a}$ centièmes $=${a}\\times 0,01=${texNombrec(a / 100)}$. `
          break

        case 3 :

          a = choice([randint(10, 99), randint(100, 999), randint(1000, 2000), randint(1, 9)])
          texte = `Quel est le nombre égal à $${a}$ millièmes ?
          `
          this.canEnonce = texte

          this.autoCorrection[i] = {
            enonce: texte,
            options: { horizontal: true },
            propositions: [
              {
                texte: `$${texNombrec(a / 1000)}$`,
                statut: true
              },
              {
                texte: `$${texNombrec(a / 10000)}$`,
                statut: false
              },
              {
                texte: `$${texNombrec(a / 100)}$`,
                statut: false
              },
              {
                texte: `$${texNombrec(a / 10)}$`,
                statut: false
              }
            ]
          }
          monQcm = propositionsQcm(this, i)
          texte += monQcm.texte
          texteCorr = ` $1$ millième est égal à $0,001$. <br>
          Ainsi, $${a}$ millièmes $=${a}\\times 0,001=${texNombrec(a / 1000)}$. `
          break
      }

      if (this.questionJamaisPosee(i, a)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    this.canReponseACompleter = monQcm.texte
  }
}
