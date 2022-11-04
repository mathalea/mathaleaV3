import Exercice from '../Exercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, creerNomDePolygone, combinaisonListes } from '../../modules/outils.js'
import { point, labelPoint, droite, segment, demiDroite } from '../../modules/2d.js'
import { context } from '../../modules/context.js'
export const titre = 'Utiliser la notation de droites, segments et demi-droites'
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * Utiliser les notations des segments, droites et demi-droites
 * @author Rémi Angot
 * Référence 6G10
 */
export const uuid = '8f5d3'
export const ref = '6G10'
export default function NotationSegmentDroiteDemiDroite () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.nbQuestions = 3
  this.nbCols = 3
  this.nbColsCorr = 2

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions === 1 || context.vue === 'diap' || context.isAmc ? "Compléter le programme de construction qui a permis d'obtenir cette figure." : "Compléter les programmes de construction qui ont permis d'obtenir ces figures."
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeDesTypesDeQuestions = combinaisonListes([1, 1, 2, 3, 4, 4], this.nbQuestions * 3)
    let listeDeNomsDePolygones
    for (let i = 0, texte, texteCorr, figure, enonceAMC, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (i % 5 === 0) listeDeNomsDePolygones = ['PQD']
      const p = creerNomDePolygone(3, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(p)
      const A = point(0, 0, p[0], 'above left')
      const B = point(1, 1.2, p[1], 'above')
      const C = point(2.2, -0.3, p[2], 'above right')
      function creerDroiteDemiSegment (A, B, type) {
        let trait, notation
        switch (type) {
          case 1:
            trait = droite(A, B)
            notation = `$(${A.nom}${B.nom})$`
            break
          case 2:
            trait = demiDroite(A, B)
            notation = `$[${A.nom}${B.nom})$`
            break
          case 3:
            trait = demiDroite(B, A)
            notation = `$[${B.nom}${A.nom})$`
            break
          case 4:
            trait = segment(A, B)
            notation = `$[${A.nom}${B.nom}]$`
            break
        }
        return [trait, notation]
      }
      const [dAB, dABCorr] = creerDroiteDemiSegment(A, B, listeDesTypesDeQuestions[3 * i])
      const [dAC, dACCorr] = creerDroiteDemiSegment(A, C, listeDesTypesDeQuestions[3 * i + 1])
      const [dBC, dBCCorr] = creerDroiteDemiSegment(B, C, listeDesTypesDeQuestions[3 * i + 2])
      const labels = labelPoint(A, B, C)

      texte = `Placer 3 points $${p[0]}$, $${p[1]}$ et $${p[2]}$ non alignés puis tracer... <br><br>`
      figure = mathalea2d(
        { xmin: -1, ymin: -1, xmax: 3, ymax: 2.5, pixelsParCm: 40, scale: 1 },
        dAB,
        dBC,
        dAC,
        labels
      )
      enonceAMC = figure + texte
      texte += figure
      texteCorr = `Placer 3 points $${p[0]}$, $${p[1]}$ et $${p[2]}$ non alignés puis tracer ${dABCorr}, ${dBCCorr}, ${dACCorr}.`
      if (context.isAmc) {
        this.autoCorrection[i] =
          {
            enonce: this.consigne + '<br>' + enonceAMC,
            propositions: [
              {
                texte: texteCorr,
                statut: 3, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                enonce: 'Texte écrit au dessus ou avant les cases à cocher', // EE : ce champ est facultatif et fonctionnel qu'en mode hybride (en mode normal, il n'y a pas d'intérêt)
                sanscadre: false, // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                pointilles: true // EE : ce champ est facultatif et permet (si false) d'enlever les pointillés sur chaque ligne.
              }
            ]
          }
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  // this.besoinFormulaireNumerique = ['Niveau de difficulté',3];
}
