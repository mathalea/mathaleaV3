import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, creerCouples, choice, combinaisonListes, contraindreValeur, rangeMinMax, randint } from '../../modules/outils.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
export const titre = 'Tables de divisions'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum' // Question numérique

/**
 * Tables de divisions classiques, à trou ou un mélange des deux.
 *
 * Par défaut ce sont les tables de 2 à 9 mais on peut choisir les tables que l'on veut
 * @author Rémi Angot
* Référence CM002
  */
export const uuid = '77511'
export const ref = 'CM002'
export default function TablesDeDivisions (tablesParDefaut = '2-3-4-5-6-7-8-9') {
  // Diviser deux nombres
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = tablesParDefaut
  this.sup2 = 1 // classique|a_trous|melange
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.tailleDiaporama = 3

  this.nouvelleVersion = function () {
    this.sup2 = parseInt(this.sup2)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    if (!this.sup) {
      // Si aucune table n'est saisie
      this.sup = '2-3-4-5-6-7-8-9'
    }
    let tables = []
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
        // this.nbQuestions = Math.max(this.nbQuestions, QuestionsDisponibles.length)
      }
    }
    const couples = creerCouples(
      tables,
      [2, 3, 4, 5, 6, 7, 8, 9, 10],
      this.nbQuestions
    ) // Liste tous les couples possibles (2,3)≠(3,2)
    const listeTypeDeQuestions = combinaisonListes(
      ['classique', 'a_trous'],
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    let typeDeQuestions = 'a_trous'
    for (let i = 0, cpt = 0, a, b, texte, texteCorr; i < this.nbQuestions && cpt < 50; cpt++) {
      a = couples[i][0]
      b = couples[i][1]
      if (parseInt(this.sup2) === 1) {
        typeDeQuestions = 'classique'
      } else if (parseInt(this.sup2) === 2) {
        typeDeQuestions = 'a_trous'
      } else {
        typeDeQuestions = listeTypeDeQuestions[i]
      }
      if (typeDeQuestions === 'classique') {
        // classique
        texte = '$ ' + a * b + ' \\div ' + a + ' =$'
        if (this.interactif && context.isHtml) texte = `$ ${a * b} \\div ${a} = $` + ajouteChampTexteMathLive(this, i, 'largeur15 inline')
        setReponse(this, i, b)
      } else {
        // a trous
        if (choice([true, false])) {
          texte = `$ ${a * b} \\div \\ldots\\ldots = ${b}$`
          if (this.interactif && context.isHtml) texte = `$ ${a * b} \\div $` + ajouteChampTexteMathLive(this, i, 'largeur15 inline') + `$ = ${b} $`
          setReponse(this, i, a)
        } else {
          texte = `$ \\ldots\\ldots \\div ${a}  = ${b}$`
          if (this.interactif && context.isHtml) texte = ajouteChampTexteMathLive(this, i, 'largeur15 inline') + `$ \\div ${b} = ${a} $`
          setReponse(this, i, a * b)
        }
      }
      texteCorr = `$ ${a * b} \\div ${a} = ${b}$`
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
  this.besoinFormulaireTexte = [
    'Choix des tables',
    'Nombres séparés par des tirets'
  ] // Texte, tooltip
  this.besoinFormulaire2Numerique = [
    'Style de questions',
    3,
    '1 : Classique\n2: À trous\n3: Mélangé'
  ]
}
