import renderMathInElement from 'katex/dist/contrib/auto-render.js'
import Exercice from './exercices/Exercice.js'
import seedrandom from 'seedrandom'
import { exercicesParams, displayOptions } from './components/store'
import { get } from 'svelte/store'
import { setReponse } from './interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from './interactif/questionMathLive'
import uuidToUrl from './json/uuidsToUrl.json'
import refToUuid from './json/refToUuid.json'
import 'katex/dist/katex.min.css'

// export type Settings = { sup?: boolean | string | number, sup2?: boolean | string | number, sup3?: boolean | string | number, sup4?: boolean | string | number, nbQuestions?: number, seed?: string }

/**
 * Ensemble de méthodes statiques pourgérer les exercices
 */
export class Mathalea {
  /**
 * Charge un exercice
 * Exemple : const exercice = loadExercice('3cvng')
 * @param {string} url
 * @returns {Promise<Exercice>} exercice
 */
  static async load (uuid) {
    if (uuid.substring(0, 5) === 'crpe-' || uuid.substring(0, 4) === 'dnb_' || uuid.substring(0, 4) === 'e3c_') {
      return this.loadStatic(uuid)
    } else {
      const url = uuidToUrl[uuid]
      const [filename, directory, isCan] = url.split('/').reverse()
      try {
        // L'import dynamique ne peut descendre que d'un niveau, les sous-répertoires de directory ne sont pas pris en compte
        // cf https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#globs-only-go-one-level-deep
        // L'extension doit-être visible donc on l'enlève avant de la remettre...
        let module
        if (isCan) {
          module = await import(`./exercices/can/${directory}/${filename.replace('.js', '')}.js`)
        } else {
          module = await import(`./exercices/${directory}/${filename.replace('.js', '')}.js`)
        }
        const ClasseExercice = module.default
        const exercice /** Promise<Exercice> */= new ClasseExercice()
          ;['titre', 'amcReady', 'amcType', 'interactifType', 'interactifReady'].forEach((p) => {
          if (module[p] !== undefined) exercice[p] = module[p]
        })
        ;(await exercice).id = filename
        return exercice
      } catch (error) {
        console.log(`Chargement de l'exercice ${directory}/${filename} impossible`)
        const exercice = new Exercice()
        exercice.contenu = `<h3>La référence ${directory}/${filename} n'existe pas !</h3>`
        return exercice
      }
    }
  }

  static async loadFromUrlWithoutExtension (urlWithoutExtension) {
    if (urlWithoutExtension === undefined) return
    const uuid = Object.keys(uuidToUrl).find(key => uuidToUrl[key] === urlWithoutExtension + '.js')
    const newEx = { uuid, id: urlWithoutExtension.split('/')[1] }
    exercicesParams.update(l => {
      l.push(newEx)
      return l
    })
  }

  // /**
  //  * Change les paramètres d'un exercice
  //  * Exemple : changeSettingsExercice(exercice2, { sup: true, nbQuestions: 3 })
  //  * @param {Promise<Exercice>} promiseExercice
  //  * @param {Settings }settings
  //  */
  // static async changeSettings (promiseExercice/**  Promise<Exercice> */, settings)/** Promise<void> */ {
  //   const exercice = await promiseExercice
  //   if (settings !== undefined) {
  //     if (settings.sup !== undefined) exercice.sup = settings.sup
  //     if (settings.sup2 !== undefined) exercice.sup2 = settings.sup2
  //     if (settings.sup3 !== undefined) exercice.sup3 = settings.sup3
  //     if (settings.sup4 !== undefined) exercice.sup4 = settings.sup4
  //     if (settings.nbQuestions !== undefined) exercice.nbQuestions = settings.nbQuestions
  //     if (settings.seed !== undefined) exercice.seed = settings.seed
  //   }
  // }

