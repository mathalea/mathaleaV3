<script lang="ts">
  import { onMount, tick } from "svelte"
  import { Mathalea } from "../Mathalea"
  import { exercicesParams } from "./store"
  import seedrandom from "seedrandom"
  import type { Exercice } from "./utils/typeExercice"

  let divQuestion: HTMLElement
  let currentQuestion = 0
  let isFullScreen = false
  let isPause = false
  let isCorrectionVisible = false
  let userZoom = 3
  let currentZoom = userZoom
  let questions = [] // Concaténation de toutes les questions des exercices de exercicesParams
  let corrections = []
  let sizes = []
  let consignes = []
  let durations = []
  let durationGlobal = null
  let ratioTime = 0
  let myInterval
  onMount(async () => {
    Mathalea.updateUrl($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
      const exercice: Exercice = await Mathalea.load(paramsExercice.uuid)
      if (exercice === undefined) return
      if (paramsExercice.nbQuestions) exercice.nbQuestions = paramsExercice.nbQuestions
      if (paramsExercice.duration) exercice.duration = paramsExercice.duration
      if (paramsExercice.sup) exercice.sup = paramsExercice.sup
      if (paramsExercice.sup2) exercice.sup2 = paramsExercice.sup2
      if (paramsExercice.sup3) exercice.sup3 = paramsExercice.sup3
      if (paramsExercice.sup4) exercice.sup4 = paramsExercice.sup4
      if (paramsExercice.interactif) exercice.interactif = paramsExercice.interactif
      if (paramsExercice.alea) exercice.seed = paramsExercice.alea
      if (paramsExercice.cd !== undefined) exercice.correctionDetaillee = paramsExercice.cd === "1"
      seedrandom(exercice.seed, { global: true })
      if (exercice.typeExercice === "simple") Mathalea.handleExerciceSimple(exercice, false)
      exercice.nouvelleVersion()
      questions = [...questions, ...exercice.listeQuestions]
      corrections = [...corrections, ...exercice.listeCorrections]
      questions = questions.map(formatExercice)
      corrections = corrections.map(formatExercice)
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        sizes.push(exercice.tailleDiaporama)
        consignes.push(exercice.consigne)
        durations.push(exercice.duration)
      }
    }
    goToQuestion(0)
  })

  function prevQuestion() {
    if (currentQuestion > 0) goToQuestion(currentQuestion - 1)
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) goToQuestion(currentQuestion + 1)
  }

  async function goToQuestion(i: number) {
    if (i >= 0 && i < questions.length) currentQuestion = i
    if (divQuestion) {
      await tick()
      currentZoom = userZoom
      setSize()
    }
    if (!isPause) timer(durationGlobal ?? durations[currentQuestion] ?? 10)
  }

  function setSize() {
    if (sizes[currentQuestion]) {
      const size = currentZoom * sizes[currentQuestion]
      divQuestion.style.lineHeight = `${size * 1.2}rem`
      divQuestion.style.fontSize = `${size}rem`
      const qcms = document.querySelectorAll(".monQcm")
      for (const qcm of qcms) {
        ;(qcm as HTMLDivElement).style.fontSize = `${size}px`
      }
      const tables = document.querySelectorAll("#affichage_exercices label") // Pour les propositions des QCM
      for (const table of tables) {
        ;(table as HTMLDivElement).style.fontSize = `${size}px`
      }
      const figures = document.querySelectorAll(".mathalea2d")
      for (const figureElement of figures) {
        const figure = figureElement as SVGElement
        if (!figure.dataset.widthInitiale) figure.dataset.widthInitiale = figure.getAttribute("width")
        if (!figure.dataset.heightInitiale) figure.dataset.heightInitiale = figure.getAttribute("height")
        figure.setAttribute("height", (Number(figure.dataset.heightInitiale) * currentZoom).toString())
        figure.setAttribute("width", (Number(figure.dataset.widthInitiale) * currentZoom).toString())
      }
      Mathalea.renderDiv(divQuestion)
      if (divQuestion.offsetHeight + 180 > window.innerHeight && currentZoom > 0) {
        currentZoom -= 0.25
        setSize()
      }
    }
  }

  function zoomPlus() {
    userZoom += 0.25
    currentZoom = userZoom
    setSize()
  }

  function zoomMoins() {
    if (userZoom > 1) userZoom -= 0.25
    else if (userZoom > 0.2) userZoom -= 0.1
    currentZoom = userZoom
    setSize()
  }

  function switchFullScreen() {
    isFullScreen = !isFullScreen
    if (isFullScreen) {
      const app = document.querySelector("#diap")
      app.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  async function switchCorrectionVisible() {
    isCorrectionVisible = !isCorrectionVisible
    await tick()
    Mathalea.renderDiv(divQuestion)
  }

  function switchPause() {
    if (!isPause) {
      pause()
    } else timer(durationGlobal ?? durations[currentQuestion] ?? 10, false)
  }

  function pause () {
    clearInterval(myInterval)
    isPause = true
  }

  function timer (timeQuestion = 5, reset = true) {
    // timeQuestion est le temps de la question exprimé en secondes
    if (timeQuestion === 0) {
      pause ()
      ratioTime = 0
    } else {
      if (reset) ratioTime = 0
      isPause = false
      clearInterval(myInterval)
      myInterval = setInterval(() => {
        ratioTime = ratioTime + 1 // ratioTime est le pourcentage du temps écoulé
        if (ratioTime >= 100) { 
          clearInterval(myInterval)
          nextQuestion()
        }
      }, timeQuestion * 10)
    }
  }

  function formatExercice (texte: string) {
    return texte
      .replace(/\\dotfill/g, "..............................")
      .replace(/\\not=/g, "≠")
      .replace(/\\ldots/g, "....")
  }

  const ARROW_LEFT = 37
  const ARROW_RIGHT = 39
  const SPACE = 32
  function handleShortcut(e) {
    if (e.keyCode === ARROW_LEFT) {
      prevQuestion()
    }
    if (e.keyCode === ARROW_RIGHT) {
      nextQuestion()
    }
    if (e.keyCode === SPACE) {
      if (durationGlobal !==0) switchPause()
    }
  }

  let value = 10
  /**
   * Gère la récupération de la valeur du curseur de temps
   */
  function handleTimerChange (event) {
    durationGlobal = parseInt(event.target.value)
    goToQuestion(currentQuestion)
  }
  /**
   * Gestion du message dans le modal de réglage de la durée de projection
   * @param duree valeur de la durée en secondes retournée par le curseur
   */
  function setPhraseDuree (duree) {
    if (duree >= 2) return duree + " secondes"
    else if (duree === 0) return "Défilement manuel"
    else return duree + " seconde"
  }
  $: messageDuree = setPhraseDuree(value)
</script>

<svelte:window on:keyup={handleShortcut} />
<div id="diap" class="flex flex-col h-screen scrollbar-hide" data-theme="daisytheme">
  <header class="flex flex-col h-20 dark:bg-white pb-1">
    <div class="flex flex-row h-6 border border-coopmaths">
      <div class="bg-coopmaths" style="width: {ratioTime}%;" />
    </div>
    <div class="flex flex-row h-full mt-6 w-full">
      <!-- <div class="flex flex-row h-2 bg-gray-300 w-full  justify-around items-center">
        {#each listQuestions as question, i}
          <div class="rounded-full w-6 h-6 {currentQuestion === i ? 'bg-coopmaths' : 'bg-gray-300'} " on:click={() => goToQuestion(i)} />
        {/each}
      </div> -->
      <ul class="steps w-11/12">
        {#each questions as question, i}
          <li class="step {currentQuestion >= i ? 'step-primary' : ''} cursor-pointer" on:click={() => goToQuestion(i)} />
        {/each}
     </ul>   
    </div>
  </header>
  <main class="flex grow max-h-full dark:bg-white dark:text-slate-800 p-4">
    <div bind:this={divQuestion} class="block">
      {@html isCorrectionVisible ? corrections[currentQuestion] : questions[currentQuestion]}
    </div>
  </main>
  <footer class="w-full h-20 py-1 sticky bottom-0 opacity-100 dark:bg-white">
    <div class="flex flex-row justify-between w-full text-coopmaths">
      <div class="flex flex-row justify-start ml-10 w-[33%] items-center">
        <button type="button" on:click={switchFullScreen}><i class="bx ml-2 bx-lg {isFullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}" /></button>
        <button type="button" on:click={zoomPlus}><i class="bx ml-2 bx-lg bx-plus" /></button>
        <button type="button" on:click={zoomMoins}><i class="bx ml-2 bx-lg bx-minus" /></button>
      </div>
      <div class="flex flex-row justify-center w-[33%] items-center">
        <button type="button" on:click={prevQuestion}><i class="bx ml-2 bx-lg bx-skip-previous" /></button>
        <button type="button" on:click={switchPause} class:invisible="{durationGlobal === 0}"><i class="bx ml-2 bx-lg {isPause ? 'bx-play' : 'bx-pause'}" /></button>
        <button type="button" on:click={nextQuestion}><i class="bx ml-2 bx-lg bx-skip-next" /></button>
      </div>
      <div class="flex flex-row justify-end mr-10 w-[33%] items-center">
        <label for="timerSettings" class="modal-button"><i class="bx ml-2 bx-lg bx-stopwatch" on:click={pause} /></label>
        <input type="checkbox" id="timerSettings" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle">
          <div class="modal-box">
            <h3 class="font-bold text-lg">Temps par question</h3>
            <p class="py-4 text-black">Régler la durée de projection en secondes</p>
            <div class="flew-row space-x-2">
              <div class="flex flex-row justify-start items-center space-x-2">
                <input class="w-1/4 h-2 bg-transparent text-coopmaths cursor-pointer" type="range" max="30" min="0" name="duration" id="duration" bind:value on:change={handleTimerChange} />
                <label class="w-3/4 text-sm text-black" for="duration">{messageDuree}</label>
              </div>
            </div>
            <div class="modal-action">
              <label for="timerSettings" class="btn btn-coopmaths" on:click={switchPause}>Fermer</label>
            </div>
          </div>
        </div>
        <!-- <button type="button"><i class="bx ml-2 bx-lg bx-stopwatch" /></button> -->
        <!-- <button type="button"><i class="bx ml-2 bx-lg bx-bulb" /></button> -->
        <button type="button" on:click={switchCorrectionVisible}><i class="bx ml-2 bx-lg {isCorrectionVisible ? 'bx-hide' : 'bx-show'}" /></button>
        <button
          type="button"
          on:click={() => {
            document.location.href = document.location.href.replace("&v=diaporama", "")
          }}><i class="bx ml-2 bx-lg bx-power-off" /></button
        >
      </div>
    </div>
  </footer>
</div>

<style>
</style>
