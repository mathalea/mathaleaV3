<script lang="ts">
  import { onMount, tick } from "svelte"
  import { Mathalea } from "../Mathalea"
  import { exercicesParams } from "./store"
  import type { Exercice } from "./utils/typeExercice"
  import seedrandom from "seedrandom"

  let divQuestion: HTMLElement
  let currentQuestion = 0
  let nbOfQuestionsDisplayed = 0
  let isFullScreen = false
  let isPause = false
  let isCorrectionVisible = false
  let userZoom = 3
  let currentZoom = userZoom
  let exercices = []
  let questions = [] // Concaténation de toutes les questions des exercices de exercicesParams
  let corrections = []
  let sizes = []
  let consignes = []
  let durations = []
  let durationGlobal = null
  let ratioTime = 0
  let myInterval
  let currentDuration
  let totalDuration = null

  onMount(async () => {
    Mathalea.updateUrl($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
      const exercice: Exercice = await Mathalea.load(paramsExercice.uuid)
      if (exercice === undefined) return
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
      exercices.push(exercice)
    }
    exercices = exercices
    updateExercices()
  })

  function updateExercices() {
    questions = []
    corrections = []
    consignes = []
    sizes = []
    durations = []
    for (const exercice of exercices) {
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
    totalDuration = getTotalDuration()
  }
  function prevQuestion() {
    nbOfQuestionsDisplayed -= 1
    if (currentQuestion > 0) goToQuestion(currentQuestion - 1)
  }

  function nextQuestion() {
    nbOfQuestionsDisplayed += 1
    if (currentQuestion < questions.length - 1) goToQuestion(currentQuestion + 1)
  }

  async function goToQuestion(i: number) {
    if (i === 0) nbOfQuestionsDisplayed = 1
    if (i >= 0 && i < questions.length) currentQuestion = i
    await tick()
    if (divQuestion) {
      currentZoom = userZoom
      setSize()
    }
    if (!isPause) timer(durationGlobal ?? durations[currentQuestion] ?? 10)
    currentDuration = durationGlobal ?? durations[currentQuestion] ?? 10
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

  function pause() {
    clearInterval(myInterval)
    isPause = true
  }

  function timer(timeQuestion = 5, reset = true) {
    // timeQuestion est le temps de la question exprimé en secondes
    if (timeQuestion === 0) {
      pause()
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

  function formatExercice(texte: string) {
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
      if (durationGlobal !== 0) switchPause()
    }
  }

  let valueCursorTime = 10
  /**
   * Gère la récupération de la valeur du curseur de temps
   */
  function handleTimerChange(event) {
    durationGlobal = parseInt(event.target.value)
    goToQuestion(currentQuestion)
  }
  /**
   * Gestion du message dans le modal de réglage de la durée de projection
   * @param duree valeur de la durée en secondes retournée par le curseur
   */
  function setPhraseDuree(duree) {
    if (duree >= 2) return duree + " secondes"
    else if (duree === 0) return "Défilement manuel"
    else return duree + " seconde"
  }
  $: messageDuree = setPhraseDuree(valueCursorTime)

  $: displayCurrentDuration = () => {
    return currentDuration === 0 ? "Manuel" : currentDuration + "s"
  }

  /**
   * Pour le bouton de retour de la page de fin
   */
  function returnToStart() {
    durationGlobal = 0
    goToQuestion(0)
  }

  /**
   * Gestion du click sur l'étape dans la progression
   * @param {number} index index de l'étape
   */
  function clickOnStep(index) {
    nbOfQuestionsDisplayed = index + 1
    goToQuestion(index)
  }

  function getTotalDuration() {
    let sum = 0
    for (let exercice of exercices) {
      sum += exercice.duration * exercice.nbQuestions
    }
    return sum
  }
  function formattedTimeStamp(nbOfSeconds) {
    const nbOfHours = Math.floor(nbOfSeconds / 3600)
    const nbOfMinutes = Math.floor((nbOfSeconds - nbOfHours * 3600) / 60)
    const nbOfSecondsLeft = nbOfSeconds - nbOfHours * 3600 - nbOfMinutes * 60
    if (nbOfHours > 0) {
      return `${nbOfHours}h ${nbOfMinutes}min ${nbOfSecondsLeft}s`
    } else {
      if (nbOfMinutes > 0) {
        return `${nbOfMinutes}min ${nbOfSecondsLeft}s`
      } else {
        return `${nbOfSecondsLeft}s`
      }
    }
  }
</script>

<svelte:window on:keyup={handleShortcut} />
<!-- Page d'accueil du diapo -->
{#if nbOfQuestionsDisplayed === 0}
  <div id="start" class="flex flex-col h-screen scrollbar-hide" data-theme="daisytheme">
    <div class="flex flex-row justify-end p-6">
      <button type="button"
        ><i
          class="relative bx ml-2 bx-lg bx-x hover:text-coopmaths"
          on:click={() => {
            document.location.href = document.location.href.replace("&v=diaporama", "")
          }}
        /></button
      >
    </div>
    <div class="flex flex-row items-center justify-center w-full mb-24 mt-12">
      <button
        type="button"
        class="inline-flex items-center justify-center shadow-2xl w-1/3 bg-coopmaths hover:bg-coopmaths-dark text-[100px] font-extrabold text-white py-6 px-12 rounded-lg"
        on:click={() => {
          goToQuestion(0)
        }}
      >
        Play <i class="bx text-[100px] text-white bx-play" />
      </button>
    </div>
    <div class="flex flex-row w-full justify-center items-start mx-20">
      <div class="flex flex-col w-1/6 justify-start">
        <div class="flex text-lg font-bold mb-8">Multivue</div>
        <div class="flex px-4 pb-4">
          <div>
            <div class="form-check">
              <input
                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-coopmaths checked:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="multivueRadio1"
                id="multivueRadio1"
                checked
              />
              <label class="form-check-label inline-block text-gray-800" for="multivueRadio1"> Pas de multivue </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-coopmaths checked:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="multivueRadio2"
                id="multivueRadio2"
              />
              <label class="form-check-label inline-block text-gray-800" for="multivueRadio2"> Deux vues </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-coopmaths checked:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="multivueRadio3"
                id="multivueRadio3"
              />
              <label class="form-check-label inline-block text-gray-800" for="multivueRadio3"> Trois vues </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-coopmaths checked:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                name="multivueRadio4"
                id="multivueRadio4"
              />
              <label class="form-check-label inline-block text-gray-800" for="multivueRadio4"> Quatre vues </label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-3/6 justify-start">
        <div class="flex text-lg font-bold mb-8">Durées</div>
        <div class="flex flex-row justify-between px-4 pb-4">
          <div class="inline-flex">Durée totale du diaporama : {formattedTimeStamp(totalDuration)}</div>
          <div class="flex items-start mb-4">
            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" class="bg-gray-50 border-gray-300 text-coopmaths focus:ring-3 focus:ring-coopmaths h-4 w-4 rounded" checked="" />
            <label for="checkbox-1" class="ml-3 font-medium text-gray-900"
              >Même durée pour toutes les questions <input
                type="number"
                min="1"
                bind:value={durationGlobal}
                class="ml-3 w-20 h-8 bg-gray-100 border-2 border-transparent focus:border-2 focus:border-coopmaths focus:outline-0 focus:ring-0"
              /></label
            >
          </div>
        </div>

        <div class="inline-block min-w-full px-4 align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="table-fixed min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-100">
                <th scope="col" class="py-3.5 pl-4 pr-3 w-4/6 text-left text-sm font-semibold text-gray-900 sm:pl">Exercice</th>
                <th scope="col" class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-gray-900">Durée par question (s)</th>
                <th scope="col" class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-gray-900">Nombre de questions</th>
              </thead>

              {#each exercices as exercice}
                <tr>
                  <td class="whitespace-normal px-3 py-4 text-sm">{exercice.id} - {exercice.titre}</td>
                  <td class="whitespace-normal px-3 py-4 text-sm"
                    ><span class="flex justify-center"
                      ><input
                        type="number"
                        min="1"
                        on:change={updateExercices}
                        bind:value={exercice.duration}
                        class="ml-3 w-16 h-8 bg-gray-100 border-2 border-transparent focus:border-2 focus:border-coopmaths focus:outline-0 focus:ring-0"
                      /></span
                    ></td
                  >
                  <td class="whitespace-normal px-3 py-4 text-sm"
                    ><span class="flex justify-center"
                      ><input
                        type="number"
                        min="1"
                        bind:value={exercice.nbQuestions}
                        on:change={updateExercices}
                        class="ml-3 w-16 h-8 bg-gray-100 border-2 border-transparent focus:border-2 focus:border-coopmaths focus:outline-0 focus:ring-0"
                      /></span
                    ></td
                  >
                </tr>
              {/each}
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
<!-- Diaporama lui-même -->
{#if nbOfQuestionsDisplayed > 0 && nbOfQuestionsDisplayed <= questions.length}
  <div id="diap" class="flex flex-col h-screen scrollbar-hide" data-theme="daisytheme">
    <header class="flex flex-col h-20 dark:bg-white pb-1">
      <div class:invisible={durationGlobal === 0} class="flex flex-row h-6 border border-coopmaths">
        <div class="bg-coopmaths" style="width: {ratioTime}%;" />
      </div>
      <div class="flex flex-row h-full mt-6 w-full">
        <ul class="steps w-11/12">
          {#each questions as question, i}
            <li class="step {currentQuestion >= i ? 'step-primary' : ''} cursor-pointer" on:click={() => clickOnStep(i)} />
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
        <!-- boutons réglagles zoom -->
        <div class="flex flex-row justify-start ml-10 w-[33%] items-center">
          <button type="button" on:click={switchFullScreen}><i class="bx ml-2 bx-lg {isFullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}" /></button>
          <button type="button" on:click={zoomPlus}><i class="bx ml-2 bx-lg bx-plus" /></button>
          <button type="button" on:click={zoomMoins}><i class="bx ml-2 bx-lg bx-minus" /></button>
        </div>
        <!-- boutons contrôle défilement -->
        <div class="flex flex-row justify-center w-[33%] items-center">
          <button type="button" on:click={prevQuestion}><i class="bx ml-2 bx-lg bx-skip-previous" /></button>
          <button type="button" on:click={switchPause} class:invisible={durationGlobal === 0}><i class="bx ml-2 bx-lg {isPause ? 'bx-play' : 'bx-pause'}" /></button>
          <button type="button" on:click={nextQuestion}><i class="bx ml-2 bx-lg bx-skip-next" /></button>
        </div>
        <!-- boutons timers correction quitter -->
        <div class="flex flex-row justify-end mr-10 w-[33%] items-center">
          <label for="timerSettings" class="modal-button"
            ><i class="relative bx ml-2 bx-lg bx-stopwatch" on:click={pause}>
              <div class="absolute -bottom-[12px] left-1/2 -translate-x-1/2 text-sm font-sans text-coopmaths">{displayCurrentDuration()}</div></i
            ></label
          >
          <input type="checkbox" id="timerSettings" class="modal-toggle" />
          <div class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
              <h3 class="font-bold text-lg">Temps par question</h3>
              <p class="py-4 text-black">Régler la durée de projection en secondes</p>
              <div class="flew-row space-x-2">
                <div class="flex flex-row justify-start items-center space-x-2">
                  <input
                    class="w-1/4 h-2 bg-transparent text-coopmaths cursor-pointer"
                    type="range"
                    max="30"
                    min="0"
                    name="duration"
                    id="duration"
                    bind:value={valueCursorTime}
                    on:change={handleTimerChange}
                  />
                  <label class="w-3/4 text-sm text-black" for="duration">{messageDuree}</label>
                </div>
              </div>
              <div class="modal-action">
                <label for="timerSettings" class="btn btn-coopmaths" on:click={switchPause}>Fermer</label>
              </div>
            </div>
          </div>
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
{/if}
<!-- Fin du diaporama -->
{#if nbOfQuestionsDisplayed > questions.length}
  <div id="end" class="flex flex-col h-screen scrollbar-hide justify-center text-coopmaths" data-theme="daisytheme">
    <div class="flex flex-row items-center justify-center w-full text-[300px] font-extrabold m-10">Fin !</div>
    <div class="flex flex-row items-center justify-center w-full mx-10 my-4">
      <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Début du diaporama">
        <button type="button" class="m-2 text-coopmaths" on:click={returnToStart}><i class="bx text-[100px] bx-arrow-back" /></button>
      </div>
      <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Questions + Réponses">
        <button type="button" class="mx-12 my-2 text-coopmaths"><i class="bx text-[100px] bx-detail" /></button>
      </div>
      <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Sortir du diaporama">
        <button
          type="button"
          class="m-2 text-coopmaths"
          on:click={() => {
            document.location.href = document.location.href.replace("&v=diaporama", "")
          }}
        >
          <i class="bx text-[100px] bx-home-alt-2" />
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
</style>
