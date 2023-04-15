import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, creerCouples, randint, choice, texNombre, texNombre2, calcul, contraindreValeur, rangeMinMax } from '../../modules/outils.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import { propositionsQcm } from '../../modules/interactif/questionQcm.js'
export const amcReady = true
export const amcType = 'qcmMono' // type de question AMC
export const interactifReady = true
export const interactifType = ['qcm', 'mathLive']

export const titre = 'Utiliser tables de multiplication pour effectuer produits avec multiple de 10'

/**
 * Les 2 facteurs peuvent terminer par aucun, 1, 2 ou 3 zéros
 * @author Rémi Angot
* Référence 6C10-2
 */
export const uuid = '23bc8'
export const ref = '6C10-2'
export default function ExerciceTablesMultiplicationsEtMultiplesDe10 (
  tablesParDefaut = '2-3-4-5-6-7-8-9'
) {
  // Multiplier deux nombres
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = tablesParDefaut
  this.sup2 = 1
  this.titre = titre
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.tailleDiaporama = 3

  this.nouvelleVersion = function () {
    this.interactifType = parseInt(this.sup2) === 2 ? 'mathLive' : 'qcm'
    this.autoCorrection = []
    let tables = []
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    if (!this.sup) {
      // Si aucune table n'est saisie
      this.sup = '2-3-4-5-6-7-8-9'
    }
    /*
    if (typeof this.sup === 'number') {
      // Si c'est un nombre c'est qu'il y a qu'une seule table
      tables[0] = this.sup
    } else {
      tables = this.sup.split('-') // Sinon on crée un tableau à partir des valeurs séparées par des ;
      for (let i = 0; i < tables.length; i++) {
        tables[i] = contraindreValeur(2, 9, parseInt(tables[i]))
      }
    }
    */
    if (!this.sup) { // Si aucune liste n'est saisie
      tables[0] = rangeMinMax(2, 9)
    } else {
      if (typeof (this.sup) === 'number') { // Si c'est un nombre c'est que le nombre a été saisi dans la barre d'adresses
        tables = [contraindreValeur(2, 9, this.sup, randint(2, 9))]
      } else {
        tables = this.sup.split('-')// Sinon on créé un tableau à partir des valeurs séparées par des -
        for (let i = 0; i < tables.length; i++) { // on a un tableau avec des strings : ['1', '1', '2']
          tables[i] = contraindreValeur(2, 9, parseInt(tables[i]), 9) // parseInt en fait un tableau d'entiers
        }
      }
    }

    const couples = creerCouples(
      tables,
      [2, 3, 4, 5, 6, 7, 8, 9, 10],
      this.nbQuestions
    ) // Liste tous les couples possibles (2,3)≠(3,2)
    for (
      let i = 0, cpt = 0, a, b, k1, k2, texte, texteCorr, melange;
      i < this.nbQuestions && cpt < 100;) {
      this.autoCorrection[i] = {}
      a = couples[i][0]
      b = couples[i][1]
      if (a > 1) {
        k1 = choice([1, 10, 100, 1000])
      } else {
        k1 = choice([10, 100, 1000])
      }
      k2 = choice([1, 10, 100, 1000])
      a = k1 * a
      b = k2 * b
      melange = randint(0, 1)
      if (melange === 1) {
        // échange a et b pour que les multiplications ne soient pas toujours dans le même ordre (surtout lorsque tables n'a qu'un seul élément)
        const c = a
        a = b
        b = c
      }
      texte =
        '$ ' + texNombre(a) + ' \\times ' + texNombre(b) + ' =  $'
      texteCorr =
        '$ ' +
        texNombre(a) +
        ' \\times ' +
        texNombre(b) +
        ' = ' +
        texNombre(a * b) +
        ' $'

      this.autoCorrection[i].enonce = `${texte}\n`
      this.autoCorrection[i].propositions = [
        {
          texte: `$${texNombre2(a * b)}$`,
          statut: true,
          feedback: 'Correct !'
        },
        {
          texte: `$${texNombre2(calcul(a * b / 10))}$`,
          statut: false,
          feedback: 'Compte le nombre de zéros dans chaque facteur'
        },
        {
          texte: `$${texNombre2(calcul(a * b * 10))}$`,
          statut: false,
          feedback: 'Compte le nombre de zéros dans chaque facteur'
        },
        {
          texte: `$${texNombre2(calcul(a * b / 100))}$`,
          statut: false,
          feedback: 'Compte le nombre de zéros dans chaque facteur'
        },
        {
          texte: `$${texNombre2(calcul(a * b * 100))}$`,
          statut: false,
          feedback: 'Compte le nombre de zéros dans chaque facteur'
        }
      ]
      this.autoCorrection[i].options = {
        ordered: false,
        lastChoice: 5
      }
      if (this.interactif && this.interactifType === 'qcm') {
        texte += propositionsQcm(this, i).texte
      } else {
        texte += ajouteChampTexteMathLive(this, i)
        setReponse(this, i, a * b)
      }
      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      } else {
        cpt++
      }
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Choix des tables', 'Nombres séparés par des tirets'] // Texte, tooltip
  if (context.isHtml) this.besoinFormulaire2Numerique = ['Exercice interactif', 2, '1 : QCM\n2 : Numérique'] // Texte, tooltip
}
