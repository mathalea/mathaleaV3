import fs from 'fs'
import path from 'path'

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

const allExercices = getAllFiles('./src/exercices/')

const uuids = new Set()
let errors = ''

for (let url of allExercices) {
  url = '../' + url
  try {
    const { uuid } = await import(url)
    if (uuid === undefined) {
      console.log(url + 'n\'a pas d\'UUID')
    } else if (uuids.has(uuid)) {
      console.log(uuid + ' en doublon !!!!!!!')
    }
    uuids.add(uuid)
  } catch (error) {
    console.log(error)
    errors = error + '\n'
  }
}

let uuid = createUuid()
while (uuids.has(uuid)) {
  uuid = createUuid
}
console.log(errors)
console.log(uuid)
