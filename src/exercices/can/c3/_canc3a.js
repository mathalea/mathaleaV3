import { mathalea2d, fixeBordures, colorToLatexOrHTML } from '../../../modules/2dGeneralites.js'
import FractionX from '../../../modules/FractionEtendue.js'
import { fraction } from '../../../modules/fractions.js'
import {
  point, grille, droiteGraduee, plot, segment, milieu, segmentAvecExtremites, labelPoint, texteParPosition, polygoneAvecNom, polygone
} from '../../../modules/2d.js'
import { round, min } from 'mathjs'
import { context } from '../../../modules/context.js'
import Hms from '../../../modules/Hms.js'
import { listeQuestionsToContenu, miseEnEvidence, stringNombre, randint, texNombre, prenomF, prenomM, texPrix, shuffle, choice, sp, arrondi, texteEnCouleur } from '../../../modules/outils.js'
import Grandeur from '../../../modules/Grandeur.js'
import { ajouteChampTexteMathLive } from '../../../modules/interactif/questionMathLive.js'

import Decimal from 'decimal.js'
export const titre = 'Classe CAN C3'

/**
 * Essai de classe Can
 * @author Sébastien LOZANO
*/

export default class ClasseCan2023 {
  compareNombres (a, b) {
    return a - b
  }

  /**
   * Méthode pour la question produit de deux facteurs entiers
   * @param {number} minFacteur0 min pour le premier facteur
   * @param {number} maxFacteur0 max pour le premier facteur
   * @param {number} minFacteur1 min pour le second facteur
   * @param {number} maxFacteur1 max pour le second facteur
   * @returns {object}
   * @author Sébastien LOZANO
   */

  produitDeDeuxFacteurs (minFacteur0, maxFacteur0, minFacteur1, maxFacteur1) {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    const a = randint(minFacteur0, maxFacteur0)
    const b = randint(minFacteur1, maxFacteur1)
    sortie.texte = `$${a} \\times ${b}${context.isHtml ? '=' : ''}$`
    sortie.texteCorr = `$${a} \\times ${b}=${miseEnEvidence(a * b)}$`
    sortie.reponse = a * b
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = ''
    return sortie
  }

  /**
   * Méthode pour ajouter une dizaine moins un
   * @returns {object}
   * @author Sébastien LOZANO
   */

  ajouterDizaineMoinsUn () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    const a = randint(23, 38, [20, 30, 31, 29])
    const b = choice([19, 29, 39])

