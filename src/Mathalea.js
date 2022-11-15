import renderMathInElement from 'katex/dist/contrib/auto-render.js'
import Exercice from './exercices/Exercice.js'
import seedrandom from 'seedrandom'
import { exercicesParams, globalOptions } from './components/store'
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

  static async loadFromUrlWithoutExtension (urlWithoutExtension) {
    if (urlWithoutExtension === undefined) return
    const uuid = Object.keys(uuidToUrl).find(key => uuidToUrl[key] === urlWithoutExtension + '.js')
    const newEx = { uuid, id: urlWithoutExtension.split('/')[1] }
    exercicesParams.update(l => {
      l.push(newEx)
      return l
    })
  }

  static renderDiv (div/** HTMLDivElement */, zoom )/** void */ {
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
    const params = get(globalOptions)
    zoom = zoom ?? Number(params.z)

    const qcms = div.querySelectorAll('.monQcm')
    for (const qcm of qcms) {
      ;(qcm).style.fontSize = `${zoom}px`
    }
    const tables = div.querySelectorAll('#affichage_exercices label') // Pour les propositions des QCM
    for (const table of tables) {
      ;(table).style.fontSize = `${zoom}px`
    }
    const figures = div.querySelectorAll('.mathalea2d')
    for (const figureElement of figures) {
      const figure = figureElement
      if (!figure.dataset.widthInitiale) figure.dataset.widthInitiale = figure.getAttribute('width')
      if (!figure.dataset.heightInitiale) figure.dataset.heightInitiale = figure.getAttribute('height')
      figure.setAttribute('height', (Number(figure.dataset.heightInitiale) * zoom).toString())
      figure.setAttribute('width', (Number(figure.dataset.widthInitiale) * zoom).toString())
    }
  }

  static updateUrl (exercicesParams) {
    const url = new URL(window.location.protocol + '//' + window.location.host + window.location.pathname)
    for (const ex of exercicesParams) {
      url.searchParams.append('uuid', ex.uuid)
      if (ex.id !== undefined) url.searchParams.append('id', ex.id)
      if (ex.nbQuestions !== undefined) url.searchParams.append('n', ex.nbQuestions)
      if (ex.duration !== undefined) url.searchParams.append('d', ex.duration)
      if (ex.sup !== undefined) url.searchParams.append('s', ex.sup)
      if (ex.sup2 !== undefined) url.searchParams.append('s2', ex.sup2)
      if (ex.sup3 !== undefined) url.searchParams.append('s3', ex.sup3)
      if (ex.sup4 !== undefined) url.searchParams.append('s4', ex.sup4)
      if (ex.alea !== undefined) url.searchParams.append('alea', ex.alea)
      if (ex.i) url.searchParams.append('i', 1)
      if (ex.cd !== undefined) url.searchParams.append('cd', ex.cd)
      if (ex.cols !== undefined) url.searchParams.append('cols', ex.cols)
    }
    const params = get(globalOptions)
    if (params.v) {
      url.searchParams.append('v', params.v)
    } else {
      url.searchParams.delete('v')
    }
    if (params.z && params.z !== '1') {
      url.searchParams.append('z', params.z)
    } else {
      url.searchParams.delete('z')
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
    let z = '1'
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
      } else if (entry[0] === 'z') {
        z = entry[1]
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
    return { v, z }
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

  /**
   * Pour la sortie HTML, il faut modifier certains codages LaTeX non pris en charge par KaTeX
   * @param {string} texte
   * @returns string
   */
  static formatExercice (texte = '') {
    return texte
      .replace(/\\dotfill/g, '..............................')
      .replace(/\\not=/g, '≠')
      .replace(/\\ldots/g, '....')
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
