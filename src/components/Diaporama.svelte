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
  let userZoom = 10
  let currentZoom = userZoom
  let listQuestions = [] // Concaténation de toutes les questions des exercices de exercicesParams
  let listCorrections = []
  let listSize = []
  let ratioTime = 0
  let myInterval
  onMount(async () => {
    Mathalea.updateUrl($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
      const exercice: Exercice = await Mathalea.load(paramsExercice.uuid)
      if (exercice === undefined) return
      if (paramsExercice.nbQuestions) exercice.nbQuestions = paramsExercice.nbQuestions
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
      listQuestions = [...listQuestions, ...exercice.listeQuestions]
      listCorrections = [...listCorrections, ...exercice.listeCorrections]
      listQuestions = listQuestions.map(formatExercice)
      listCorrections = listCorrections.map(formatExercice)
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        listSize.push(exercice.tailleDiaporama)
      }
    }
    goToQuestion(0)
  })

  function prevQuestion () {
    if (currentQuestion > 0) goToQuestion(currentQuestion - 1)
  }

  function nextQuestion () {
    if (currentQuestion < listQuestions.length - 1) goToQuestion(currentQuestion + 1)
  }

  async function goToQuestion (i: number) {
    if (i >= 0 && i < listQuestions.length) currentQuestion = i
    if (divQuestion) {
      await tick()
      currentZoom = userZoom
      setSize()
    }
    if (!isPause) timer()
  }

  function setSize () {
    if (listSize[currentQuestion]) {
        const size = currentZoom * listSize[currentQuestion]
        divQuestion.style.lineHeight = `${size * 1.2}rem`
        divQuestion.style.fontSize = `${size}rem`
        const qcms = document.querySelectorAll('.monQcm')
        for (const qcm of qcms) {
          (qcm as HTMLDivElement).style.fontSize = `${size}px`
        }
        const tables = document.querySelectorAll('#affichage_exercices label') // Pour les propositions des QCM
        for (const table of tables) {
          (table as HTMLDivElement).style.fontSize = `${size}px`
        }
        const figures = document.querySelectorAll('.mathalea2d')
        for (const figureElement of figures) {
          const figure = figureElement as SVGElement
          if (!figure.dataset.widthInitiale) figure.dataset.widthInitiale = figure.getAttribute('width')
          if (!figure.dataset.heightInitiale) figure.dataset.heightInitiale = figure.getAttribute('height')
          figure.setAttribute('height', (Number(figure.dataset.heightInitiale) * currentZoom).toString())
          figure.setAttribute('width', (Number(figure.dataset.widthInitiale) * currentZoom).toString())
       }
       Mathalea.renderDiv(divQuestion)
       if ((divQuestion.offsetHeight + 180) > window.innerHeight && currentZoom > 0) {
         currentZoom -= 0.25
         setSize()
       } 
    }


  }

  function zoomPlus () {
    userZoom += 0.25
    currentZoom = userZoom
    setSize()
  }

  function zoomMoins () {
    if (userZoom > 1) userZoom -= 0.25
    else if (userZoom > 0.2) userZoom -= 0.1
    currentZoom = userZoom
    setSize()
  }

  function switchFullScreen () {
    isFullScreen = !isFullScreen
    if (isFullScreen) {
      const app = document.querySelector('#diap')
      app.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  async function switchCorrectionVisible () {
    isCorrectionVisible = !isCorrectionVisible
    await tick()
    Mathalea.renderDiv(divQuestion)
  }

  function switchPause () {
    if (!isPause) {
      clearInterval(myInterval)
      isPause = true
    } 
    else timer(undefined, false)
  }

  function timer (timeQuestion = 5, reset = true) {
    if (reset) ratioTime = 0
    isPause = false
    clearInterval(myInterval)
    myInterval = setInterval(() => {
      ratioTime = ratioTime + 1
      if (ratioTime >= 100)  {
        clearInterval(myInterval)
        nextQuestion()
      }
    }, timeQuestion * 10)
  }

  function formatExercice (texte: string) {
    return texte.replace(/\\dotfill/g, '..............................').replace(/\\not=/g, '≠').replace(/\\ldots/g, '....')
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
      switchPause()
    }
  }
</script>

<svelte:window on:keyup={handleShortcut} />
<div id="diap" class="flex flex-col h-screen justify-between scrollbar-hide">
  <header class="flex flex-col h-20 dark:bg-white">
    <div class="flex flex-row h-6 border border-coopmaths">
      <div  class="bg-coopmaths" style="width: {ratioTime}%;" />
      </div>
    <div class="flex flex-row h-full mt-6 w-full">
      <div class="flex flex-row h-2 bg-gray-300 w-full  justify-around items-center">
        {#each listQuestions as question, i }
          <div class="rounded-full w-6 h-6 {currentQuestion === i ? 'bg-coopmaths' : 'bg-gray-300'} " on:click={()=> goToQuestion(i)}/>
        {/each}
        
      </div>
    </div>
  </header>
  <main class="flex h-full dark:bg-white dark:text-slate-800 p-10" >
    <div bind:this={divQuestion} class="block">
      {@html isCorrectionVisible ? listCorrections[currentQuestion] : listQuestions[currentQuestion]}
    </div>
  </main>
  <footer class="w-full h-20 bottom-0 opacity-100 dark:bg-white">
    <div class="flex flex-row justify-between w-full text-coopmaths">
      <div class="flex flex-row justify-start ml-10 w-[33%] items-center">
        <button type="button" on:click={switchFullScreen} ><i class="bx ml-2 bx-lg {isFullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}"/></button>
        <button type="button" on:click={zoomPlus}><i class="bx ml-2 bx-lg bx-plus" /></button>
        <button type="button" on:click={zoomMoins}><i class="bx ml-2 bx-lg bx-minus" /></button>
      </div>
      <div class="flex flex-row justify-center w-[33%] items-center">
        <button type="button" on:click={prevQuestion}><i class="bx ml-2 bx-lg bx-skip-previous" /></button>
        <button type="button" on:click={switchPause}><i class="bx ml-2 bx-lg {isPause ? 'bx-play' : 'bx-pause'}" /></button>
        <button type="button" on:click={nextQuestion}><i class="bx ml-2 bx-lg bx-skip-next" /></button>
      </div>
      <div class="flex flex-row justify-end mr-10 w-[33%] items-center">
        <button type="button"><i class="bx ml-2 bx-lg bx-stopwatch" /></button>
        <button type="button"><i class="bx ml-2 bx-lg bx-show" /></button>
        <button type="button" on:click={switchCorrectionVisible}><i class="bx ml-2 bx-lg {isCorrectionVisible ? 'bxs-bulb' : 'bx-bulb'}" /></button>
        <button type="button" on:click={() => {
          document.location.href = document.location.href.replace('&v=diaporama', '')
        }}><i class="bx ml-2 bx-lg bx-power-off" /></button>
      </div>
    </div>
  </footer>
</div>

<style>
</style>