    sortie.texte = `$${a}+${b}${context.isHtml ? '=' : ''}$`
    sortie.reponse = a + b
    if (b === 19) { sortie.texteCorr = `$${a}+${b}=${a}+20-1=${a + 20}-1=${miseEnEvidence(sortie.reponse)}$` }
    if (b === 29) { sortie.texteCorr = `$${a}+${b}=${a}+30-1=${a + 30}-1=${miseEnEvidence(sortie.reponse)}$` }
    if (b === 39) { sortie.texteCorr = `$${a}+${b}=${a}+40-1=${a + 40}-1=${miseEnEvidence(sortie.reponse)}$` }
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = ''
    return sortie
  }

  /**
   * Méthode pour dénombrer les éléments d'un rectangle
   * @returns {object}
   * @author Sébastien LOZANO
   */

  denombrementProduit () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    const k = randint(5, 8)
    const b = randint(2, 5) * k
    let c = []
    for (let n = 0; n < b; n++) {
      c.push(true)
    }
    c = shuffle(c)
    const d = []
    for (let n = 0; n < b; n++) {
      d.push(plot(n % k, -Math.floor(n / k), { rayon: 0.2, couleur: 'black', couleurDeRemplissage: 'black' }))
    }
    sortie.texte = 'Combien y a-t-il de boules noires ? <br> \n'

    sortie.texte += `${mathalea2d(Object.assign({ scale: 0.3 }, fixeBordures(d)), d)}`
    sortie.reponse = b
    sortie.texteCorr = `Le nombre de boules noires est donné par : $${k}\\times ${texNombre(b / k, 0)}=${miseEnEvidence(b)}$.`
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = '\\dots{} boules'
    return sortie
  }

  /**
   * Méthode pour calucler la moitié ou le double
   * @returns {object}
   * @author Sébastien LOZANO
   */

  moitieDouble () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    let a
    if (choice([true, false])) {
      a = randint(11, 25, 20) * 2
      sortie.reponse = a / 2
      sortie.texte = `La moitié de $${a}$${context.isHtml ? ' est : ' : ''}`
      sortie.texteCorr = `La moitié de $${a}$ est $${a}\\div 2=${miseEnEvidence(a / 2)}$.`
    } else {
      a = randint(16, 45, [20, 30, 40])
      sortie.reponse = 2 * a
      sortie.texte = `Le double de $${a}$${context.isHtml ? ' est : ' : ''}`
      sortie.texteCorr = `Le double  de $${a}$ est $${a}\\times 2=${miseEnEvidence(a * 2)}$.`
    }
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = ''
    return sortie
  }

  /**
   * Méthode pour la lecture d'abscisse entière
   * @returns {object}
   * @author Sébastien LOZANO
   */
  lectureAbscisseEntiere () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    // Variables pour l'affichage LaTeX
    let pas, valeurOrigine, valeurUnitex, gradLaTeX
    let a, d, maListe
    if (choice([true, false])) {
      a = randint(42, 52, [40, 45, 50]) * 2 // choix de la produit = écart entre deux graduations
      pas = 5
      valeurOrigine = a - a % 10
      valeurUnitex = valeurOrigine + 10
      gradLaTeX = Math.floor(a % 10 / 2)
      d = droiteGraduee({
        Unite: 0.5,
        Min: 81,
        Max: 106,
        x: 0,
        y: 0,
        thickDistance: 10,
        thickSec: true,
        thickSecDist: 2,
        thickOffset: 0,
        axeStyle: '->',
        pointListe: [[a, '?']],
        labelListe: maListe,
        pointCouleur: 'blue',
        pointStyle: 'x',
        labelsPrincipaux: true
      })
    } else {
      a = choice([75, 85, 95, 105, 115])// choix de la produit = écart entre deux graduations
      pas = 2
      valeurOrigine = a - a % 10
      valeurUnitex = valeurOrigine + 10
      gradLaTeX = 1
      d = droiteGraduee({
        Unite: 0.25,
        Min: 71,
        Max: 116,
        x: 0,
        y: 0,
        thickDistance: 10,
        thickSec: true,
        thickSecDist: 5,
        thickOffset: 0,
        axeStyle: '->',
        pointListe: [[a, '?']],
        labelListe: maListe,
        pointCouleur: 'blue',
        pointStyle: 'x',
        labelsPrincipaux: true
      })
    }
    sortie.reponse = a
    sortie.texte = context.isHtml ? 'Quel est le nombre écrit sous le point d\'interrogation ?<br>\n' + mathalea2d({ xmin: -1, ymin: -1, xmax: 15, ymax: 1.5, scale: 0.6, style: 'margin: auto' }, d) + '\n' : `Complète \\\\ \\Reperage[ValeurOrigine=${valeurOrigine},ValeurUnitex=${valeurUnitex},Pasx=${pas},AffichageAbs=3,AffichageGrad]{${gradLaTeX}/A}`
    // texte += context.isHtml ? '' : '\\\\\\smallskip'
    sortie.texteCorr = `Le nombre écrit sous le point d'interrogation est : $${miseEnEvidence(a)}$.`
    sortie.canEnonce = 'Complète'
    sortie.canReponseACompleter = `\\Reperage[ValeurOrigine=${valeurOrigine},ValeurUnitex=${valeurUnitex},Pasx=${pas},AffichageAbs=3,AffichageGrad]{${gradLaTeX}/A}`
    return sortie
  }

  /**
   * Méthode pour déterminer deux facteurs d'un produit donné
   * @returns {object}
   * @author Sébastien LOZANO
   */

  trouverLesFacteursDUnProduit () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    function texteQ6 (valeurCible) {
      const sortie = { texte: '', reponseACompleter: '' }
      sortie.texte = `Complète : ${context.isHtml ? sp(3) : ''} $\\ldots \\times \\ldots =${valeurCible}$`
      sortie.reponseACompleter = `$\\ldots \\times \\ldots =${valeurCible}$`
      return sortie
    }
    const m = choice([1, 2, 3, 4])
    if (m === 1) {
      sortie.texte = texteQ6(18).texte
      sortie.canReponseACompleter = texteQ6(18).reponseACompleter
      sortie.reponse = ['3;6', '1;18', '2;9']
      sortie.texteCorr = `Trois réponses possibles (avec des entiers) : <br>
    $${miseEnEvidence(3)}\\times ${miseEnEvidence(6)}=18$<br>
    $${miseEnEvidence(2)}\\times ${miseEnEvidence(9)}=18$<br>
    $${miseEnEvidence(1)}\\times ${miseEnEvidence(18)}=18$ `
    }
    if (m === 2) {
      sortie.texte = texteQ6(21).texte
      sortie.canReponseACompleter = texteQ6(21).reponseACompleter
      sortie.reponse = ['3;7', '1;21']
      sortie.texteCorr = `Deux réponses possibles (avec des entiers) : <br>
      $${miseEnEvidence(3)}\\times ${miseEnEvidence(7)}=21$<br>
      $${miseEnEvidence(1)}\\times ${miseEnEvidence(21)}=21$ `
    }
    if (m === 3) {
      sortie.texte = texteQ6(35).texte
      sortie.canReponseACompleter = texteQ6(35).reponseACompleter
      sortie.reponse = ['5;7', '1;35']
      sortie.texteCorr = `Deux réponses possibles (avec des entiers) : <br>
        $${miseEnEvidence(5)}\\times ${miseEnEvidence(7)}=35$<br>
        $${miseEnEvidence(1)}\\times ${miseEnEvidence(35)}=35$ `
    }
    if (m === 4) {
      sortie.texte = texteQ6(42).texte
      sortie.canReponseACompleter = texteQ6(42).reponseACompleter
      sortie.reponse = ['6;7', '1;42', '2;21', '3;14']
      sortie.texteCorr = `Quatre réponses possibles (avec des entiers) : <br>
            $${miseEnEvidence(6)}\\times ${miseEnEvidence(7)}=42$<br>
            $${miseEnEvidence(2)}\\times ${miseEnEvidence(21)}=42$ <br>
            $${miseEnEvidence(3)}\\times ${miseEnEvidence(14)}=42$<br>
            $${miseEnEvidence(1)}\\times ${miseEnEvidence(42)}=42$`
    }
    sortie.canEnonce = 'Complète'
    return sortie
  }

  /**
   * Méthode pour ajouter des durées
   * @returns {object}
   * @author Sébastien LOZANO
   */

  sommeDeDurees () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    let a, b, c
    if (choice([true, false])) {
      a = randint(6, 10)
      b = choice([35, 40, 45, 50, 55])
      c = choice([30, 35, 40, 45])
      sortie.texte = context.isHtml ? `$${b}\\text{ min }+${a} \\text{ h }${c} \\text{ min }=$` : `\\Temps{;;;;${b};}+ \\Temps{;;;${a};${c};}`
      sortie.reponse = b + c - 60
      sortie.texteCorr = `Pour aller à $${a + 1}$ h, il faut $${60 - c}$ min, et il reste $${b - 60 + c}$ min à ajouter, ce qui donne 
          $${miseEnEvidence(a + 1)}$ h et $${miseEnEvidence(sortie.reponse)}$ min.`
    } else {
      a = randint(6, 10)
      b = choice([20, 25, 30, 35])
      c = choice([45, 50, 55])
      sortie.texte = context.isHtml ? `$${b}\\text{ min }+${a} \\text{ h }${c} \\text{ min }=$` : `\\Temps{;;;;${b};}+ \\Temps{;;;${a};${c};}`
      sortie.reponse = b + c - 60
      sortie.texteCorr = `Pour aller à $${a + 1}$ h, il faut $${60 - c}$ min, et il reste $${b - 60 + c}$ min à ajouter, ce qui donne $${miseEnEvidence(a + 1)}$ h et $${miseEnEvidence(sortie.reponse)}$ min.`
    }
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = '\\ldots{} h \\ldots{} min'
    return sortie
  }

  /**
   * Méthode pour un calcul de partage
   * @returns {object}
   * @author Sébastien LOZANO
   */

  partages () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    const choix = choice(['a', 'b', 'c', 'd'])
    let a
    if (choix === 'a') {
      a = randint(9, 15) * 3
      sortie.reponse = Math.round(a / 3)
      sortie.texte = `Pour partager $${a}$ oeufs, combien de boites de  $3$ oeufs dois-je utiliser ? `
      sortie.texteCorr = `Le nombre de boites est donné par $${a}\\div 3=${miseEnEvidence(a / 3)}$.`
    }
    if (choix === 'b') {
      sortie.reponse = randint(8, 12)
      a = sortie.reponse * 4
      sortie.texte = `Pour partager $${a}$ oeufs, combien de boites de  $4$ oeufs dois-je utiliser ? `
      sortie.texteCorr = `Le nombre de boites est donné par $${a}\\div 4=${miseEnEvidence(a / 4)}$.`
    }
    if (choix === 'c') {
      sortie.reponse = randint(6, 10)
      a = sortie.reponse * 5
      sortie.texte = `Pour partager $${a}$ oeufs, combien de boites de  $5$ oeufs dois-je utiliser ? `
      sortie.texteCorr = `Le nombre de boites est donné par $${a}\\div 5=${miseEnEvidence(sortie.reponse)}$.`
    }
    if (choix === 'd') {
      sortie.reponse = randint(4, 8)
      a = sortie.reponse * 6
      sortie.texte = `Pour partager $${a}$ oeufs, combien de boites de  $6$ oeufs dois-je utiliser ? `
      sortie.texteCorr = `Le nombre de boites est donné par $${a}\\div 6=${miseEnEvidence(sortie.reponse)}$.`
    }
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = 'Je dois utiliser \\\\ \\ldots{} boites.'
    return sortie
  }

  /**
   * Méthode pour un ordre de grandeur
   * @returns {object}
   * @author Sébastien LOZANO
   */

  ordreDeGrandeur () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      reponseUnite: '',
      canEnonce: '',
      canReponseACompleter: ''
    }
    const taille1 = [['falaise', 15, 25, 'm'], ['girafe', 40, 50, 'dm'], ['échelle', 200, 300, 'cm'], ['bouteille', 28, 35, 'cm'], ['télévision', 50, 60, 'cm']]

    const a = randint(0, 4)
    const b = randint(taille1[a][1], taille1[a][2])
    const propositions = shuffle([
      context.isHtml ? `$${b}$ m` : `\\Lg[m]{${b}}`,
      context.isHtml ? `$${b}$ dm` : `\\Lg[dm]{${b}}`,
      context.isHtml ? `$${b}$ cm` : `\\Lg[cm]{${b}}`,
      context.isHtml ? `$${b}$ mm` : `\\Lg[mm]{${b}}`
    ])
    sortie.reponse = b
    sortie.reponseUnite = taille1[a][3]

    sortie.texte = `Choisis parmi les propositions suivantes la hauteur d'une ${taille1[a][0]}<br>`
    sortie.texte += `${propositions[0]} ${sp(4)} ${propositions[1]} ${sp(4)} ${propositions[2]}${sp(4)} ${propositions[3]}`
    sortie.texteCorr = `La taille d'une ${taille1[a][0]} est $${miseEnEvidence(sortie.reponse)}$ ${sortie.reponseUnite}.`
    sortie.canEnonce = `Entoure parmi les propositions suivantes la hauteur d'une ${taille1[a][0]}`
    sortie.canReponseACompleter = `${propositions[0]} \\hfill ${propositions[1]} \\hfill ${propositions[2]} \\hfill ${propositions[3]}`
    return sortie
  }

  /**
   * Méthode pour écrire un nombre en chiffres
   * @returns {object}
   * @author Sébastien LOZANO
   */

  ecrireUnNombreEnChiffres () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    let chiffre = [['un', 1], ['deux', 2], ['trois', 3], ['cinq', 5], ['quatre', 4], ['six', 6], ['sept', 7], ['huit', 8], ['neuf', 9]]
    let chiffre2 = [['vingt', 20], ['trente', 30], ['quarante', 40], ['cinquante', 50], ['soixante', 60]]
    let a = randint(0, 8)
    let b = randint(0, 4)
    let c = randint(0, 8)
    let d = randint(0, 4)
    if (choice([true, false])) {
      chiffre = [['un', 1], ['deux', 2], ['trois', 3], ['cinq', 5], ['quatre', 4], ['six', 6], ['sept', 7], ['huit', 8], ['neuf', 9]]
      chiffre2 = [['vingt', 20], ['trente', 30], ['quarante', 40], ['cinquante', 50], ['soixante', 60]]
      a = randint(0, 8)
      b = randint(0, 4)
      c = randint(0, 8)
      d = randint(0, 4)
      if (a === 0) {
        sortie.texte = `Écris en chiffres le nombre : <br> ${chiffre2[b][0]}-et-${chiffre[a][0]}-mille-${chiffre[c][0]} `
        sortie.reponse = (chiffre2[b][1] + chiffre[a][1]) * 1000 + chiffre[c][1]
        sortie.texteCorr = `$\\text{${chiffre2[b][0]}-et-${chiffre[a][0]}-mille-${chiffre[c][0]}}= ${texNombre((chiffre2[b][1] + chiffre[a][1]) * 1000)} + ${chiffre[c][1]} =${miseEnEvidence(texNombre((chiffre2[b][1] + chiffre[a][1]) * 1000 + chiffre[c][1]))}$ `
      } else {
        sortie.texte = `Écris en chiffres le nombre : <br> ${chiffre2[b][0]}-${chiffre[a][0]}-mille-${chiffre[c][0]} `
        sortie.reponse = (chiffre2[b][1] + chiffre[a][1]) * 1000 + chiffre[c][1]
        sortie.texteCorr = `$\\text{${chiffre2[b][0]}-${chiffre[a][0]}-mille-${chiffre[c][0]}}= ${texNombre((chiffre2[b][1] + chiffre[a][1]) * 1000)} + ${chiffre[c][1]} =${miseEnEvidence(texNombre((chiffre2[b][1] + chiffre[a][1]) * 1000 + chiffre[c][1]))}$ `
      }
    } else {
      if (a === 0) {
        sortie.texte = `Écris en chiffres le nombre : <br> ${chiffre2[b][0]}-et-${chiffre[a][0]}-mille-${chiffre2[d][0]} `
        sortie.reponse = (chiffre2[b][1] + chiffre[a][1]) * 1000 + chiffre2[d][1]
        sortie.texteCorr = `$\\text{${chiffre2[b][0]}-et-${chiffre[a][0]}-mille-${chiffre2[d][0]}} = ${texNombre((chiffre2[b][1] + chiffre[a][1]) * 1000)} + ${chiffre2[d][1]} =${miseEnEvidence(texNombre((chiffre2[b][1] + chiffre[a][1]) * 1000 + chiffre2[d][1]))}$ `
      } else {
        sortie.texte = `Écris en chiffres le nombre : <br> ${chiffre2[b][0]}-${chiffre[a][0]}-mille-${chiffre2[d][0]} `
        sortie.reponse = (chiffre2[b][1] + chiffre[a][1]) * 1000 + chiffre2[d][1]
        sortie.texteCorr = `$\\text{${chiffre2[b][0]}-${chiffre[a][0]}-mille-${chiffre2[d][0]}} = ${texNombre((chiffre2[b][1] + chiffre[a][1]) * 1000)} + ${chiffre2[d][1]} =${miseEnEvidence(texNombre((chiffre2[b][1] + chiffre[a][1]) * 1000 + chiffre2[d][1]))}$ `
      }
    }
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = ''
    return sortie
  }

  /**
   * Méthode pour de plus de moins
   * @param {string} type pour le type de problème
   * @returns {object}
   * @author Sébastien LOZANO
   */

  dePlusDeMoins (type) {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: '',
      champTexteApres: {},
      texteApres: ''
    }
    const prenom1 = prenomF()
    const prenom2 = prenomM()
    let b, a
    switch (type) {
      case 'billes':
        b = randint(3, 5)
        sortie.reponse = randint(4, 9)
        a = sortie.reponse + b
        sortie.texte = `${prenom1} a $${a}$ billes. <br>
        Elle en a $${b}$ de plus que ${prenom2}.${context.isHtml ? '' : '\\\\'} Combien de billes a ${prenom2} ? `
        sortie.texteCorr = `Puisque ${prenom1} en  a $${b}$ de plus, sa sœur en a $${b}$ de moins, soit  : $${a} - ${b}=${miseEnEvidence(a - b)}$. `
        sortie.champTexteApres = {}
        sortie.canEnonce = sortie.texte
        sortie.canReponseACompleter = `${prenom2} a \\ldots{} billes.`
        break
      case 'ages':
        b = randint(6, 15)
        a = randint(2, 5)
        sortie.reponse = b - a
        sortie.texte = `${prenom1} a $${b}$ ans. <br>
        ${prenom2} a ${a} ans de moins que ${prenom1}. ${prenom2} a `
        sortie.texteCorr = `Puisque ${prenom2} a ${a} ans de moins que ${prenom1}, son âge est  : $${b}-${a}=${miseEnEvidence(b - a)}$ ${texteEnCouleur('ans')}. `
        sortie.champTexteApres = { texteApres: sp(5) + 'ans.' }
        sortie.texteApres = '$\\ldots$ ans'
        sortie.canReponseACompleter = `${prenom2} a \\ldots{} ans.`
        sortie.canEnonce = `${prenom1} a $${b}$ ans. <br>
        ${prenom2} a ${a} ans de moins que ${prenom1}.`
        break
    }
    return sortie
  }

  /**
   * Méthode pour demander l'écriture d'un produit d'un entier par un nombre entier de dixièmes/centièmes
  * @returns {object}
  * @author Sébastien LOZANO
  */
  ecritureDecimaleProduitEntierParDixiemesOuCentiemes () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    let a = randint(2, 5)
    let b = randint(6, 9)
    let c = new Decimal('0.1')
    if (choice([true, false])) {
      a = randint(2, 5)
      b = randint(6, 9)
      c = new Decimal('0.1')
      sortie.reponse = new Decimal(a).mul(b).mul(c)
      sortie.texte = `Donne l'écriture décimale de  $${a}\\times ${b}$ dixièmes.`
      sortie.texteCorr = `$1$ dixième $=0,1$, d'où $${a}\\times ${b}$ dixièmes $=${a}\\times ${b}\\times 0,1=${miseEnEvidence(texNombre(sortie.reponse, 1))}$.`
    } else {
      a = randint(2, 5)
      b = randint(6, 9)
      c = new Decimal('0.01')
      sortie.reponse = new Decimal(a).mul(b).mul(c)
      sortie.texte = `Donne l'écriture décimale de  $${a}\\times ${b}$ centièmes.`
      sortie.texteCorr = `$1$ centième $=0,01$, d'où $${a}\\times ${b}$ centièmes $=${a}\\times ${b}\\times 0,01=${miseEnEvidence(texNombre(sortie.reponse, 2))}$.`
    }
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = ''
    return sortie
  }

  /**
   * Méthode pour la lecture d'abscisse entière
   * @returns {object}
   * @author Sébastien LOZANO
   */
  lectureAbscisseEntiereOrigineZero () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    const facteur = randint(2, 9)
    const table = randint(2, 9)
    const a = facteur * table
    let unite
    switch (table) {
      case 2:
      case 3:
      case 4:
      case 5:
        unite = 0.5
        break
      case 6:
      case 7:
      case 8:
      case 9:
        unite = 0.25
        break
    }
    const d = droiteGraduee({
      Unite: unite,
      Min: 0,
      Max: 11 * table,
      x: 0,
      y: 0,
      thickDistance: table,
      thickSec: true,
      thickSecDist: table,
      thickOffset: 0,
      axeStyle: '->',
      pointListe: [[a, '?']],
      labelListe: [[0, '0'], [table, `${table}`], [10 * table, `${10 * table}`]],
      pointCouleur: 'blue',
      pointStyle: 'x',
      labelsPrincipaux: false
    })
    sortie.reponse = a
    sortie.canReponseACompleter = `\\Reperage[DemiDroite,Pasx=1,Unitex=0.4,ValeurUnitex=${table},AffichageAbs=2]{${facteur}/3*A,10/B}`
    sortie.texte = context.isHtml ? 'Quel est le nombre écrit sous le point d\'interrogation ?<br>\n' + mathalea2d({ xmin: -1, ymin: -1, xmax: d.Max, ymax: 1.5, scale: 0.6, style: 'margin: auto' }, d) + '\n' : `Complète \\\\ ${sortie.canReponseACompleter}`
    // texte += context.isHtml ? '' : '\\\\\\smallskip'
    sortie.texteCorr = `Le nombre écrit sous le point d'interrogation est : $${miseEnEvidence(a)}$.`
    sortie.canEnonce = 'Complète'
    return sortie
  }

  /**
   * Méthode pour déterminer un terme décimal inconnu
   * @returns {object}
   * @author Sébastien LOZANO
   */
  trouverUnTermeDecimalInconnu () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    const a = new Decimal(randint(1, 9)).div(10)
    const b = new Decimal(randint(1, 9)).add(a)
    const res = choice([10, 20])
    sortie.reponse = new Decimal(res).sub(b)
    sortie.texte = `Complète : ${sp(3)}
    $${texNombre(b, 1)}+\\ldots =${res}$ `
    sortie.texteCorr = `Le nombre cherché est donné par : $${res}-${texNombre(b, 1)}=${miseEnEvidence(texNombre(sortie.reponse, 2))}$.`
    // sortie.reponse = a
    sortie.canEnonce = 'Complète'
    sortie.canReponseACompleter = `$${texNombre(b, 1)}+\\ldots =${res}$`
    return sortie
  }

  /**
   * Méthode pour décomposer un nombre à 3 chiffres en ... dizaines et ... unités
   * @returns {object}
   * @author Sébastien LOZANO
   */
  decomposerUnNombreATroisChiffresEnDizainesUnites () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    const nombreDeDizaines = randint(10, 99)
    const nombreDUnites = randint(2, 9)
    const nombre = 10 * nombreDeDizaines + nombreDUnites
    sortie.reponse = [`${nombreDeDizaines};${nombreDUnites}`]
    sortie.texte = `Complète : ${sp(3)}
    $${texNombre(nombre, 0)}= \\ldots \\text{ dizaines } \\ldots \\text{ unités }$ `
    sortie.texteCorr = `$${texNombre(nombre, 0)} = ${miseEnEvidence(texNombre(nombreDeDizaines, 0))} \\text{ dizaines } ${miseEnEvidence(texNombre(nombreDUnites, 0))} \\text{ unités }$`
    sortie.canEnonce = 'Complète'
    sortie.canReponseACompleter = `$${texNombre(nombre, 0)}= \\ldots \\text{ dizaines } \\ldots \\text{ unités }$ `
    return sortie
  }

  /**
   * Méthode pour déterminer une fraction à partir d'une figure
   * @returns {object}
   * @author Sébastien LOZANO
   */
  determinerUneFractionAPartirDUneFigure () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    const b = randint(2, 4)
    const a = randint(b + 1, 6)
    const c = randint(1, a - 1)
    const d = randint(1, b)
    const e = randint(0, c - 1)
    const f = randint(d, b)
    const A = polygone([point(0, 0), point(c, 0), point(c, d), point(e, d), point(e, f), point(0, f)], 'black')
    A.couleurDeRemplissage = colorToLatexOrHTML('lightgray')
    const C = grille(0, 0, a, b, 'black', 1, 1, false)
    const D = point(1 + a, 4 - b)
    sortie.texte = `Quelle fraction de la surface totale représente la surface grisée ?
    <br>`
    sortie.texte += mathalea2d({ xmin: -0.5, ymin: -0.1, xmax: 6.1, ymax: b + 0.5, scale: 0.7, style: 'margin: auto' }, A, C)
    sortie.texteCorr = `Il y a $${c * d + e * f - e * d}$ ${c * d + e * f - e * d > 1 ? 'carrés' : 'carré'} gris sur un total de $${a * b}$ carrés, la surface grisée représente donc $\\dfrac{${miseEnEvidence(c * d + e * f - e * d)}}{${miseEnEvidence(a * b)}}$ de la surface totale.`
    sortie.reponse = new FractionX(c * d + e * f - e * d, a * b)
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = ''
    return sortie
  }

  /**
   * Méthode pour déterminer un quotient
   * @returns {object}
   * @author Sébastien LOZANO
   */
  determinerUnQuotient () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: ''
    }
    const a = randint(5, 9)
    const b = randint(4, 9)
    const c = a * b
    sortie.reponse = b
    sortie.texte = `$${c}\\div ${a}=$`
    sortie.texteCorr = `$${c}\\div ${a}=${miseEnEvidence(sortie.reponse)}$`
    sortie.canEnonce = 'Complète.'
    sortie.canReponseACompleter = `$${c}\\div ${a} =\\ldots$`
    return sortie
  }

  /**
   * Méthode pour un calcul de proportionnalité par addition
   * @returns {object}
   * @author Sébastien LOZANO
   */
  proportionnaliteParAddition (type) {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: '',
      uniteInteractif: ''
    }
    let a, b, k
    switch (type) {
      case 'pieces':
        a = choice([4, 6, 8, 10, 12, 14])
        b = a + a / 2
        sortie.reponse = arrondi(2 * b, 0)
        sortie.texte = `Si une pile de $${a}$ pièces de monnaie a une hauteur de $${2 * a}$ mm, alors une pile de $${texNombre(b, 0)}$ pièces a une hauteur de `
        sortie.texteCorr = `Une pile de $${a}$ pièces de monnaie a une hauteur de $2\\times ${a}=${2 * a}$ mm.<br>
        Donc une pile de  $${texNombre(b, 0)}$ pièces aura une hauteur de $2\\times ${b}=${miseEnEvidence(2 * b)}$ mm.`
        sortie.canEnonce = `Si une pile de $${a}$ pièces de monnaie a une hauteur de $\\Lg[mm]{${2 * a}}$, `
        sortie.canReponseACompleter = `alors une pile de $${texNombre(b, 0)}$ pièces a une hauteur de $\\ldots$ \\Lg[mm]{}.`
        sortie.uniteInteractif = 'mm'
        break
      case 'cahiers':
        a = randint(2, 6)
        k = randint(2, 4)
        b = k * a
        sortie.reponse = k * b
        sortie.texte = `Si $${a}$ cahiers coûtent $${b}$ €, alors $${b}$ cahiers coûtent `
        sortie.texteCorr = `$${a}$ cahiers coûtent $${b}$ €.<br> $${k}\\times${a}=${k * a}$ cahiers coûtent $${k}\\times${b}=${miseEnEvidence(k * b)}$ €.`  
        sortie.canEnonce = `Si $${a}$ cahiers coûtent $\\Prix[0]{${b}}$,`
        sortie.canReponseACompleter = `alors $${b}$ cahiers coûtent $\\ldots$ \\Prix[0]{}.`
        sortie.uniteInteractif = '€'
        break
    }
    return sortie
  }

  /**
   * Méthode pour déterminer une longueur en unité de longueur donnée
   * @returns {object}
   * @author Sébastien LOZANO
   */
  determinerUnNombreDUnitesDeLongueur () {
    const sortie = {
      texte: '',
      texteCorr: '',
      reponse: 0,
      canEnonce: '',
      canReponseACompleter: '',
      uniteInteractif: ''
    }
    let a, b, A, B, C, D, E, G, H, s1, s2, s3, s4, s5, xmin, ymin, xmax, ymax, objets
    const choix = choice(['a', 'b', 'c'])//, 'b', 'd', 'e'
    sortie.texte = 'Quelle est la longueur de la ligne en pointillé ? <br>'
    if (choix === 'a') {
      a = grille(-2, 0, 7, 4, 'gray', 1, 1)
      b = choice([3, 4, 5, 6])
      A = point(0, 2, 'A', 'below')
      B = point(1, 2, 'B', 'below')
      C = point(1, 1, 'C', 'above')
      G = point(0, 4, 'C', 'above')
      H = point(b, 4, 'D', 'above')
      s1 = segmentAvecExtremites(G, H)
      s1.epaisseur = 2
      s2 = segment(A, B)
      s2.pointilles = 2
      s2.epaisseur = 2

      s3 = segment(B, C)
      s3.pointilles = 2
      s3.epaisseur = 2
      xmin = -1
      ymin = -0.2
      xmax = 7
      ymax = 5
      objets = []
      objets.push(
        texteParPosition('1 u.l.', milieu(G, H).x, milieu(G, H).y + 0.7, 'milieu', 'black', context.isHtml ? 1 : 0.7),
        a, s1, s2, s3)
      sortie.reponse = new FractionX(2, b)
      sortie.texte += mathalea2d({ xmin, ymin, xmax, ymax, pixelsParCm: 20, mainlevee: false, amplitude: 0.5, scale: 0.5, style: 'margin: auto' }, objets) + '<br>'
      sortie.texteCorr = `Une unité correspond à $${b}$ carreaux, la ligne en pointillé mesure $2$ carreaux, soit $\\dfrac{${miseEnEvidence(2)}}{${miseEnEvidence(b)}}$ u.l. `
    }
    if (choix === 'b') {
      a = grille(-2, 0, 7, 4, 'gray', 1, 1)
      b = choice([2, 4, 5, 6])
      A = point(0, 2, 'A', 'below')
      B = point(1, 2, 'B', 'below')
      C = point(1, 1, 'C', 'above')
      D = point(2, 1, 'C', 'above')
      G = point(0, 4, 'C', 'above')
      H = point(b, 4, 'D', 'above')
      s1 = segmentAvecExtremites(G, H)
      s1.epaisseur = 2
      s2 = segment(A, B)
      s2.pointilles = 2
      s2.epaisseur = 2

      s3 = segment(B, C)
      s3.pointilles = 2
      s3.epaisseur = 2
      s4 = segment(D, C)
      s4.pointilles = 2
      s4.epaisseur = 2
      xmin = -1
      ymin = -0.2
      xmax = 7
      ymax = 5
      objets = []
      objets.push(
        texteParPosition('1 u.l.', milieu(G, H).x, milieu(G, H).y + 0.7, 'milieu', 'black', context.isHtml ? 1 : 0.7),
        a, s1, s2, s3, s4)
      sortie.reponse = new FractionX(3, b)
      sortie.texte += mathalea2d({ xmin, ymin, xmax, ymax, pixelsParCm: 20, mainlevee: false, amplitude: 0.5, scale: 0.5, style: 'margin: auto' }, objets) + '<br>'
      sortie.texteCorr = `Une unité correspond à $${b}$ carreaux, la ligne en pointillé mesure $3$ carreaux, soit $\\dfrac{${miseEnEvidence(3)}}{${miseEnEvidence(b)}}$ u.l. `
    }
    if (choix === 'c') {
      a = grille(-2, 0, 7, 4, 'gray', 1, 1)
      b = choice([3, 5, 6])
      A = point(0, 2, 'A', 'below')
      B = point(1, 2, 'B', 'below')
      C = point(1, 1, 'C', 'above')
      D = point(2, 1, 'C', 'above')
      E = point(2, 2, 'C', 'above')
      G = point(0, 4, 'C', 'above')
      H = point(b, 4, 'D', 'above')
      s1 = segmentAvecExtremites(G, H)
      s1.epaisseur = 2
      s2 = segment(A, B)
      s2.pointilles = 2
      s2.epaisseur = 2

      s3 = segment(B, C)
      s3.pointilles = 2
      s3.epaisseur = 2
      s4 = segment(D, C)
      s4.pointilles = 2
      s4.epaisseur = 2
      s5 = segment(D, E)
      s5.pointilles = 2
      s5.epaisseur = 2
      xmin = -1
      ymin = -0.2
      xmax = 7
      ymax = 5
      objets = []
      objets.push(
        texteParPosition('1 u.l.', milieu(G, H).x, milieu(G, H).y + 0.7, 'milieu', 'black', context.isHtml ? 1 : 0.7),
        a, s1, s2, s3, s4, s5)
      sortie.reponse = new FractionX(4, b)
      sortie.texte += mathalea2d({ xmin, ymin, xmax, ymax, pixelsParCm: 20, mainlevee: false, amplitude: 0.5, scale: 0.5, style: 'margin: auto' }, objets) + '<br>'
      sortie.texteCorr = `Une unité correspond à $${b}$ carreaux, la ligne en pointillé mesure $4$ carreaux, soit $\\dfrac{${miseEnEvidence(4)}}{${miseEnEvidence(b)}}$ u.l. `
    }
    sortie.canEnonce = sortie.texte
    sortie.canReponseACompleter = '$\\ldots$ u.l.'
    return sortie
  }
}
