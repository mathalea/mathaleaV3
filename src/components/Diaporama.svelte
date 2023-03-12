<script lang="ts">
  import { onMount, tick } from "svelte"
  import { Mathalea } from "../lib/Mathalea"
  import { exercicesParams, globalOptions, questionsOrder, selectedExercises, transitionsBetweenQuestions, darkMode } from "./store"
  import type Exercice from "./utils/typeExercice"
  import seedrandom from "seedrandom"
  import { tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"
  import { context } from "../modules/context.js"
  import { shuffle, listOfRandomIndexes } from "./utils/shuffle"
  import ModalActionWithDialog from "./modal/ModalActionWithDialog.svelte"
  import { showDialogForLimitedTime } from "./utils/dialogs"
  import { copyLinkToClipboard, copyQRCodeImageToClipboard } from "./utils/clipboard"
  import { formattedTimeStamp, setPhraseDuree } from "./utils/time"
  import ModalForQRCode from "./modal/ModalForQRCode.svelte"
  import FormRadio from "./forms/FormRadio.svelte"

  let divQuestion: HTMLDivElement[] = []
  let divTableDurationsQuestions: HTMLElement
  let stepsUl: HTMLUListElement
  let currentQuestion = -1 // -1 pour l'intro et questions[0].length pour l'outro
  let isFullScreen = false
  let isPause = false
  let isCorrectionVisible = false
  let isQuestionVisible = true
  let isSameDurationForAll = false
  let userZoom = 0.85
  let currentZoom = userZoom
  let exercices: Exercice[] = []
  let questions: [string[], string[], string[], string[]] = [[], [], [], []] // Concaténation de toutes les questions des exercices de exercicesParams, vue par vue
  let corrections: [string[], string[], string[], string[]] = [[], [], [], []]
  let sizes: number[] = []
  let consignes: [string[], string[], string[], string[]] = [[], [], [], []]
  let durations: number[] = []
  let durationGlobal: number = $globalOptions.durationGlobal
  let previousDurationGlobal = 10 // Utile si on décoche puis recoche "Même durée pour toutes les questions"
  let ratioTime = 0 // Pourcentage du temps écoulé (entre 1 et 100)
  $: isManualModeActive = false
  let progress = tweened(0, {
    duration: durationGlobal ?? durations[currentQuestion] ?? 10,
    easing: cubicOut,
  })
  let myInterval: number
  let currentDuration: number
  let totalDuration: number = null
  let nbOfVues = $globalOptions.nbVues || 1
  $questionsOrder.isQuestionsShuffled = $globalOptions.shuffle
  $selectedExercises.count = $globalOptions.choice
  if ($selectedExercises.count !== undefined) {
    $selectedExercises.isActive = true
  }
  $transitionsBetweenQuestions.isActive = $globalOptions.trans
  $transitionsBetweenQuestions.tune = $globalOptions.sound
  if ($transitionsBetweenQuestions.tune !== undefined) {
    $transitionsBetweenQuestions.isNoisy = true
  }
  let formatQRCodeIndex: number = 0
  let QRCodeWidth = 100
  let stringDureeTotale = "0"
  // variables pour les transitions entre questions
  const transitionSounds = [
    new Audio("assets/sounds/transition_sound_01.mp3"),
    new Audio("assets/sounds/transition_sound_02.mp3"),
    new Audio("assets/sounds/transition_sound_03.mp3"),
    new Audio("assets/sounds/transition_sound_04.mp3"),
  ]
  const labelsForSounds = [
    { label: "Son 1", value: 0 },
    { label: "Son 2", value: 1 },
    { label: "Son 3", value: 2 },
    { label: "Son 4", value: 3 },
  ]
  const labelsForMultivue = [
    { label: "Pas de multivue", value: 1 },
    { label: "Deux vues", value: 2 },
    { label: "Trois vues", value: 3 },
    { label: "Quatre vues", value: 4 },
  ]

  if ($globalOptions && $globalOptions.durationGlobal) {
    isSameDurationForAll = true
  }

  onMount(async () => {
    context.vue = "diap"
    Mathalea.updateUrl($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
      const exercice: Exercice = await Mathalea.load(paramsExercice.uuid)
      if (exercice === undefined) return
      exercice.uuid = paramsExercice.uuid
      if (paramsExercice.nbQuestions) exercice.nbQuestions = paramsExercice.nbQuestions
      exercice.duration = paramsExercice.duration ?? 10
      if (paramsExercice.titre) exercice.titre = paramsExercice.titre
      if (paramsExercice.id) exercice.id = paramsExercice.id
      if (paramsExercice.sup) exercice.sup = paramsExercice.sup
      if (paramsExercice.sup2) exercice.sup2 = paramsExercice.sup2
      if (paramsExercice.sup3) exercice.sup3 = paramsExercice.sup3
      if (paramsExercice.sup4) exercice.sup4 = paramsExercice.sup4
      if (paramsExercice.interactif) exercice.interactif = paramsExercice.interactif
      if (paramsExercice.alea) exercice.seed = paramsExercice.alea
      if (paramsExercice.cd !== undefined) exercice.correctionDetaillee = paramsExercice.cd === "1"
      if (exercice.seed === undefined)
        exercice.seed = Mathalea.generateSeed({
          includeUpperCase: true,
          includeNumbers: true,
          length: 4,
          startsWithLowerCase: false,
        })
      exercices.push(exercice)
    }
    exercices = exercices
    if (!$selectedExercises.isActive) {
      $selectedExercises.indexes = [...Array(exercices.length).keys()]
    } else {
      $selectedExercises.indexes = [...listOfRandomIndexes(exercices.length, $selectedExercises.count)]
    }
    updateExercices()
    await tick()
    if (divTableDurationsQuestions) Mathalea.renderDiv(divTableDurationsQuestions)
  })

  async function updateExercices() {
    Mathalea.updateUrl($exercicesParams)
    questions = [[], [], [], []]
    corrections = [[], [], [], []]
    consignes = [[], [], [], []]
    sizes = []
    durations = []
    for (let idVue = 0; idVue < nbOfVues; idVue++) {
      consignes[idVue] = []
      questions[idVue] = []
      corrections[idVue] = []
      for (const [k, exercice] of exercices.entries()) {
        if (idVue > 0) {
          exercice.seed = exercice.seed.substring(0, 4) + idVue
        } else {
          exercice.seed = exercice.seed.substring(0, 4)
        }
        if (exercice.typeExercice === "simple") Mathalea.handleExerciceSimple(exercice, false)
        seedrandom(exercice.seed, { global: true })
        exercice.nouvelleVersion()
        let consigne: string = ""
        if ($selectedExercises.indexes.includes(k)) {
          if (exercice.introduction) {
            consigne = exercice.consigne + "\n" + exercice.introduction
          } else {
            consigne = exercice.consigne
          }
          for (let j = 0; j < exercice.listeQuestions.length; j++) {
            consignes[idVue].push(consigne) // même consigne pour toutes les questions
          }
          questions[idVue] = [...questions[idVue], ...exercice.listeQuestions]
          corrections[idVue] = [...corrections[idVue], ...exercice.listeCorrections]
          consignes[idVue] = consignes[idVue].map(Mathalea.formatExercice)
          questions[idVue] = questions[idVue].map(Mathalea.formatExercice)
          corrections[idVue] = corrections[idVue].map(Mathalea.formatExercice)
        }
      }
    }
    let newParams = []
    for (const [k, exercice] of exercices.entries()) {
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        sizes.push(exercice.tailleDiaporama)
        durations.push(exercice.duration)
      }
      newParams.push({
        uuid: exercice.uuid,
        id: exercice.id,
        alea: exercice.seed.substring(0, 4),
        nbQuestions: exercice.nbQuestions,
        duration: exercice.duration,
        sup: exercice.sup,
        sup2: exercice.sup2,
        sup3: exercice.sup3,
        sup4: exercice.sup4,
      })
    }
    globalOptions.update((l) => {
      l.nbVues = nbOfVues
      return l
    })
    exercicesParams.update((l) => newParams)
    Mathalea.updateUrl(newParams)
    totalDuration = getTotalDuration()
    stringDureeTotale = formattedTimeStamp(getTotalDuration())
    if (divTableDurationsQuestions) Mathalea.renderDiv(divTableDurationsQuestions)
    // préparation des indexes si l'ordre aléatoire est demandé
    if ($questionsOrder.isQuestionsShuffled) {
      $questionsOrder.indexes = shuffle([...Array(questions[0].length).keys()])
    } else {
      $questionsOrder.indexes = [...Array(questions[0].length).keys()]
    }
  }

  function handleShortcut(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      prevQuestion()
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      nextQuestion()
    }
    if (e.key === " ") {
      e.preventDefault()
      if (durationGlobal !== 0) switchPause()
    }
  }

  // ================================================================================
  //
  //  Gestion de la navigation
  //
  // ================================================================================

  async function goToQuestion(i: number) {
    if (i >= -1 && i <= questions[0].length) currentQuestion = i
    if (i === -1 || i === questions[0].length) pause()
    await tick()
    for (let k = 0; k < nbOfVues; k++) {
      if (divQuestion[k]) {
        currentZoom = userZoom
        setSize()
      }
    }

    if (!isManualModeActive) {
      if (!isPause) {
        if ($transitionsBetweenQuestions.isNoisy) {
          transitionSounds[$transitionsBetweenQuestions.tune].play()
        }
        if ($transitionsBetweenQuestions.isActive) {
          showDialogForLimitedTime("transition", 1000).then(() => {
            timer(durationGlobal ?? durations[currentQuestion] ?? 10)
          })
        } else {
          timer(durationGlobal ?? durations[currentQuestion] ?? 10)
        }
      }
    }
    currentDuration = durationGlobal ?? durations[currentQuestion] ?? 10
  }

  function prevQuestion() {
    if (currentQuestion > -1) goToQuestion(currentQuestion - 1)
  }

  function nextQuestion() {
    if (currentQuestion < questions[0].length) goToQuestion(currentQuestion + 1)
  }

  /**
   * Pour le bouton de retour de la page de fin
   */
  function returnToStart() {
    durationGlobal = 0
    pause()
    goToQuestion(0)
  }

  /**
   * Gestion du clic sur l'étape dans la progression
   * @param {number} index index de l'étape
   */
  function clickOnStep(index) {
    goToQuestion(index)
  }

  // =========================== Fin gestion de la navigation ===============================

  // ================================================================================
  //
  //  Gestion du temps
  //
  // ================================================================================

  function timer(timeQuestion = 5, reset = true) {
    // timeQuestion est le temps de la question exprimé en secondes
    if (timeQuestion === 0) {
      pause()
      ratioTime = 0
    } else {
      if (reset) ratioTime = 0
      isPause = false
      clearInterval(myInterval)
      myInterval = window.setInterval(() => {
        ratioTime = ratioTime + 1 // ratioTime est le pourcentage du temps écoulé
        if (ratioTime >= 100) {
          clearInterval(myInterval)
          nextQuestion()
        }
      }, timeQuestion * 10)
    }
  }

  function switchPause() {
    if (!isPause) {
      pause()
    } else timer(durationGlobal ?? durations[currentQuestion] ?? 10, false)
  }

  function pause() {
    clearInterval(myInterval)
    isPause = true
  }

  let cursorTimeValue = 10
  /**
   * Gère la récupération de la valeur du curseur de temps
   */
  function handleTimerChange(event) {
    durationGlobal = 0
    pause()
    if (cursorTimeValue === 0) {
      isManualModeActive = true
    } else {
      isManualModeActive = false
      durationGlobal = cursorTimeValue
      isSameDurationForAll = true
      handleChangeDurationGlobal()
    }
    goToQuestion(currentQuestion)
  }

  function handleChangeDurationGlobal() {
    globalOptions.update((l) => {
      l.durationGlobal = durationGlobal
      return l
    })
    updateExercices()
  }

  function handleCheckSameDurationForAll() {
    globalOptions.update((l) => {
      l.durationGlobal = null
      return l
    })
    handleChangeDurationGlobal()
    // updateExercices()  <-- inutile puisque handleCHangeDUrationGlobal() appelle déjà cette fonction
  }

  $: messageDuree = setPhraseDuree(cursorTimeValue)

  $: displayCurrentDuration = () => {
    return isManualModeActive ? "Manuel" : currentDuration + "s"
  }

  /**
   * Calcule la durée totale du diaporama
   * (durée par question x nombre de questions)
   */
  function getTotalDuration() {
    let sum = 0
    for (let [i, exercice] of exercices.entries()) {
      if ($selectedExercises.isActive) {
        if ($selectedExercises.indexes.includes(i)) {
          sum += (isSameDurationForAll ? durationGlobal : exercice.duration) * exercice.nbQuestions
        }
      } else {
        sum += (isSameDurationForAll ? durationGlobal : exercice.duration) * exercice.nbQuestions
      }
    }
    return sum
  }

  /**
   * Calcule le nombre total de questions
   */
  $: getTotalNbOfQuestions = () => {
    let sum = 0
    for (let [i, exercice] of exercices.entries()) {
      if ($selectedExercises.isActive) {
        if ($selectedExercises.indexes.includes(i)) {
          sum += exercice.nbQuestions
        }
      } else {
        sum += exercice.nbQuestions
      }
    }
    return sum
  }

  function handleCheckManualMode() {
    isManualModeActive = !isManualModeActive
  }

  $: {
    if (divTableDurationsQuestions) Mathalea.renderDiv(divTableDurationsQuestions)
    if (durationGlobal) previousDurationGlobal = durationGlobal
    if (isSameDurationForAll && previousDurationGlobal) durationGlobal = previousDurationGlobal

    if (isSameDurationForAll && durationGlobal === null) {
      durationGlobal = 10
    } else if (!isSameDurationForAll) {
      durationGlobal = null
    }
    let steps: NodeListOf<HTMLLIElement>
    if (stepsUl) steps = stepsUl.querySelectorAll("li")
    if (steps) {
      if (steps[currentQuestion]) steps[currentQuestion].scrollIntoView()
      if (steps[currentQuestion + 5]) steps[currentQuestion + 5].scrollIntoView()
      if (steps[currentQuestion - 5] && !isInViewport(steps[currentQuestion - 5])) steps[currentQuestion - 5].scrollIntoView()
    }
  }
  // =========================== Fin gestion du temps ===============================

  // ================================================================================
  //
  //  Gestion de la taille
  //
  // ================================================================================

  /**
   * Déterminer les tailles optimales de la fonte et des illustrations dans chaque question.<br>
   * <u>Principe :</u>
   * <ul>
   *  <li> on récupère les dimensions carton (id='textcell...')</li>
   *  <li> on détermine la hauteur et la largeur optimale pour les figures (class='mathalea2d')</li>
   *  <li> on ajuste hauteur/largeur des figures en préservant le ratio</li>
   *  <li> on applique une taille de caractère volontairement grosse aux textes (consigne+question+correction)</li>
   *  <li> on réduit cette taille jsqu'à ce que la hauteur ne dépasse pas celle du container (id='textcell...')</li>
   * </ul>
   * @author sylvain
   */
  async function setSize() {
    // let startSize = 0
    for (let i = 0; i < nbOfVues; i++) {
      if (typeof divQuestion[i] !== "undefined") {
        Mathalea.renderDiv(divQuestion[i], -1)
        const textcell_div = document.getElementById("textcell" + i) as HTMLDivElement
        const consigne_div = document.getElementById("consigne" + i) as HTMLDivElement
        const question_div = document.getElementById("question" + i) as HTMLDivElement
        const correction_div = document.getElementById("correction" + i) as HTMLDivElement
        const svg_divs = document.getElementsByClassName("mathalea2d") as HTMLCollectionOf<SVGElement>
        let textcell_width = textcell_div.clientWidth
        let textcell_height = textcell_div.clientHeight
        let finalSVGHeight = 0
        // Donner la bonne taille aux figures
        if (svg_divs.length !== 0 && question_div !== null) {
          const nbOfSVG = svg_divs.length
          const optimalSVGWidth = textcell_width * 0.6
          const coefHeight = isCorrectionVisible ? 0.3 : 0.5
          const optimalSVGHeigth = textcell_height * coefHeight
          // console.log("optimal SVG width : " + optimalSVGWidth + "/ optimal heigth : " + optimalSVGHeigth)
          for (let k = 0; k < nbOfSVG; k++) {
            const startingWidth = svg_divs[k].clientWidth
            const startingHeight = svg_divs[k].clientHeight
            // console.log("starting width : " + startingWidth + " / strating height : " + startingHeight)
            const rw = optimalSVGWidth / startingWidth
            const rh = optimalSVGHeigth / startingHeight
            if (startingHeight * rw < optimalSVGHeigth) {
              svg_divs[k].setAttribute("width", (optimalSVGWidth * currentZoom).toString())
              svg_divs[k].setAttribute("height", (svg_divs[k].clientHeight * rw * currentZoom).toString())
            } else {
              svg_divs[k].setAttribute("height", (optimalSVGHeigth * currentZoom).toString())
              svg_divs[k].setAttribute("width", (svg_divs[k].clientWidth * rh * currentZoom).toString())
            }
            svg_divs[k].removeAttribute("style")
            if (nbOfSVG > 1) {
              svg_divs[k].setAttribute("style", "display: inline")
            } else {
              svg_divs[k].setAttribute("style", "margin: auto")
            }
            // console.log("final dimensions : " + svg_divs[k].clientWidth + " x " + svg_divs[k].clientHeight)
            if (finalSVGHeight < parseInt(svg_divs[k].getAttribute("height"))) {
              finalSVGHeight = parseInt(svg_divs[k].getAttribute("height"))
            }
          }
        }
        // Donner la bonne taille au texte
        let nbOfCharactersInTextDiv = textcell_div.textContent.length
        if (finalSVGHeight !== 0) {
          nbOfCharactersInTextDiv -= 100
        }
        // let size = nbOfVues > 1 ? 100 : 300
        let size = (300 - Math.floor(nbOfCharactersInTextDiv / 50) * 30) * (1 - finalSVGHeight / textcell_height)
        if (nbOfVues === 2) {
          size = size * 0.7
        } else {
          if (nbOfVues > 2) {
            size = size / 3
          }
        }
        // startSize = size
        let consigne_height, correction_height, question_height: number
        do {
          size = size - 2
          if (question_div !== null) {
            question_div.style.fontSize = size + "px"
            question_height = question_div.clientHeight
          } else {
            question_height = 0
          }
          if (consigne_div !== null) {
            consigne_div.style.fontSize = size + "px"
            consigne_height = consigne_div.clientHeight
          } else {
            consigne_height = 0
          }
          if (correction_div !== null) {
            correction_div.style.fontSize = size + "px"
            correction_height = correction_div.clientHeight
          } else {
            correction_height = 0
          }
          // console.log("question w=" + question_width + "/h=" + question_height)
          // console.log("consigne w=" + consigne_width + "/h=" + consigne_height)
          // console.log("correction w=" + correction_width + "/h=" + correction_height)
          //  question_width > textcell_width || consigne_width > textcell_width || correction_width > textcell_width ||
        } while (question_height + consigne_height + correction_height > textcell_height)
        if (question_div !== null) {
          question_div.style.fontSize = currentZoom * size + "px"
        }
        if (consigne_div !== null) {
          consigne_div.style.fontSize = currentZoom * size + "px"
        }
        if (correction_div !== null) {
          correction_div.style.fontSize = currentZoom * size + "px"
        }
        // console.log("nb de caractères : " + nbOfCharactersInTextDiv + " / font-size départ : " + startSize + "font-size calculée : " + size + " / ratio : " + (1 - finalSVGHeight / textcell_height))
      }
    }
  }

  function zoomPlus() {
    // userZoom += 0.25
    if (userZoom < 1) {
      userZoom += 0.05
    } else {
      userZoom = 1
    }
    currentZoom = userZoom
    setSize()
  }

  function zoomMoins() {
    // if (userZoom > 1) userZoom -= 0.25
    // else if (userZoom > 0.2) userZoom -= 0.1
    if (userZoom > 0.1) {
      userZoom -= 0.05
    } else {
      userZoom = 0.1
    }
    currentZoom = userZoom
    setSize()
  }

  // pour recalculer les tailles lors d'un changement de dimension de la fenêtre
  window.onresize = (event) => {
    setSize()
  }

  // =========================== Fin gestion de la taille ===========================

  // ================================================================================
  //
  //  Organisation des questions et du contenu de l'affichage
  //
  // ================================================================================

  async function switchCorrectionMode() {
    // isCorrectionVisible = !isCorrectionVisible
    if (isQuestionVisible && !isCorrectionVisible) {
      isCorrectionVisible = !isCorrectionVisible
    } else {
      if (isQuestionVisible && isCorrectionVisible) {
        isQuestionVisible = !isQuestionVisible
      } else {
        if (!isQuestionVisible && isCorrectionVisible) {
          isQuestionVisible = !isQuestionVisible
          isCorrectionVisible = !isCorrectionVisible
        }
      }
    }
    await tick()
    setSize()
  }

  $: displayCurrentCorrectionMode = () => {
    let mode = ""
    if (isQuestionVisible && !isCorrectionVisible) {
      mode = "Q"
    }
    if (isQuestionVisible && isCorrectionVisible) {
      mode = "Q+C"
    }
    if (!isQuestionVisible && isCorrectionVisible) {
      mode = "C"
    }
    return mode
  }

  /**
   * Gestion de la sélection du choix des exercices dans la liste
   */
  function handleSampleChecked() {
    $selectedExercises.count = exercices.length - 1
    $selectedExercises.isActive = !$selectedExercises.isActive
    if (!$selectedExercises.isActive) {
      $selectedExercises.indexes = [...Array(exercices.length).keys()]
      globalOptions.update((l) => {
        l.choice = undefined
        return l
      })
      getTotalNbOfQuestions()
      updateExercices()
    } else {
      handleSampleSizeChange()
    }
  }

  /**
   * Gestion du changement du nombre d'exercices à utiliser
   * dans la liste de ceux sélectionnées
   *
   * 1/ on génère une liste d'indexes aléatoires sur laquelle
   * sera batie la liste des exercices à utiliser
   * 2/ on met à jours les paramètres dans les options et l'URL
   */
  function handleSampleSizeChange() {
    $selectedExercises.indexes = [...listOfRandomIndexes(exercices.length, $selectedExercises.count)]
    globalOptions.update((l) => {
      l.choice = $selectedExercises.count
      return l
    })
    getTotalNbOfQuestions()
    updateExercices()
  }

  /**
   * Gestion du bouton demandant de changer l'ordre des questions
   */
  function handleRandomQuestionOrder() {
    $questionsOrder.isQuestionsShuffled = !$questionsOrder.isQuestionsShuffled
    globalOptions.update((l) => {
      l.shuffle = $questionsOrder.isQuestionsShuffled
      return l
    })
    updateExercices()
  }

  /**
   * Gérer le changement d'affichage (quel composant remplace l'autre dans App.svelte)
   * @param {string} oldComponent composant à changer
   * @param {string} newComponent composant à afficher
   * @author sylvain
   */
  function handleComponentChange(oldComponent, newComponent) {
    const oldPart = "&v=" + oldComponent
    const newPart = newComponent === "" ? "" : "&v=" + newComponent
    const urlString = window.location.href.replace(oldPart, newPart)
    window.history.pushState(null, "", urlString)
    globalOptions.update((l) => {
      l.v = newComponent
      return l
    })
  }

  /**
   * Gérer le choix de cartons entre les questions
   * @author sylvain
   */
  function handleTransitionsMode() {
    $transitionsBetweenQuestions.isActive = !$transitionsBetweenQuestions.isActive
    globalOptions.update((l) => {
      l.trans = $transitionsBetweenQuestions.isActive
      return l
    })
    updateExercices()
  }

  /**
   * Gérer le choix de sons entre les questions
   * @author sylvain
   */
  function handleTransitionSound() {
    $transitionsBetweenQuestions.isNoisy = !$transitionsBetweenQuestions.isNoisy
    if ($transitionsBetweenQuestions.isNoisy) {
      if (typeof $transitionsBetweenQuestions.tune === "undefined") {
        $transitionsBetweenQuestions.tune = 0
      }
      globalOptions.update((l) => {
        l.sound = $transitionsBetweenQuestions.tune
        return l
      })
    } else {
      $transitionsBetweenQuestions.tune = undefined
      globalOptions.update((l) => {
        l.sound = undefined
        return l
      })
    }
    updateExercices()
  }

  /**
   * Met à jour le numéro du son dans l'URL
   * @author sylvain
   */
  function handleTuneChange() {
    globalOptions.update((l) => {
      l.sound = $transitionsBetweenQuestions.tune
      return l
    })
    updateExercices()
  }

  function switchFullScreen() {
    isFullScreen = !isFullScreen
    if (isFullScreen) {
      const app = document.querySelector("#diaporama")
      app.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  function handleQuit() {
    handleComponentChange("diaporama", "")
    // $selectedExercises.isActive = false
    updateExercices()
  }

  function isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect()
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  }
</script>

<svelte:window on:keyup={handleShortcut} />
<!-- Page d'accueil du diapo -->
<div id="diaporama" class={$darkMode.isActive ? "dark" : ""}>
  {#if currentQuestion === -1}
    <div id="start" class="flex flex-col h-screen scrollbar-hide bg-coopmaths-canvas text-coopmaths-corpus  dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus" data-theme="daisytheme">
      <div class="flex flex-row justify-between p-6">
        <div class="text-4xl text-coopmaths-struct font-bold">Réglages du Diaporama</div>
        <button type="button">
          <i
            class="relative bx ml-2 bx-lg bx-x text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer"
            on:click={() => handleComponentChange("diaporama", "")}
            on:keydown={() => handleComponentChange("diaporama", "")}
          />
        </button>
      </div>
      <div class="flex flex-row w-full justify-center items-start mx-20">
        <!-- Multivue + Liens -->
        <div class="flex flex-col w-1/5 justify-start">
          <div class="flex flex-row justify-start items-center pb-6">
            <div class="flex text-lg font-bold text-coopmaths-struct dark:text-coopmathsdark-struct">
              Aperçu
              <div class="flex flex-row px-4 justify-start">
                <div class="tooltip tooltip-bottom tooltip-neutral" data-tip="Aperçu des questions/réponses">
                  <button
                    type="button"
                    class="mr-4 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                    on:click={() => handleComponentChange("diaporama", "can")}
                  >
                    <i class="bx text-2xl bx-detail" />
                  </button>
                </div>
              </div>
            </div>
            <div class="flex text-lg font-bold text-coopmaths-struct  dark:text-coopmathsdark-struct">
              Plein écran
              <div class="flex flex-row px-4 justify-start">
                <button
                  type="button"
                  on:click={switchFullScreen}
                  class="mr-4 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                >
                  <i class="bx text-2xl {isFullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex text-lg font-bold mb-2 text-coopmaths-struct  dark:text-coopmathsdark-struct">Multivue</div>
          <div class="flex px-4 pb-8">
            <FormRadio bind:valueSelected={nbOfVues} on:newvalue={updateExercices} title="multivue" labelsValues={labelsForMultivue} />
          </div>

          <div class="pb-8">
            <div class="flex text-lg font-bold mb-1 text-coopmaths-struct  dark:text-coopmathsdark-struct">Transitions</div>
            <div class="flex flex-row justify-start items-center px-4">
              <button type="button" on:click={handleTransitionsMode}>
                <i
                  class="mt-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm {$transitionsBetweenQuestions.isActive
                    ? 'bx-toggle-right'
                    : 'bx-toggle-left'}"
                />
              </button>
              <div class="inline-flex pl-2">{$transitionsBetweenQuestions.isActive ? "Carton entre questions" : "Pas de carton entre questions"}</div>
            </div>
            <div class="flex flex-row justify-start items-center  px-4 -mt-2">
              <button type="button" on:click={handleTransitionSound}>
                <i
                  class="mt-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm {$transitionsBetweenQuestions.isNoisy
                    ? 'bx-toggle-right'
                    : 'bx-toggle-left'}"
                />
              </button>
              <div class="inline-flex pl-2">{$transitionsBetweenQuestions.isNoisy ? "Son entre questions" : "Pas de son entre questions"}</div>
            </div>
            <FormRadio
              title="son"
              isDisabled={!$transitionsBetweenQuestions.isNoisy}
              bind:valueSelected={$transitionsBetweenQuestions.tune}
              labelsValues={labelsForSounds}
              orientation="row"
              on:newvalue={() => {
                transitionSounds[$transitionsBetweenQuestions.tune].play()
                handleTuneChange()
              }}
            />
          </div>
          <div class="pb-6">
            <div class="flex text-lg font-bold mb-1 text-coopmaths-struct  dark:text-coopmathsdark-struct">Ordre</div>
            <div class="flex flex-row justify-start items-center px-4">
              <button type="button" on:click={handleRandomQuestionOrder}>
                <i
                  class="mt-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm {$questionsOrder.isQuestionsShuffled
                    ? 'bx-toggle-right'
                    : 'bx-toggle-left'}"
                />
              </button>
              <div class="inline-flex pl-2">{$questionsOrder.isQuestionsShuffled ? "Questions dans le désordre" : "Questions dans l'ordre"}</div>
            </div>
          </div>
          <div class="pb-6">
            <div class="flex text-lg font-bold mb-1 text-coopmaths-struct  dark:text-coopmathsdark-struct">Choix aléatoire</div>
            <div class="flex flex-row justify-start items-center px-4">
              <input
                id="checkbox-choice"
                aria-describedby="checkbox-choice"
                type="checkbox"
                class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded"
                checked={$selectedExercises.isActive}
                on:change={handleSampleChecked}
                disabled={exercices.length == 1}
              />
              <label
                for="checkbox-choice"
                class="ml-3 font-medium text-coopmaths-corpus dark:text-coopmathsdark-corpus {exercices.length == 1
                  ? 'text-opacity-30 dark:text-opacity-30'
                  : 'text-opacity-100 dark:text-opacity-100'}"
              >
                Seulement certains exercices de la liste
              </label>
            </div>
            <div class="pl-8">
              <input
                type="number"
                min="1"
                max={exercices.length}
                bind:value={$selectedExercises.count}
                on:change={handleSampleSizeChange}
                class="ml-3 w-14 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-canavs-darkest focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-0"
                disabled={!$selectedExercises.isActive}
              />
              <span class="text-coopmaths-corpus dark:text-coopmathsdark-corpus {$selectedExercises.isActive ? 'text-opacity-100 dark:text-opacity-100' : 'text-opacity-0 dark:text-opacity-0'}">
                parmi {exercices.length}</span
              >
            </div>
          </div>
          <div class="flex text-lg font-bold pb-2 text-coopmaths-struct  dark:text-coopmathsdark-struct">
            Liens
            <div class="flex flex-row px-4 -mt-2 justify-start">
              <ModalActionWithDialog
                on:display={() => copyLinkToClipboard("linkCopiedDialog-1")}
                message="Le lien est copié dans le presse-papier !"
                dialogId="linkCopiedDialog-1"
                tooltipMessage="Lien du Diaporama"
                classForButton="mr-4 my-2"
              />
              <ModalForQRCode classForButton="mr-4 my-2" dialogId="QRCodeModal-1" imageId="QRCodeCanvas-1" tooltipMessage="QR-code du diaporama" width={QRCodeWidth} format={formatQRCodeIndex} />
            </div>
          </div>
        </div>
        <!-- Tableau réglages -->
        <div class="flex flex-col w-4/6 justify-start">
          <div class="flex flex-col lg:flex-row px-4 pb-4 w-full justify-start lg:justify-between lg:items-center">
            <div class="flex text-lg font-bold text-coopmaths-struct dark:text-coopmathsdark-struct">Durées et nombres de questions</div>
            <div class="flex items-center">
              <input
                id="checkbox-2"
                aria-describedby="checkbox-2"
                type="checkbox"
                checked={isManualModeActive}
                class="bg-coopmaths-canvas border-coopmaths-action text-coopmaths-action dark:bg-coopmathsdark-canvas dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action h-4 w-4 rounded"
                on:change={handleCheckManualMode}
              />
              <label for="checkbox-2" class="ml-3 mr-4 font-medium text-coopmaths-corpus dark:text-coopmathsdark-corpus"> Défilement manuel </label>
              <input
                id="checkbox-1"
                aria-describedby="checkbox-1"
                type="checkbox"
                class="bg-coopmaths-canvas border-coopmaths-action text-coopmaths-action dark:bg-coopmathsdark-canvas dark:border-coopmathsdark-action dark:text-coopmathsdark-action 
                {exercices.length == 1 || isManualModeActive
                  ? 'border-opacity-30 dark:border-opacity-30'
                  : 'border-opacity-100 dark:border-opacity-100'} focus:ring-3 focus:ring-coopmaths-action h-4 w-4 rounded"
                bind:checked={isSameDurationForAll}
                on:change={handleCheckSameDurationForAll}
                disabled={exercices.length == 1 || isManualModeActive}
              />
              <label
                for="checkbox-1"
                class="ml-3 font-medium text-coopmaths-corpus dark:text-coopmathsdark-corpus 
                {exercices.length == 1 || isManualModeActive ? 'text-opacity-30 dark:text-opacity-30' : 'text-opacity-100 dark:text-opacity-100'} "
              >
                Même durée pour toutes les questions
                <input
                  type="number"
                  min="1"
                  on:change={handleChangeDurationGlobal}
                  bind:value={durationGlobal}
                  class="ml-3 w-20 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-2 border-transparent focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-30"
                  disabled={!isSameDurationForAll || isManualModeActive}
                />
              </label>
            </div>
          </div>

          <div class="flex flex-col min-w-full h-[100vh] px-4 align-middle" bind:this={divTableDurationsQuestions}>
            <div class="table-wrp block shadow ring-1 ring-coopmaths-struct dark:ring-coopmathsdark-struct ring-opacity-10 dark:ring-opacity-20 md:rounded-lg">
              <table class="table-fixed min-w-full divide-y divide-coopmaths-struct dark:divide-coopmathsdark-struct divide-opacity-10 dark:divide-opacity-20">
                <thead class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark sticky top-0">
                  <th scope="col" class="py-3.5 pl-4 pr-3 w-4/6 text-left text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct sm:pl">
                    Exercices<span class="pl-2 font-extralight text-opacity-60 {$selectedExercises.isActive ? '' : 'invisible'}">({$selectedExercises.count} parmi {exercices.length})</span>
                  </th>
                  <th scope="col" class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct">
                    <div>Durées par question (s)</div>
                    <div class="text-coopmaths-struct-light  dark:text-coopmathsdark-struct-light font-light text-xs">
                      Durée diapo :<span class="font-light ml-1">{stringDureeTotale}</span>
                    </div>
                  </th>
                  <th scope="col" class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct">
                    <div>Nombres de questions</div>
                    <div class="text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-light text-xs">Total :<span class="font-light ml-1">{getTotalNbOfQuestions()}</span></div>
                  </th>
                </thead>
                <tbody class="overflow-y-auto" id="exercisesList">
                  {#each exercices as exercice, i}
                    <tr>
                      <td class="whitespace-normal px-3 py-4 text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus">
                        <span class="{$selectedExercises.isActive && $selectedExercises.indexes.includes(i) ? '' : 'invisible'} pr-2"
                          ><i class="bx text-xs bxs-circle text-coopmaths-warn-lightest dark:text-coopmathsdark-warn-lightest" /></span
                        >
                        {exercice.id} - {exercice.titre}
                      </td>
                      <td class="whitespace-normal px-3 py-4 text-sm">
                        <span class="flex justify-center">
                          <input
                            type="number"
                            min="1"
                            on:change={updateExercices}
                            bind:value={exercice.duration}
                            class="ml-3 w-16 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 disabled:opacity-30"
                            disabled={isSameDurationForAll || isManualModeActive}
                          />
                        </span>
                      </td>
                      <td class="whitespace-normal px-3 py-4 text-sm">
                        <span class="flex justify-center">
                          <input
                            type="number"
                            min="1"
                            bind:value={exercice.nbQuestions}
                            on:change={updateExercices}
                            class="ml-3 w-16 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0"
                          />
                        </span>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>

            <div class="flex flex-row items-center justify-end w-full my-4">
              <button
                type="button"
                class="animate-pulse inline-flex items-center justify-center shadow-2xl w-2/12 bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest font-extrabold text-coopmaths-canvas dark:text-coopmathsdark-canvas text-3xl py-4 rounded-lg"
                on:click={() => {
                  goToQuestion(0)
                  if (!isManualModeActive) {
                    timer(durationGlobal ?? durations[currentQuestion] ?? 10)
                  }
                }}
                on:keydown={() => {
                  goToQuestion(0)
                  if (!isManualModeActive) {
                    timer(durationGlobal ?? durations[currentQuestion] ?? 10)
                  }
                }}
              >
                Play<i class="bx bx-play" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  <!-- Diaporama lui-même -->
  {#if currentQuestion > -1 && currentQuestion < questions[0].length}
    <div id="diap" class="flex flex-col h-screen scrollbar-hide bg-coopmaths-canvas dark:bg-coopmathsdark-canvas" data-theme="daisytheme">
      <!-- Steps -->
      <header class="flex flex-col h-[10%] bg-coopmaths-canvas dark:bg-coopmathsdark-canvas pb-1">
        <div class:invisible={isManualModeActive} class="flex flex-row h-10 border border-coopmaths-warn dark:border-coopmathsdark-warn">
          <div id="diapoProgressBar" class="bg-coopmaths-warn dark:bg-coopmathsdark-warn" style="width: {ratioTime}%; transition: width {currentDuration / 100}s linear" />
        </div>
        <div class="flex flex-row h-full mt-6 w-full justify-center">
          <ul class="steps w-11/12" bind:this={stepsUl}>
            {#each questions[0] as question, i}
              <li class="step step-neutral dark:step-info  {currentQuestion >= i ? 'step-primary' : ''} cursor-pointer" on:click={() => clickOnStep(i)} on:keydown={() => clickOnStep(i)} />
            {/each}
          </ul>
        </div>
      </header>
      <!-- Question -->
      <main class="bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus min-h-[80%] p-4">
        <div class="{nbOfVues > 1 ? 'grid grid-cols-2 gap-4 auto-rows-fr' : 'grid grid-cols-1'} place-content-stretch justify-items-center w-full h-full">
          {#each Array(nbOfVues) as _, i}
            <div
              id="diapocell{i}"
              class="relative min-h-[100%] max-h-[100%] flex flex-col justify-center justify-self-stretch place-items-stretch p-2 {nbOfVues > 1
                ? 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'
                : ''} text-center"
            >
              {#if nbOfVues > 1}
                <div
                  class="absolute bg-coopmaths-struct text-coopmaths-canvas dark:bg-coopmathsdark-struct dark:text-coopmathsdark-canvas font-black text-4xl -top-1 -left-1 rounded-tl-2xl w-1/12 h-1/12"
                >
                  {i + 1}
                </div>
              {/if}
              <div id="textcell{i}" bind:this={divQuestion[i]} class="flex flex-col justify-center px-4 w-full  min-h-[100%]  max-h-[100%]">
                {#if isQuestionVisible}
                  <div class="font-light" id="consigne{i}">{@html consignes[i][$questionsOrder.indexes[currentQuestion]]}</div>
                  <div class="py-4" id="question{i}">
                    {@html questions[i][$questionsOrder.indexes[currentQuestion]]}
                  </div>
                {/if}
                {#if isCorrectionVisible}
                  <div id="correction{i}" class=" {isCorrectionVisible ? 'bg-coopmaths-warn-light bg-opacity-30 dark:bg-coopmathsdark-warn-light dark:bg-opacity-30 my-10' : ''}">
                    {@html corrections[i][$questionsOrder.indexes[currentQuestion]]}
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        <dialog class=" bg-coopmaths-struct text-coopmaths-canvas dark:bg-coopmathsdark-struct dark:text-coopmathsdark-canvas text-[150px] font-extralight min-w-full min-h-full" id="transition">
          <div class="flex flex-row w-full min-h-full justify-center items-center">
            <div class="radial-progress" style="--value:{((currentQuestion + 1) / questions[0].length) * 100}; --size:500px; --thickness: 20px;">{currentQuestion + 1} / {questions[0].length}</div>
          </div>
        </dialog>
      </main>
      <!-- Boutons de réglages -->
      <footer class="w-full h-[10%] py-1 sticky bottom-0 opacity-100 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
        <div class="flex flex-row justify-between w-full">
          <!-- boutons réglagles zoom -->
          <div class="flex flex-row justify-start ml-10 w-[33%] items-center">
            <button type="button" on:click={switchFullScreen}>
              <i
                class=" text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-lg {isFullScreen
                  ? 'bx-exit-fullscreen'
                  : 'bx-fullscreen'}"
              />
            </button>
            <button type="button" on:click={zoomPlus}>
              <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-lg bx-plus" />
            </button>
            <button type="button" on:click={zoomMoins}>
              <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-lg bx-minus" />
            </button>
          </div>
          <!-- boutons contrôle défilement -->
          <div class="flex flex-row justify-center w-[33%] items-center">
            <button type="button" on:click={prevQuestion}>
              <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-lg bx-skip-previous" />
            </button>
            <button type="button" on:click={switchPause} class:invisible={isManualModeActive}>
              <i
                class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-lg 
                {isPause ? 'bx-play' : 'bx-pause'}"
              />
            </button>
            <button type="button" on:click={nextQuestion}>
              <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-lg bx-skip-next" />
            </button>
          </div>
          <!-- boutons timers correction quitter -->
          <div class="flex flex-row justify-end mr-10 w-[33%] items-center">
            <label for="timerSettings" class="modal-button">
              <i
                class="relative text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-lg bx-stopwatch"
                on:click={pause}
                on:keydown={pause}
              >
                <div class="absolute -bottom-[10px] left-1/2 -translate-x-1/2 text-sm font-sans text-coopmaths-struct dark:text-coopmathsdark-struct">
                  {displayCurrentDuration()}
                </div>
              </i>
            </label>
            <input type="checkbox" id="timerSettings" class="modal-toggle bg-coopmaths-canvas dark:bg-coopmathsdark-canvas" />
            <div class="modal modal-bottom sm:modal-middle">
              <div class="modal-box">
                <h3 class="font-bold text-lg text-coopmaths-struct dark:text-coopmathsdark-struct">Temps par question</h3>
                <p class="py-4 text-coopmaths-corpus dark:text-coopmathsdark-corpus">Régler la durée de projection en secondes</p>
                <div class="flew-row space-x-2">
                  <div class="flex flex-row justify-start items-center space-x-2">
                    <input
                      class="w-1/4 h-2 bg-transparent text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer"
                      type="range"
                      max="30"
                      min="0"
                      name="duration"
                      id="duration"
                      bind:value={cursorTimeValue}
                      on:change={handleTimerChange}
                    />
                    <label class="w-3/4 text-sm text-coopmaths-corpus" for="duration">{messageDuree}</label>
                  </div>
                </div>
                <div class="modal-action">
                  <label for="timerSettings" class="btn btn-neutral" on:click={switchPause} on:keydown={switchPause}>Fermer</label>
                </div>
              </div>
            </div>
            <button type="button" on:click={switchCorrectionMode}>
              <i class="relative text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-lg bx-show">
                <div class="absolute -bottom-[8px] left-1/2 -translate-x-1/2 text-sm font-extrabold font-sans">{displayCurrentCorrectionMode()}</div>
              </i>
            </button>
            <button type="button" on:click={handleQuit} on:keydown={handleQuit}>
              <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-lg bx-power-off" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  {/if}
  <!-- Fin du diaporama -->
  {#if currentQuestion === questions[0].length}
    <div
      id="end"
      class="flex flex-col h-screen scrollbar-hide justify-center text-coopmaths-struct dark:text-coopmathsdark-struct bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      data-theme="daisytheme"
    >
      <div class="flex flex-row items-center justify-center w-full text-[300px] font-extrabold m-10">Fin !</div>
      <div class="flex flex-row items-center justify-center w-full mx-10 my-4">
        <div class="tooltip tooltip-bottom tooltip-neutral" data-tip="Début du diaporama">
          <button
            type="button"
            class="mx-12 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            on:click={returnToStart}
            on:keydown={returnToStart}
          >
            <i class="bx text-[100px] bx-arrow-back" />
          </button>
        </div>
        <div class="tooltip tooltip-bottom tooltip-neutral" data-tip="Questions + Réponses">
          <button
            type="button"
            class="mx-12 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            on:click={() => handleComponentChange("diaporama", "can")}
          >
            <i class="bx text-[100px] bx-detail" />
          </button>
        </div>
        <ModalActionWithDialog
          on:display={() => copyLinkToClipboard("linkCopiedDialog-2")}
          message="Le lien est copié dans le presse-papier !"
          dialogId="linkCopiedDialog-2"
          tooltipMessage="Lien du Diaporama"
          buttonSize="text-[100px]"
        />
        <ModalForQRCode
          dialogId="QRCodeModal-2"
          imageId="QRCodeCanvas-2"
          tooltipMessage="QR-code du diaporama"
          width={QRCodeWidth}
          format={formatQRCodeIndex}
          buttonSize="text-[100px]"
          classForButton="mx-12 my-2"
        />
        <div class="tooltip tooltip-bottom tooltip-neutral text-bg-coopmaths-canvas" data-tip="Sortir du diaporama">
          <button
            type="button"
            class="mx-12 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            on:click={() => handleComponentChange("diaporama", "")}
          >
            <i class="bx text-[100px] bx-home-alt-2" />
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .table-wrp {
    max-height: 60%;
    overflow-y: auto;
    display: block;
  }
  thead {
    position: sticky;
    top: 0;
  }
  dialog::backdrop {
    backdrop-filter: blur(4px);
  }
</style>
