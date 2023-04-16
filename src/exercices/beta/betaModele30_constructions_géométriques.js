import {
  carre,
  labelPoint,
  point,
  pointAdistance,
  rotation,
  segmentAvecExtremites,
  tracePoint,
  triangle2points2longueurs
} from '../../modules/2d.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { combinaisonListes, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../Exercice.js'

export const titre = 'Nom de l\'exercice'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '25/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Description didactique de l'exercice
 * @author NomAuteur(s)
 * Référence
 */
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.consigne = 'consigne'
    this.nbQuestions = 1 // Ici le nombre de questions
    this.nbCols = 1 // Le nombre de colonnes dans l'énoncé LaTeX
    this.nbColsCorr = 1 // Le nombre de colonne pour la correction LaTeX
  }
  
  nouvelleVersion (numeroExercice) {
    // la variable numeroExercice peut être récupérée pour permettre de différentier deux copies d'un même exo
    // Par exemple, pour être certain de ne pas avoir les mêmes noms de points en appelant 2 fois cet exo dans la même page
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    
    const typesDeQuestionsDisponibles = [1] // tableau à compléter par valeurs possibles des types de questions
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    // let A, B, C, D, kare, triangle // c'est une mauvaise idée d'avoir des variables globales, il vaut mieux des constantes renouvelées à chaque tour de boucle et propres à chaque case : ça évite les valeurs résiduelles
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const objetsEnonce = [] // on initialise le tableau des objets Mathalea2d de l'enoncé
      const objetsEnonceml = [] // Idem pour l'enoncé à main levée si besoin
      const objetsCorrection = [] // Idem pour la correction
      
      texte = 'Construire le carré $ABCD$.<br>'
      texteCorr = 'Pour cette construction on peut utiliser la règle et l\'équerre.<br>'
      switch (listeTypeDeQuestions[i]) { // Chaque question peut être d'un type différent, ici 4 cas sont prévus...
        case 1: { // ces accolades permettent de définir des variables et des constantes locales
          const A = point(0, 0, 'A', 'below') // 'below' indique l'étiquette avec son nom sera en-dessous du point.
          // Laisse ta souris sur point pour savoir ce que fait cette fonction !
          // Garde en tête cette possibilité pour la suite et préviens sur le Slack si rien ne s'affiche pour une fonction alors que tu aurais bien aimé ;)
          
          // Les quatre lignes ci-dessous proposent une façon très efficace d'avoir des positions aléatoires des points de façon contrôlée
          const B = pointAdistance(A, randint(30, 60) / 10, randint(0, 40), 'B') // Crée le point B à une distance comprise entre 3 et 6 unités du point A de façon à ce que le vecteur AB forme un angle entre 0 et 40° avec l'horizontale
          const triangle = triangle2points2longueurs(A, B, randint(40, 60) / 10, randint(30, 50) / 10) // Crée un triangle à partir des point A et B et dont le troisième est à une certaine distance de A et de B
          const C = triangle.listePoints[2] // On met le troisième point du triangle créé précédemment dans la variable C
          C.nom = 'C' // On nomme ce troisième point 'C'
          
          const D = rotation(B, A, -90, 'D', 'above') // Laisse ta souris sur carre pour voir ce que fait cette fonction !
          objetsEnonce.push(triangle, segmentAvecExtremites(C, D)) // Quand on veut afficher des objets, on commence par les push dans la liste associée
          objetsEnonce.push(tracePoint(A, B)) // Place une croix à l'emplacement de A et de B
          objetsEnonce.push(labelPoint(A, C)) // Place une étiquette 'A' ou 'C' dans la position définie précédemment ('below' et 'above' par défaut)
          const kare = carre(C, D) // Laisse ta souris sur carre pour voir ce que fait cette fonction !
          kare.epaisseur = 2
          objetsEnonceml.push(kare)
          
          // On copie tout le contenu de objetsEnonce et de objetsEnonceml dans objetsCorrection
          objetsEnonce.forEach(objet => {
            objetsCorrection.push(objet)
          })
          objetsEnonceml.forEach(objet => {
            objetsCorrection.push(objet)
          })
          // ici sont créés les texte, tex_corr, objets mathalea2d divers entrant dans le contenu de l'exercice
        }
          break
        
        case 2:
          // Idem Cas1 mais avec d'autres texte, texteCorr...
          break
        
        case 3:
          
          break
        
        case 4:
          
          break
      }
      // Les lignes ci-dessous permettent d'avoir un affichage aux dimensions optimisées caduque !
      /*
      const xmin = Math.min(A.x, B.x, C.x, D.x, kare.listePoints[2].x, kare.listePoints[3].x) - 2
      const xmax = Math.max(A.x, B.x, C.x, D.x, kare.listePoints[2].x, kare.listePoints[3].x) + 2
      const ymin = Math.min(A.y, B.y, C.y, D.y, kare.listePoints[2].y, kare.listePoints[3].y) - 2
      const ymax = Math.max(A.y, B.y, C.y, D.y, kare.listePoints[2].y, kare.listePoints[3].y) + 2
      => remplacé par fixeBordures(objetsEnonce) ci dessous
       */
      // paramètres de la fenêtre Mathalea2d pour l'énoncé normal
      const paramsEnonce = Object.assign(fixeBordures(objetsEnonce), {pixelsParCm: 20, scale: 1})
      // paramètres de la fenêtre Mathalea2d pour l'énoncé main levée
      const paramsEnonceml = Object.assign(fixeBordures(objetsEnonce), {
        pixelsParCm: 20,
        scale: 1,
        mainlevee: true,
        amplitude: 1
      })
      // paramètres de la fenêtre Mathalea2d pour la correction
      // On ajoute au texte de l'énoncé, la figure à main levée et la figure de l'enoncé.
      texte += mathalea2d(paramsEnonce, objetsEnonce) + mathalea2d(paramsEnonceml, objetsEnonceml)
      // On ajoute au texte de la correction, la figure de la correction
      texteCorr += mathalea2d(paramsEnonce, objetsCorrection)
      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, objetsEnonce)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        // Dans cet exercice, on n'utilise pas a, b, c et d mais A, B, C et D alors remplace-les !
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
