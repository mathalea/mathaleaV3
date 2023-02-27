import fs from 'fs'
import path from 'path'

/**
 * Une erreur sur un fichier est bloquante sauf si elle est à l'intérieur d'une fonction exportée
 */

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

const allExercices = getAllFiles('./src/exercices/')

const dictionnaire = {}
const uuidUrls = {}
const exercicesList = []
let errors = ''

for (let url of allExercices) {
  url = '../' + url
  try {
    const { titre, datePublication, dateDeModifImportante, ref, uuid, interactifType, interactifReady, amcReady, amcType } = await import(url)
    url = url.replace('../src/exercices/', '')
    dictionnaire[ref] = { ref, uuid, url, titre, datePublication, dateDeModifImportante, tags: { interactif: interactifReady, interactifType, amc: amcReady, amcType } }
    uuidUrls[uuid] = url
    exercicesList.push(url)
  } catch (error) {
    console.log(error)
    errors = error + '\n'
  }
}

console.log(dictionnaire)
console.log(uuidUrls)
console.log(errors)

fs.writeFileSync('./src/json/uuidToUrl.json', JSON.stringify(uuidUrls, null, 2))
fs.writeFileSync('./src/json/exercicesList.json', JSON.stringify(exercicesList, null, 2))
fs.writeFileSync('./src/json/allExercice.json', JSON.stringify(dictionnaire, null, 2))
