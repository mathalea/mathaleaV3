/**
 * Ce script met à jours les fichiers json/referentiel2022.json, json/uuidsToUrl.json et json/refToUuid.json
 * qui servent au menu des exercices et aux chargements.
 * Remarque : une erreur sur un fichier est bloquante sauf si elle est à l'intérieur d'une fonction exportée
 */

import fs, { readFileSync } from 'fs'
import path from 'path'

const uuidUrls = {}
const refToUuid = {}
const exercicesList = []
let errors = ''

/**
 * On utilise emptyRef2022 pour initialiser referentiel2022 avec les niveaux et les catégories
 * En cas de création de niveau ou de chapitre, il faudra mettre à jour ce fichier
 */

const json = readFileSync('tasks/emptyRef2022.json')
const dictionnaire = JSON.parse(json)

/**
 * On gère les niveaux classiques avec seulement un sous-répertoire
 */
async function handleLevels () {
  for (const niveau of ['6e', '5e', '4e', '3e', '2e', '1e', 'c3', 'Ex', 'HP', 'PE', 'techno1']) {
    const dir = path.join('./src', 'exercices', niveau)
    const files = fs.readdirSync(dir)
    for await (const file of files) {
      let url = path.join(dir, file)
      /** On ignore les fichiers qui commencent par _ qui sont des méta-exercices */
      if (fs.statSync(url).isDirectory() || file.charAt(0) === '_') continue
      url = path.join('../', url).replaceAll('\\', '/')
      try {
        const { titre, datePublication, dateDeModifImportante, ref, uuid, interactifType, interactifReady, amcReady, amcType } = await import(url)
        url = url.replace('../src/exercices/', '')
        url = url.replace('..\\src\\exercices\\', '')
        if (uuid === undefined) {
          console.log(`${url} n'a pas de uuid, il faut l'ajouter. Faites pnpm getUuid pour obtenir un UUID disponible`)
          continue
        } else {
          if (uuid in uuidUrls) {
            errors += `\nUUID : ${uuid} en doublon !!!!\n`
          }
          uuidUrls[uuid] = url
        }
        if (ref === undefined) {
          console.log(`${url} n'a pas de ref, il faut l'ajouter`)
          continue
        }
        if (titre === undefined) {
          console.log(`${url} n'a pas de titre, il faut l'ajouter.`)
          continue
        }
        if (ref !== undefined && uuid !== undefined) {
          refToUuid[ref] = uuid
        }
        /** L'arborescence est complexe 2 premières lettres, 4 premières lettres, on n'a pas toujours la même règle pour les identifiants */
        const category = categoryByNiveau(niveau, ref)
        if (ref && dictionnaire[niveau] && dictionnaire[niveau][category] !== undefined) {
          dictionnaire[niveau][category][ref] = { id: ref, uuid, url, titre, datePublication, dateDeModifImportante, tags: { interactif: interactifReady, interactifType, amc: amcReady, amcType } }
          exercicesList.push(url)
        } else {
          console.log(`${url} non géré`)
        }
      } catch (error) {
        console.log(error)
        errors = error + '\n'
      }
    }
  }
}

/**
 * Fonction similaire à la précédente mais pour les CAN
 */
async function handleCanLevels () {
  for (const niveau of ['6e', '5e', '4e', '3e', '2e', '1e', 'c3', 'Ex']) {
    const dir = path.join('./src', 'exercices', 'can', niveau)
    const files = fs.readdirSync(dir)
    for await (const file of files) {
      let url = path.join(dir + path.sep, file)
      if (fs.statSync(url).isDirectory() || file.charAt(0) === '_') continue
      url = path.join('../', url).replaceAll('\\', '/')
      try {
        const { titre, dateDePublication, dateDeModifImportante, ref, uuid, interactifType, interactifReady, amcReady, amcType } = await import(url)
        url = url.replace('../src/exercices/', '')
        url = url.replace('..\\src\\exercices\\', '')
        const category = categoryCanByNiveau(niveau, ref)
        uuidUrls[uuid] = url
        exercicesList.push(url)
        if (ref && dictionnaire.CAN[niveau] && dictionnaire.CAN[niveau][category] !== undefined) {
          dictionnaire.CAN[niveau][category][ref] = { id: ref, uuid, url, titre, datePublication: dateDePublication, dateModification: dateDeModifImportante, tags: { interactif: interactifReady, interactifType, amc: amcReady, amcType } }
        } else {
          if (ref === undefined) {
            console.log(`${url} n'a pas de référence, il sera utilisable mais absent des menus`)
          } else {
            console.log(`${url} non géré`)
          }
        }
      } catch (error) {
        console.log(error)
        errors = error + '\n'
      }
    }
  }
}

/**
 * Le rangement des exercices dans une catégorie suit une règle par rapport au nom du fichier
 * mais cette règle dépend, hélas, des niveaux
 */
function categoryByNiveau (niveau, ref) {
  if (ref === undefined) return
  switch (niveau) {
    case 'c3':
      return ref.slice(0, 4)
    case 'Ex':
      return ref.slice(0, 4)
    case 'techno1':
      return ref.slice(7, 8)
    case 'HP':
      return ref.slice(0, 4)
    case 'PE':
      return ref.slice(0, 4)
    default:
      return ref.slice(0, 3)
  }
}

function categoryCanByNiveau (niveau, ref) {
  if (ref === undefined) return
  switch (niveau) {
    case 'c3':
      return ref.slice(3, 6)
    case 'Ex':
      return ref.slice(0, 6)
    default:
      return ref.slice(0, 5)
  }
}

await handleLevels()
await handleCanLevels()
console.log(errors)

fs.writeFileSync(path.join('./src', 'json', 'referentiel2022.json'), JSON.stringify(dictionnaire, null, 2).replaceAll('"c3"', '"CM1/CM2"'))
fs.writeFileSync(path.join('./src', 'json', 'uuidsToUrl.json'), JSON.stringify(uuidUrls, null, 2))
fs.writeFileSync(path.join('./src', 'json', 'refToUuid.json'), JSON.stringify(refToUuid, null, 2))
