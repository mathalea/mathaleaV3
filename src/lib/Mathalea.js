import renderMathInElement from 'katex/dist/contrib/auto-render.js'
import Exercice from '../exercices/Exercice.js'
import seedrandom from 'seedrandom'
import { exercicesParams, freezeUrl, globalOptions, presModeId, updateGlobalOptionsInURL } from '../components/store'
import { get } from 'svelte/store'
import { setReponse } from '../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../modules/interactif/questionMathLive.js'
import uuidToUrl from '../json/uuidsToUrl.json'
import refToUuid from '../json/refToUuid.json'
import 'katex/dist/katex.min.css'
import renderScratch from './renderScratch.js'

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
        module = await import(`../exercices/can/${directory}/${filename.replace('.js', '')}.js`)
      } else {
        module = await import(`../exercices/${directory}/${filename.replace('.js', '')}.js`)
      }
      const ClasseExercice = module.default
      const exercice /** Promise<Exercice> */ = new ClasseExercice()
      ;['titre', 'amcReady', 'amcType', 'interactifType', 'interactifReady'].forEach((p) => {
        if (module[p] !== undefined) exercice[p] = module[p]
      })
      ;(await exercice).id = filename
      return exercice
    } catch (error) {
      console.log(`Chargement de l'exercice ${directory}/${filename} impossible`)
      console.log(error)
      const exercice = new Exercice()
      exercice.titre = `Exercice ${filename} - Problème à signaler`
      exercice.nouvelleVersion = () => {}
      return exercice
    }
  }

  static async getExercicesFromParams (params) {
    const exercices = []
    for (const param of params) {
      const exercice = await Mathalea.load(param.uuid)
      if (typeof exercice === 'undefined') continue
      exercice.uuid = param.uuid
      if (param.nbQuestions) exercice.nbQuestions = param.nbQuestions
      exercice.duration = param.duration ?? 10
      if (param.titre) exercice.titre = param.titre
      if (param.id) exercice.id = param.id
      if (param.sup) exercice.sup = param.sup
      if (param.sup2) exercice.sup2 = param.sup2
      if (param.sup3) exercice.sup3 = param.sup3
      if (param.sup4) exercice.sup4 = param.sup4
      if (param.interactif) exercice.interactif = param.interactif
      if (param.alea) exercice.seed = param.alea
      if (param.cd !== undefined) exercice.correctionDetaillee = param.cd === '1'
      if (exercice.seed === undefined) {
        exercice.seed = this.generateSeed({
          includeUpperCase: true,
          includeNumbers: true,
          length: 4,
          startsWithLowerCase: false
        })
      }
      exercices.push(exercice)
    }
    return exercices
  }

  static async loadFromUrlWithoutExtension (urlWithoutExtension) {
    if (urlWithoutExtension === undefined) return
    const uuid = Object.keys(uuidToUrl).find((key) => uuidToUrl[key] === urlWithoutExtension + '.js')
    const newEx = { uuid, id: urlWithoutExtension.split('/')[1] }
    exercicesParams.update((l) => {
      l.push(newEx)
      return l
    })
  }

  static renderDiv (div /** HTMLDivElement */, zoom) /** void */ {
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
      // Les accolades permettent d'avoir une formule non coupée
      preProcess: (chaine) => '{' + chaine.replaceAll(String.fromCharCode(160), '\\,') + '}',
      throwOnError: true,
      errorColor: '#CC0000',
      strict: 'warn',
      trust: false
    })
    renderScratch('body')
    const params = get(globalOptions)
    zoom = zoom ?? Number(params.z)

    if (zoom !== -1) {
      const qcms = div.querySelectorAll('.monQcm')
      for (const qcm of qcms) {
        qcm.style.fontSize = `${zoom}px`
      }
      const tables = div.querySelectorAll('#affichage_exercices label') // Pour les propositions des QCM
      for (const table of tables) {
        table.style.fontSize = `${zoom}px`
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
  }

  static updateUrl (exercicesParams) {
    if (get(freezeUrl) === true) return
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
      if (ex.interactif) url.searchParams.append('i', '1')
      if (ex.cd !== undefined) url.searchParams.append('cd', ex.cd)
      if (ex.cols !== undefined) url.searchParams.append('cols', ex.cols)
    }
    updateGlobalOptionsInURL(url)
  }

  /**
   * Analyse l'url courante de la fenêtre
   * pour mettre à jour exercicesParams
   * avec tous les exercices et les options
   * @returns vue
   */
  static loadExercicesFromUrl () {
    let v = ''
    let z = '1'
    let durationGlobal = 0
    let nbVues = 1
    let shuffle = false
    let trans = false
    let title = 'Exercices'
    let choice, sound, es
    let presMode = 'page'
    let setInteractive = '2'
    let isSolutionAccessible = true
    let isInteractiveFree = true
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    let indiceExercice = -1
    const newListeExercice = []
    let previousEntryWasUuid = false
    for (const entry of entries) {
      if (entry[0] === 'uuid') {
        indiceExercice++
        const uuid = entry[1]
        const id = Object.keys(refToUuid).find((key) => refToUuid[key] === uuid)
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
      } else if (entry[0] === 'alea') {
        newListeExercice[indiceExercice].alea = entry[1]
      } else if (entry[0] === 'i' && entry[1] === '1') {
        newListeExercice[indiceExercice].interactif = true
      } else if (entry[0] === 'cd') {
        newListeExercice[indiceExercice].cd = entry[1]
      } else if (entry[0] === 'cols') {
        newListeExercice[indiceExercice].cols = entry[1]
      } else if (entry[0] === 'v') {
        v = entry[1]
      } else if (entry[0] === 'z') {
        z = entry[1]
      } else if (entry[0] === 'dGlobal') {
        durationGlobal = parseInt(entry[1])
      } else if (entry[0] === 'nbVues') {
        nbVues = parseInt(entry[1])
      } else if (entry[0] === 'shuffle') {
        shuffle = true
      } else if (entry[0] === 'choice') {
        choice = parseInt(entry[1])
      } else if (entry[0] === 'trans') {
        trans = true
      } else if (entry[0] === 'sound') {
        sound = parseInt(entry[1])
      } else if (entry[0] === 'es') {
        es = entry[1]
      } else if (entry[0] === 'title') {
        title = entry[1]
      } else {
        if (entry[0] !== 'id') newListeExercice[indiceExercice][entry[0]] = entry[1]
      }
      if (entry[0] === 'uuid') previousEntryWasUuid = true
      else previousEntryWasUuid = false
    }
    exercicesParams.update((l) => {
      return newListeExercice
    })
    /**
     * es permet de résumer les réglages de la vue élève
     * Il est de la forme 2101
     * Avec un caractère par réglage presMode|setInteractive|isSolutionAccessible|isInteractiveFree
     */
    if (es && es.length === 4) {
      presMode = presModeId[es.charAt(0)]
      setInteractive = es.charAt(1)
      isSolutionAccessible = es.charAt(2) === '1'
      isInteractiveFree = es.charAt(3) === '1'
    }
    return {
      v,
      z,
      durationGlobal,
      nbVues,
      shuffle,
      choice,
      trans,
      sound,
      title,
      presMode,
      setInteractive,
      isSolutionAccessible,
      isInteractiveFree
    }
  }

  static handleExerciceSimple (exercice, isInteractif, numeroExercice) {
    if (numeroExercice !== undefined) exercice.numeroExercice = numeroExercice
    exercice.autoCorrection = []
    exercice.interactif = isInteractif
    exercice.listeQuestions = []
    exercice.listeCorrections = []
    exercice.listeCanEnonces = []
    exercice.listeCanReponsesACompleter = []
    for (let i = 0, cptSecours = 0; i < exercice.nbQuestions && cptSecours < 50;) {
      seedrandom(exercice.seed + i, { global: true })
      exercice.nouvelleVersion()
      if (exercice.questionJamaisPosee(i, exercice.question)) {
        setReponse(exercice, i, exercice.reponse, { formatInteractif: exercice.formatInteractif } || {})
        exercice.listeQuestions.push(
          exercice.question + ajouteChampTexteMathLive(exercice, i, exercice.formatChampTexte || {}, exercice.optionsChampTexte || {})
        )
        exercice.listeCorrections.push(exercice.correction)
        exercice.listeCanEnonces.push(exercice.canEnonce)
        exercice.listeCanReponsesACompleter.push(exercice.canReponseACompleter)
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
  if (txt === 'true' || txt === 'false') {
    // "true"=>true
    return txt === 'true'
  } else if (!isNaN(txt)) {
    // "17"=>17
    return parseInt(txt)
  } else {
    return txt
  }
}

export default Mathalea
