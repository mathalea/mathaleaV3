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

const files6e = getAllFiles('./src/exercices/6e')

const dictionnaire = {}

for (let url of files6e) {
  url = '../' + url
  try {
    const { titre, datePublication, dateDeModifImportante, ref, uuid, interactifType, interactifReady, amcReady, amcType } = await import(url)
    url = url.replace('../src/exercices/', '')
    dictionnaire[ref] = { ref, uuid, url, titre, datePublication, dateDeModifImportante, tags: {interactif: interactifReady, interactifType, amc: amcReady, amcType} }
  } catch (error) {
    console.log(error)
  }
}

console.log(dictionnaire)

//  "3L11-10": {
//     "datePublication": "23/02/2023",
//     "tags": {
//       "AMC": false,
//       "Interactif": false,
//       "Can": false
//     },
//     "titre": "Table de double distributivité",
//     "id": "3L11-10",
//     "url": "3e/3L11-10.js",
//     "uuid": "c8403"
//   },
