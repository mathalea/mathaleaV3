import Decimal from 'decimal.js'
import { context } from '../../modules/context.js'
import Exercice from '../Exercice.js'
import { Tableau } from '../../modules/2d.js'
import { mathalea2d, fixeBordures } from '../../modules/2dGeneralites.js'
import {
  texNombre,
  stringNombre,
  listeQuestionsToContenu,
  randint,
  combinaisonListes,
  choice,
  contraindreValeur,
  pgcd, numAlpha
} from '../../modules/outils.js'
import FractionX from '../../modules/FractionEtendue.js'
export const titre = 'Calculer le coefficient de proportionnalité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '18/03/2023'

export const uuid = '2d5eb'
export const ref = '6P15'
export default function CalculerCoeffPropo () {
  Exercice.call(this)
  this.sup = 1
  this.nbQuestions = 5
  this.besoinFormulaireNumerique = ['Type de coefficient', 4, '1 : Entier\n2 : Decimal\n3 : Fraction\n4 : Mélange']
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    const typeDeCoefficient = ['Entier', 'Decimal', 'Fraction']
    let listeTypesDeCoefficient = []
    const tableauxEntiers = [[2, 3, 4, 5, 6, 7, 8, 9], [10, 12, 15, 16], [20, 24, 25, 30, 35, 40], [50, 60, 70, 80, 90, 100]]
    const tableauxCoefficientsEntiers = [[2, 4, 6, 8, 10], [3, 5, 7, 9, 80, 90], [11, 5, 19, 15, 25, 50, 75], [12, 15, 20, 25, 30, 40]]
    // @todo prévoir un tableau de choix des fractions plutôt que d'aléatoiriser leur construction

    this.sup = contraindreValeur(1, 4, this.sup, 1)
    if (this.sup === 4) listeTypesDeCoefficient = combinaisonListes(typeDeCoefficient, this.nbQuestions)
    else listeTypesDeCoefficient = combinaisonListes([typeDeCoefficient[this.sup - 1]], this.nbQuestions)
    for (let i = 0, texte, texteCorr; i < this.nbQuestions; i++) {
      // Je suis en js, je fais du typage inline JsDoc pratique pour récupérer l'autocomplétion
      /** @type number | Decimal | FractionX */
      let coefficient
      /** @type Array<{ nombre: number, visible: boolean }> */
      const premiereLigne = []
      /** @type Array<{ nombre: number, visible: boolean }> */
      const deuxiemeLigne = []
      const colonneReference = randint(0, 2) // La colonne qui contiendra deux valeurs visibles pour faire le calcul
      switch (listeTypesDeCoefficient[i]) {
        case 'Entier': // On choisit un coefficient dans les listes => tout est entier
          coefficient = choice(tableauxCoefficientsEntiers[i % 4])
          for (let colonne = 0; colonne < 3; colonne++) {
            const contenuVisible = choice([true, false])
            premiereLigne[colonne] = {
              nombre: choice(choice(tableauxEntiers), premiereLigne.map(elt => elt.nombre)),
              visible: colonne === colonneReference ? true : contenuVisible
            }
            deuxiemeLigne[colonne] = {
              nombre: premiereLigne[colonne].nombre * coefficient,
              visible: colonne === colonneReference ? true : !contenuVisible
            }
          }
          break
        case 'Decimal': // On construit un coefficient... on pourrait le choisir dans une liste
          coefficient = new Decimal(randint(1, 9) + randint(0, 2) * 10).div(10)
          for (let colonne = 0; colonne < 3; colonne++) {
            const contenuVisible = choice([true, false])
            premiereLigne[colonne] = {
              nombre: choice(choice(tableauxEntiers), premiereLigne.map(elt => elt.nombre)),
              visible: colonne === colonneReference ? true : contenuVisible
            }
            deuxiemeLigne[colonne] = {
              nombre: coefficient.mul(premiereLigne[colonne].nombre),
              visible: colonne === colonneReference ? true : !contenuVisible
            }
          }
          break
        case 'Fraction': { // construction de la fraction => prévoir une liste simplifiera le code
          let allNumberAreGood
          do {
            allNumberAreGood = true
            let numerateur
            let denominateur
            do { // tout ça devrait être inutile si on choisit les fractions pertinentes dans une liste
              numerateur = randint(2, 9)
              denominateur = randint(2, 9, numerateur)
              const pGcD = pgcd(numerateur, denominateur)
              if (pGcD !== 1) {
                numerateur /= pGcD
                denominateur /= pGcD
              }
            } while (denominateur === 1) // on vérifie qu'après simplification, ce n'est pas un entier, sinon on recommence (inutile si on choisit les fractions dans une liste)
            coefficient = new FractionX(numerateur, denominateur)
            for (let colonne = 0; colonne < 3; colonne++) {
              const contenuVisible = choice([true, false])
              let unNombre
              let antiBoucleInfinie = 0
              do { // On choisit un nombre à multiplier par une fraction => on veut un résultat entier obligatoirement !
                unNombre = choice(choice(tableauxEntiers), premiereLigne.map(elt => elt.nombre))
                antiBoucleInfinie++
              } while (!coefficient.multiplieEntier(unNombre).estEntiere && antiBoucleInfinie < 20)
              if (antiBoucleInfinie === 20) allNumberAreGood = false
              premiereLigne[colonne] = { nombre: unNombre, visible: colonne === colonneReference ? true : contenuVisible }
              deuxiemeLigne[colonne] = {
                nombre: premiereLigne[colonne].nombre * coefficient,
                visible: colonne === colonneReference ? true : !contenuVisible
              }
            }
          } while (!allNumberAreGood)
        }
          break
      }
      // remplissage du tableau énoncé et correction.
      const ligne1 = ['\\text{série 1}'].concat(premiereLigne.map(elt => elt.visible ? `${texNombre(elt.nombre)}` : ''))
      const ligne2 = ['\\text{série 2}'].concat(deuxiemeLigne.map(elt => elt.visible ? texNombre(elt.nombre) : ''))
      const monTableau = new Tableau({
        largeurTitre: 5,
        largeur: 3,
        hauteur: 2,
        nbColonnes: 4,
        ligne1,
        ligne2,
        flecheDroite: '× ...',
        flecheDroiteSens: 'bas'
      })
      const ligne1Corr = ['\\text{série 1}'].concat(premiereLigne.map(elt => texNombre(elt.nombre)))
      const ligne2Corr = ['\\text{série 2}'].concat(deuxiemeLigne.map(elt => texNombre(elt.nombre)))
      const monTableauCorr = new Tableau({
        largeurTitre: 5,
        largeur: 3,
        hauteur: 2,
        nbColonnes: 4,
        ligne1: ligne1Corr,
        ligne2: ligne2Corr,
        flecheDroite: coefficient instanceof FractionX ? `$\\times ${coefficient.texFraction}$` : `× ${stringNombre(coefficient)}`,
        flecheDroiteSens: 'bas'
      })
      texte = '<br>' + numAlpha(0) + 'Calculer le coefficient de proportionnalité.<br>'
      texte += numAlpha(1) + 'Compléter le tableau de proportionnalité.<br>'
      // dessin du tableau selon le contexte
      if (context.isHtml) { // Pour HTML on utilise mathalea2d
        texte += mathalea2d(Object.assign({}, fixeBordures([monTableau])), monTableau)
      } else { // pour LAtex, c'est profCollege dans le texte
        texte += '\\Propor[Math,\nStretch=2,\nGrandeurA=série 1\n,GrandeurB=série 2\n,largeur=1.5]{'
        for (let colonne = 0; colonne < 3; colonne++) {
          texte += premiereLigne[colonne].visible ? `$${premiereLigne[colonne].nombre}$/` : '\\ldots/'
          texte += deuxiemeLigne[colonne].visible ? `$${deuxiemeLigne[colonne].nombre}$` : '\\ldots'
          if (colonne < 2) texte += ','
          else texte += '}\n'
        }
        texte += '\\FlechesPD{1}{2}{$\\times$\\ldots}\n'
      }
      texteCorr = '<br>' + numAlpha(0) +
        `Le coefficient de proportionnalité est donné par le quotient de $${texNombre(deuxiemeLigne[colonneReference].nombre)}$
 par $${texNombre(premiereLigne[colonneReference].nombre)}$.<br>Soit $\\dfrac{${texNombre(deuxiemeLigne[colonneReference].nombre)}}{${texNombre(premiereLigne[colonneReference].nombre)}}`
      if (coefficient instanceof FractionX) {
        const quotient = new FractionX(deuxiemeLigne[colonneReference].nombre, premiereLigne[colonneReference].nombre)
        if (!quotient.estIrreductible) {
          texteCorr += `= ${coefficient.texFraction}$`
        } else {
          texteCorr += '$'
        }
      } else {
        texteCorr += `= ${texNombre(coefficient)}$`
      }
      // dessin du tableau selon le contexte
      if (context.isHtml) { // Pour HTML on utilise mathalea2d
        texteCorr += mathalea2d(Object.assign({}, fixeBordures([monTableauCorr])), monTableauCorr)
      } else { // pour LAtex, c'est profCollege dans le texte
        texteCorr += '\\Propor[Math,Stretch=2, GrandeurA=série 1, GrandeurB=série 2, largeur=1.5]{'
        for (let colonne = 0; colonne < 3; colonne++) {
          texteCorr += `$${premiereLigne[colonne].nombre}$/`
          texteCorr += `$${deuxiemeLigne[colonne].nombre}$`
          if (colonne < 2) texteCorr += ','
          else texteCorr += '}'
        }
        texteCorr += `\\FlechePD{1}{2}{$\\times ${coefficient instanceof FractionX ? coefficient.texFraction : texNombre(coefficient)}$}`
      }
      if (this.questionJamaisPosee(i, ...premiereLigne.map(elt => elt.nombre), ...deuxiemeLigne.map(elt => elt.nombre))) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
      }
    }
    listeQuestionsToContenu(this)
  }
}