  static renderDiv (div/** HTMLDivElement */)/** void */ {
    // KaTeX à remplacer par MathLive ?
    // renderMathInElement(div, {
    //   TeX: {
    //     delimiters: {
    //       display: [['\\(', '\\)']],
    //       inline: [['$', '$']]
    //     }
    //   },
    //   fontsDirectory: '/fonts'
    // })

    renderMathInElement(div, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false }
      ],
      preProcess: (chaine) => chaine.replaceAll(String.fromCharCode(160), '\\,'),
      throwOnError: true,
      errorColor: '#CC0000',
      strict: 'warn',
      trust: false
    })
  }

  static updateUrl (exercicesParams) {
    const url = new URL(window.location.protocol + '//' + window.location.host + window.location.pathname)
    for (const ex of exercicesParams) {
      url.searchParams.append('uuid', ex.uuid)
      url.searchParams.append('id', ex.id)
      if (ex.nbQuestions !== undefined) url.searchParams.append('n', ex.nbQuestions)
      if (ex.duration !== undefined) url.searchParams.append('d', ex.duration)
      if (ex.sup !== undefined) url.searchParams.append('s', ex.sup)
      if (ex.sup2 !== undefined) url.searchParams.append('s2', ex.sup2)
      if (ex.sup3 !== undefined) url.searchParams.append('s3', ex.sup3)
      if (ex.sup4 !== undefined) url.searchParams.append('s4', ex.sup4)
      url.searchParams.append('alea', ex.alea)
      if (ex.i) url.searchParams.append('i', 1)
      if (ex.cd !== undefined) url.searchParams.append('cd', ex.cd)
      if (ex.cols !== undefined) url.searchParams.append('cols', ex.cols)
    }
    const params = get(displayOptions)
    if (params.v) {
      url.searchParams.append('v', params.v)
    } else {
      url.searchParams.delete('v')
    }
    window.history.pushState({}, '', url)
  }

  /**
   * Analyse l'url courante de la fenêtre
   * pour en charger tous les exercices demandés
   * @returns vue
   */
  static loadExercicesFromUrl () {
    let v = ''
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    let indiceExercice = -1
    const newListeExercice = []
    let previousEntryWasUuid = false
    for (const entry of entries) {
      if (entry[0] === 'uuid') {
        indiceExercice++
        const uuid = entry[1]
        const id = Object.keys(refToUuid).find(key => refToUuid[key] === uuid)
        if (!newListeExercice[indiceExercice]) newListeExercice[indiceExercice] = {}
        newListeExercice[indiceExercice].uuid = uuid // string
        newListeExercice[indiceExercice].id = id // string
      } else if (entry[0] === 'id' && !previousEntryWasUuid) {
        // En cas de présence d'un uuid juste avant, on ne tient pas compte de l'id
        indiceExercice++
        if (!newListeExercice[indiceExercice]) newListeExercice[indiceExercice] = {}
        const id = entry[1]
        const uuid = refToUuid[id]
        newListeExercice[indiceExercice].id = id // string
        newListeExercice[indiceExercice].uuid = uuid // string
      } else if (entry[0] === 'n') {
        newListeExercice[indiceExercice].nbQuestions = parseInt(entry[1]) // int
      } else if (entry[0] === 'd') {
        newListeExercice[indiceExercice].duration = parseInt(entry[1]) // int
      } else if (entry[0] === 's') {
        newListeExercice[indiceExercice].sup = _handleStringFromUrl(entry[1]) // string | number | boolean
      } else if (entry[0] === 's2') {
        newListeExercice[indiceExercice].sup2 = _handleStringFromUrl(entry[1])
      } else if (entry[0] === 's3') {
        newListeExercice[indiceExercice].sup3 = _handleStringFromUrl(entry[1])
      } else if (entry[0] === 's4') {
        newListeExercice[indiceExercice].sup4 = _handleStringFromUrl(entry[1])
      } else if (entry[0] === 'v') {
        v = entry[1]
      } else if (entry[0] === 'alea') {
        newListeExercice[indiceExercice].alea = entry[1]
      } else if (entry[0] === 'i' && entry[1] === '1') {
        newListeExercice[indiceExercice].interactif = true
      } else if (entry[0] === 'cd') {
        newListeExercice[indiceExercice].cd = entry[1]
      } else if (entry[0] === 'cols') {
        newListeExercice[indiceExercice].cols = entry[1]
      } else {
        if (entry[0] !== 'id') newListeExercice[indiceExercice][entry[0]] = entry[1]
      }

      if (entry[0] === 'uuid') previousEntryWasUuid = true
      else previousEntryWasUuid = false
    }
    exercicesParams.update((l) => {
      return newListeExercice
    })
    return { v }
  }

  static loadStatic (uuid) {
    const exercice = { typeExercice: 'static', uuid }
    const promise = new Promise((resolve, reject) => {
      resolve(exercice)
    })
    return promise
  }

  static handleExerciceSimple (exercice, isInteractif) {
    exercice.autoCorrection = []
    exercice.interactif = isInteractif
    exercice.listeQuestions = []
    exercice.listeCorrections = []
    for (let i = 0, cptSecours = 0; i < exercice.nbQuestions && cptSecours < 50;) {
      seedrandom(exercice.seed + i, { global: true })
      exercice.nouvelleVersion()
      if (exercice.questionJamaisPosee(i, exercice.question)) {
        setReponse(exercice, i, exercice.reponse, { formatInteractif: exercice.formatInteractif } || {})
        exercice.listeQuestions.push(exercice.question + ajouteChampTexteMathLive(exercice, i, exercice.formatChampTexte || {}, exercice.optionsChampTexte || {}))
        exercice.listeCorrections.push(exercice.correction)
        cptSecours = 0
        i++
      } else {
        cptSecours++
      }
    }
  }

  /**
  * Créé un string aléatoire
  *
  * generateSeed({
  *  includeUpperCase: true,
  *  includeNumbers: true,
  *  length: 5,
  *  startsWithLowerCase: true
  * });
  *
  * // renvoie par exemple : "iL0v3"
  *
  * @Source https://www.equinode.com/blog/article/generer-une-chaine-de-caracteres-aleatoire-avec-javascript
  */
  static generateSeed (o) {
    let a = 10
    const b = 'abcdefghijklmnopqrstuvwxyz'
    let c = ''
    let d = 0
    let e = '' + b
    if (o) {
      if (o.startsWithLowerCase) {
        c = b[Math.floor(Math.random() * b.length)]
        d = 1
      }
      if (o.length) {
        a = o.length
      }
      if (o.includeUpperCase) {
        e += b.toUpperCase()
      }
      if (o.includeNumbers) {
        e += '1234567890'
      }
    }
    for (; d < a; d++) {
      c += e[Math.floor(Math.random() * e.length)]
    }
    return c
  }
}

