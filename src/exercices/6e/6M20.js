import { longueur, segment, afficheLongueurSegment, afficheCoteSegment, codageAngleDroit, polygoneAvecNom, triangle2points1hauteur, point, rotation } from '../../modules/2d.js'
import { combinaisonListesSansChangerOrdre, creerNomDePolygone, listeQuestionsToContenu, randint, shuffle, texNombre, calcul, arrondi, combinaisonListes } from '../../modules/outils.js'
import Exercice from '../Exercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import Grandeur from '../../modules/Grandeur.js'
export const titre = 'Calculer l\'aire de triangles'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

export const dateDeModifImportante = '12/04/2023'

/**
 * Calculer l'aire de 3 triangles dont une hauteur est tracée.
 *
 * Une figure dynamique est disponible sur laquelle on peut déplacer le pied de la hauteur.
 *
 * @author Rémi Angot conversion mathalea2d Jean-Claude Lhote
 * Ajout de la possibilité de choisir le nombre de questions par Guillaume Valmont le 08/05/2022
 * Référence 6M20
 */
export const uuid = '06b1a'
export const ref = '6M20'
export default function AireDeTriangles () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.amcReady = amcReady
  this.amcType = amcType
  this.titre = titre
  this.spacing = 2
  // eslint-disable-next-line no-undef
  context.isHtml ? (this.spacingCorr = 3) : (this.spacingCorr = 2)
  this.nbQuestions = 3
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 3

  this.correctionDetailleeDisponible = true
  this.correctionDetaillee = false

  this.nouvelleVersion = function (numeroExercice) {
    this.listeCorrections = [] // Liste de questions corrigées
    this.listeQuestions = []
    this.autoCorrection = []
    const tableauDesCotes = shuffle([5, 6, 7, 8, 9]) // pour s'assurer que les 3 côtés sont différents
    const tableauDesHauteurs = shuffle([3, 4, 5, 6]) // pour s'assurer que les 3 hauteurs sont différents
    const cotes = combinaisonListesSansChangerOrdre(tableauDesCotes, this.nbQuestions)
    const hauteurs = combinaisonListesSansChangerOrdre(tableauDesHauteurs, this.nbQuestions)
    let triH; const A = point(0, 0); let B; let C; let H; let triangle; let polynom; let hauteurpoly; let d
    const objetsEnonce = []; const objetsCorrection = []; let xmin; let xmax; let ymin; let ymax

    const NB_LETTRES = 20
    const nom = creerNomDePolygone(NB_LETTRES, 'QD')

    const typeQuestionsDisponibles = this.sup === 3 ? ['intérieur', 'extérieur'] : this.sup === 1 ? ['intérieur'] : ['extérieur']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      objetsEnonce.length = 0
      objetsCorrection.length = 0
      A.nom = nom[(i * 4) % NB_LETTRES]
      B = rotation(point(cotes[i], 0), A, randint(-60, 60), nom[(i * 4 + 1) % NB_LETTRES])
      if (listeTypeQuestions[i] === 'extérieur') {
        d = longueur(A, B) + randint(6, 9) / 3
      } else {
        d = calcul(randint(6, Math.round(longueur(A, B) * 10 - 6)) / 10)
      }
      triH = triangle2points1hauteur(A, B, hauteurs[i], d, 2)
      H = triH.pied
      H.nom = nom[(i * 4 + 3) % NB_LETTRES]
      triangle = triH.triangle
      C = triangle.listePoints[2]
      C.nom = nom[(i * 4 + 2) % NB_LETTRES]
      polynom = polygoneAvecNom(A, H, B, C)
      hauteurpoly = segment(C, H)
      hauteurpoly.pointilles = 2
      xmin = Math.min(A.x, B.x, C.x, H.x) - 1.5
      xmax = Math.max(A.x, B.x, C.x, H.x) + 1.5
      ymin = Math.min(A.y, B.y, C.y, H.y) - 2
      ymax = Math.max(A.y, B.y, C.y, H.y) + 1.5
      objetsEnonce.push(polynom[0], polynom[1], hauteurpoly, afficheCoteSegment(segment(B, A), '', 1), afficheLongueurSegment(A, C, 'black', 0.5), afficheLongueurSegment(C, B, 'black', 0.5), afficheLongueurSegment(C, H, 'black', 0.3), codageAngleDroit(A, H, C))
      objetsCorrection.push(polynom[0], polynom[1], hauteurpoly, afficheCoteSegment(segment(B, A), '', 1), afficheLongueurSegment(C, H, 'black', 0.3), codageAngleDroit(A, H, C))
      texte = `Calculer l'aire du triangle ${A.nom}${B.nom}${C.nom}.<br>`
      texte += mathalea2d({ xmin, xmax, ymin, ymax, pixelsParCm: 20, scale: 0.5, mainlevee: false }, objetsEnonce) + '<br>'
      if (this.correctionDetaillee) { texteCorr = mathalea2d({ xmin, xmax, ymin, ymax, pixelsParCm: 20, scale: 0.5, mainlevee: false }, objetsCorrection) + '<br>' } else texteCorr = ''
      texteCorr += `$\\mathcal{A}_{${A.nom}${B.nom}${C.nom}}=\\dfrac{1}{2}\\times ${A.nom}${B.nom}\\times ${H.nom}${C.nom}=\\dfrac{1}{2}\\times${cotes[i]}~\\text{cm}\\times ${hauteurs[i]}~\\text{cm}=${texNombre(
      calcul((cotes[i] * hauteurs[i]) / 2)
    )}~\\text{cm}^2$`
      setReponse(this, i, new Grandeur(arrondi(cotes[i] * hauteurs[i] / 2, 3), 'cm^2'), { formatInteractif: 'unites' })
      texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline nospacebefore unites[aires]', { texte: `Aire du triangle ${A.nom}${B.nom}${C.nom} :` })
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte + `<br>Aire de ${A.nom}${B.nom}${C.nom} en cm$^2$ :`, // Si vide, l'énoncé est celui de l'exercice.
          propositions: [
            {
              texte: texteCorr
            }
          ],
          reponse: {
            valeur: [arrondi(cotes[i] * hauteurs[i] / 2)], // obligatoire (la réponse numérique à comparer à celle de l'élève), NE PAS METTRE DE STRING à virgule ! 4.9 et non pas 4,9. Cette valeur doit être passée dans un tableau d'où la nécessité des crochets.
            param: {
              signe: false,
              decimals: 1,
              approx: 0
            }
          }
        }
      }

      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        // Supprime b, c et d dans la ligne ci-dessus et remplace les par NombreAAjouter !
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Type de triangles', 4, '1 : Que des triangles sans angle obtus\n2 : Que des triangles avec un angle obtus\n3 : Mélange']
}
