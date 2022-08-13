/* eslint-disable no-unused-vars */
import fs from 'fs'
import path from 'path'
import { toObjet, toMap, collecteUuidsFromDico } from './fileTools.js'

const isVerbose = /-(-verbode|v)/.test(process.argv)
const logIfVerbose = (...args) => { if (isVerbose) console.log(...args) }
const dictFilePath = '../src/json/exercicesDisponiblesReferentiel2022.json'
const uuidToUrlFilePath = '../src/json/uuidsToUrl.json'
const referentiel2022FilePath = '../src/json/referentiel2022.json'
const levelsThemesListFilePath = '../src/json/levelsThemesList.json'
let levelsThemesList
let dictionnaire
let referentiel2022
let menu2022
let uuidsToUrl

/**
 * Crée une Uuid de 5 caractères hexadécimaux (1M de possibilités)
 * @returns {string}
 */
function createUuid () {
  let dt = new Date().getTime()
  const uuid = 'xxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

/**
 *
 * @param {string} dir
 * @returns {string[]} un tableau de tous les fichiers contenus dans le dossier et tous les sous-dossiers
 */
function getAllFiles (dir) {
  const files = []
  fs.readdirSync(dir).forEach(entry => {
    if (entry === 'Exercice.js' || entry === 'ExerciceTs.ts') return
    const fullEntry = path.join(dir + path.sep, entry)
    if (fs.statSync(fullEntry).isDirectory()) {
      getAllFiles(fullEntry).forEach(file => files.push(file))
    } else if (/\.js$/.test(entry) && !/^_/.test(entry)) {
      files.push(fullEntry)
    } // sinon on ignore
  })
  return files
}

// *****************************************************/
// ***************** Fonctions outils ******************/
// *****************************************************/

function ecrireUuidDansFichier (uuid, name, file) {
  file = file.replace('../src', './src')
  let fichier = fs.readFileSync(file, 'utf-8')
  if (fichier) {
    const parts = fichier.split('export default')
    fichier = parts[0] + `export const uuid = '${uuid}'\nexport const ref = '${name}'\n` + 'export default' + parts[1]
    fs.writeFileSync(file, fichier, 'utf-8')
    return true
  } else {
    console.log(`Le fichier ${file} n'a pas pu être ouvert en lecture`)
    return false
  }
}

function ajouteExoReferentiel ({ uuid, name, level, chap, referentiel }) {
  if (!(referentiel instanceof Map)) {
    console.log('référentiel non valide')
    return false
  }
  let refLevel = referentiel.get(level)
  if (!refLevel) {
    referentiel.set(level, new Map())
    refLevel = referentiel.get(level)
  }
  let refChap = refLevel.get(chap)
  if (!refChap) {
    refLevel.set(chap, new Map())
    refChap = refLevel.get(chap)
  }
  refChap.set(name, uuid)
}

function ajouteExoMenu ({ uuid, name, level, chap, titre, tags, datePublication, dateModification, menu }) {
  if (!(menu instanceof Map)) {
    console.log('référentiel non valide')
    return false
  }
  let refLevel = menu.get(level)
  if (!refLevel) {
    menu.set(level, new Map())
    refLevel = menu.get(level)
  }
  let refChap = refLevel.get(chap)
  if (!refChap) {
    refLevel.set(chap, new Map())
    refChap = refLevel.get(chap)
  }
  const exo = { titre, tags, datePublication, dateModification }
  refChap.set(uuid, exo)
}

function ajouteExoDico ({ uuid = '', url = '', name = '', titre = '', level = '', chap = '', idTheme, idSousTheme, keywords = [], tags = {}, datePublication = '', dateModification = '', dico } = {}) {
  let theme = ''; let sousTheme = ''
  if (!(Array.isArray(dico))) {
    console.log('dictionnaire non valide')
    return false
  }
  /* let dicoLevel = dico.get(level)
  if (!dicoLevel) {
    dico.set(level, new Map())
    dicoLevel = dico.get(level)
  }
  let dicoChap = dicoLevel.get(chap)
  if (!dicoChap) {
    dicoLevel.set(chap, new Map())
    dicoChap = dicoLevel.get(chap)
  }
  */
  if (levelsThemesList.get(idTheme) !== undefined) {
    theme = idTheme // ici on ne stocke que la clé... à l'inverse ci-dessous on stocke le titre complet
    // theme = levelsThemesList.get(leTheme).get('titre')
    if (theme !== '') {
      if (levelsThemesList.get(idTheme).get('sousThemes') !== undefined) {
        if (levelsThemesList.get(idTheme).get('sousThemes').get(idSousTheme) !== undefined) {
          sousTheme = idSousTheme // ici on stocke la clé... ci-dessous on stocke la définition complète
        // sousTheme = levelsThemesList.get(leTheme).get('sousThemes').get(leSousTheme) || ''
        }
      }
    } else {
      sousTheme = ''
    }
  }
  const exo = { uuid, url, titre, niveau: level, idTheme, idSousTheme, AMC: tags.AMC, Interactif: tags.Interactif, Can: tags.Can, keywords, datePublication, dateModification }
  // dicoChap.set(uuid, exo
  dico.push(exo)
}

function mettreAJourFichierDico (dico) {
  const contenuFichier = JSON.stringify(dico, null, 2)
  const dictFilePath = './src/json/exercicesDisponiblesReferentiel2022.json'
  try {
    fs.writeFileSync(dictFilePath, contenuFichier, 'utf-8')
  } catch (error) {
    console.log('Fichier dico non mis à jour')
  }
}
function mettreAJourFichierMenu (dico) {
  const objDico = toObjet(dico)
  const contenuFichier = JSON.stringify(objDico, null, 2)
  const menuReferentiel2022FilePath = './src/json/menuReferentiel2022.json'
  try {
    fs.writeFileSync(menuReferentiel2022FilePath, contenuFichier, 'utf-8')
  } catch (error) {
    console.log('Fichier menu non mis à jour')
  }
}
function mettreAJourFichierReferentiel (dico) {
  const objDico = toObjet(dico)
  const contenuFichier = JSON.stringify(objDico, null, 2)
  const referentiel2022FilePath = './src/json/referentiel2022.json'
  try {
    fs.writeFileSync(referentiel2022FilePath, contenuFichier, 'utf-8')
  } catch (error) {
    console.log('Fichier referentiel non mis à jour')
  }
}
function mettreAJourFichierUuidToUrl (dico) {
  const objDico = toObjet(dico)
  const contenuFichier = JSON.stringify(objDico, null, 2)
  try {
    fs.writeFileSync('./src/json/uuidsToUrl.json', contenuFichier, 'utf-8')
  } catch (error) {
    console.log('Fichier UuidToUrl non mis à jour')
  }
}
function gereModuleJs (module, file, name, dictionnaire, referentiel2022, menu2022, uuidsToUrl, listOfUuids, isCan) {
  let uuid, level, chap, idTheme, idSousTheme
  if (module.uuid === undefined) {
    try {
      do {
        uuid = createUuid()
      } while (listOfUuids.get(uuid) !== undefined)
      ecrireUuidDansFichier(uuid, name, file)
    } catch (error) {
      console.log(`Erreur avec ${name} : ${error}`)
    }
  } else {
    uuid = module.uuid
  }
  const titre = module.titre
  const isAmcReady = Boolean(module.amcReady)
  const isInteractifReady = Boolean(module.interactifReady)
  const keywords = module.keywords ? module.keywords : []
  const datePublication = module.dateDePublication
  const dateModification = module.dateDeModifImportante

  if (isCan) {
    if (['1', '2', '3', '4', '5', '6', 'T'].indexOf(name[3]) !== -1) {
      level = name[3] + 'e'
      chap = name.substring(3, 5)
    } else {
      level = name.substring(3, 5)
      chap = name.substring(3, 6)
    }
    idTheme = ''
    idSousTheme = ''
  } else {
    if (['1', '2', '3', '4', '5', '6', 'T'].indexOf(name[0]) !== -1) {
      level = name[0] + 'e'
      chap = name.substring(0, 3)
      idTheme = name.substring(0, 3)
      idSousTheme = name.substring(0, 4)
    } else if (name.substring(0, 7) === 'techno1') {
      level = name.substring(0, 7)
      chap = name.substring(7, 8)
      idTheme = name.substring(7, 8)
      idSousTheme = name.substring(7, 8)
    } else {
      level = name[0] + name[1]
      chap = name.substring(0, 4)
      idTheme = name.substring(0, 4)
      idSousTheme = name.substring(0, 4)
    }
  }
  const url = file.replace('../src/exercices/', '')
  const tags = { AMC: !!isAmcReady, Interactif: !!isInteractifReady, Can: !!isCan }
  ajouteExoDico({ uuid, url, name, titre, level, chap, idTheme, idSousTheme, keywords, tags, datePublication, dateModification, dico: dictionnaire })
  ajouteExoReferentiel({ uuid, name, level, chap, referentiel: referentiel2022 })
  ajouteExoMenu({ uuid, name, level, chap, titre, tags, datePublication, dateModification, menu: menu2022 })
  uuidsToUrl.set(uuid, url)
  return true
}

/**
 * Fonction qui génère ou maintient à jour le dictionnaire de tous les exercices.
 * Elle parcourt l'ensemble des fichiers exercice
 * vérifie si la constante uuid existe (signe que l'exercice est déjà dans le dictionnaire)
 * Si elle existe, on passe au fichier suivant
 * Sinon, on génère une uuid nouvelle qu'on écrit dans le fichier : export const uuid = 'xxxxx' à la première ligne
 * Puis on ajoute l'exercice dans le dictionnaire avec son uuid
 * En même temps, on alimente le fichier uuidToUrl.json qui stocke les url des fichiers référencés par leur uuid.
 * @author Jean-Claude Lhote
 */
async function builJsonDictionnaireExercices () {
  try {
    levelsThemesList = await import('../src/json/exercicesDisponiblesReferentiel2022.json', { assert: { type: 'json' } })
    levelsThemesList = toMap(levelsThemesList.default)
  } catch (error) {
    console.log('problème avec levelsThemesList.json')
    console.error(error)
  }
  // on charge le dictionnaire si il existe et on génère la liste des UUID déjà prises
  // On prépare les fichiers que l'on va alimenter : listOfUuids, dictionnaire, uuidsToUrl
  const listOfUuids = new Map()
  dictionnaire = []
  uuidsToUrl = new Map()
  referentiel2022 = new Map()
  menu2022 = new Map()

  // On charge la liste des exercices
  const exercicesDir = path.relative(path.resolve('.'), path.resolve('src', 'exercices'))
  const exercicesList = getAllFiles(exercicesDir)
  const promesses = []
  for (let file of exercicesList) {
    if (file.indexOf('beta') !== -1) continue
    if (file.indexOf('Prof') !== -1) continue
    const name = path.basename(file, path.extname(file))
    const isCan = file.includes('can')
    file = '../' + file
    const promesse = import(file.replace('\\', '/'))
      .then(
        (module) => gereModuleJs(module, file, name, dictionnaire, referentiel2022, menu2022, uuidsToUrl, listOfUuids, isCan)
      )
      .catch(error => {
        console.log(file.substring(file.length - 2))
        if (file.substring(file.length - 2) !== 'ts') console.error(error)
      }
      )
    promesses.push(promesse)
  }
  Promise.all(promesses)
    .then(() => {
      mettreAJourFichierDico(dictionnaire)
      mettreAJourFichierMenu(menu2022)
      mettreAJourFichierReferentiel(referentiel2022)
      mettreAJourFichierUuidToUrl(uuidsToUrl)
    })
    .catch(error => {
      console.log(' Il y a une erreur avec le Promise.All : ', error.message)
    })
}
/**
 * Fonction qui extrait les exercices d'un niveau pour créer un dictionnaire de ce niveau
 * Les niveaux possibles sont '1e', '2e', '3e', '4e', '5e', '6e', 'c3', 'CM', 'Ex', 'HP', 'PE', 'Te'
 * @param {string} level
 * @author Jean-Claude Lhote
 */
function buildJsonExercicesOfLevel (level) { // level contient la première lettre du niveau
  let listeExosLevel
  if (dictionnaire === undefined) dictionnaire = toMap(JSON.parse(fs.readFileSync(dictFilePath, 'utf-8')))
  const entrées = Object.entries(toObjet(dictionnaire))
  const listeExos = []
  for (const [clé, liste] of entrées) {
    if (clé === level) {
      for (const [key, data] of Object.entries(liste)) {
        const exos = Object.entries(data)
        for (const [key2, value] of Object.entries(exos)) {
          listeExos.push([value[0], value[1]])
        }
      }
    }
  }

  const dicoLevel = Object.fromEntries(listeExos)
  const dicoLevelFile = `./exercicesDisponiblesNiveau${level}Referentiel2022.json`// path.resolve('src', 'modules', `exercicesDisponiblesNiveau${level}Referentiel2022.json`)
  fs.writeFileSync(dicoLevelFile, JSON.stringify(dicoLevel, null, 2))
}

// main script
builJsonDictionnaireExercices()
// buildJsonExercicesOfLevel('1e')
// buildJsonExercicesOfLevel('2e')
// buildJsonExercicesOfLevel('3e')
// buildJsonExercicesOfLevel('4e')
// buildJsonExercicesOfLevel('5e')
// buildJsonExercicesOfLevel('6e')
// buildJsonExercicesOfLevel('techno1')
// buildJsonExercicesOfLevel('CM')
// buildJsonExercicesOfLevel('HP')
// buildJsonExercicesOfLevel('PE')
// buildJsonExercicesOfLevel('Ex')
// buildJsonExercicesOfLevel('c3')
//

// buildJsonExercicesOfLevel('Te')