function _handleStringFromUrl (txt) {
  if (txt === 'true' || txt === 'false') { // "true"=>true
    return (txt === 'true')
  } else if (!isNaN(txt)) { // "17"=>17
    return parseInt(txt)
  } else {
    return txt
  }
}

// Ancien code pour le statique
// const exercicePromise /** Exercice */= new Exercice()
// const exercice = await exercicePromise
// if (filename.includes('dnb')) {
//   exercice.titre = 'Exercice type DNB'
// }
// if (filename.includes('e3c')) {
//   exercice.titre = 'Exercice type E3C'7
// }
// if (filename.includes('bac')) {
//   exercice.titre = 'Exercice type BAC'
// }
// if (filename.includes('crpe')) {
//   exercice.titre = 'Exercice type CRPE'
// }
// const cutFilename = filename.split('_')
// let type, year
// if (filename.includes('dnb') || filename.includes('e3c') || filename.includes('bac')) {
//   type = cutFilename[0]
//   year = cutFilename[1]
// }
// if (filename.includes('crpe')) {
//   type = cutFilename[0]
//   year = cutFilename[1].split('-')[0]
// }

// const subDir = `${type}/${year}/tex/png`
// exercice.consigne = `<img src="./src/${directory}/${subDir}/${filename}.png" width="50%"></img>`
// exercice.consigneCorrection = `<img src="./src/${directory}/${subDir}/${filename}_cor.png" width="50%"></img>`
// exercice.typeExercice = 'statique'
// exercice.interactifReady = false
// exercice.nbQuestionsModifiable = false
// return exercice
