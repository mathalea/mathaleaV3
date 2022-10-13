<script lang="ts">
  import { afterUpdate, onMount, tick } from "svelte"
  import { fly } from "svelte/transition"
  import { Mathalea } from "../Mathalea"
  import { exercicesParams } from "./store"
  import seedrandom from "seedrandom"
  import type { Exercice } from "./utils/typeExercice"

  let divDiaporama: HTMLDivElement
  let currentQuestion = 0
  let listQuestions = [] // Concaténation de toutes les questions des exercices de exercicesParams
  let listSize = []
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
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        listSize.push(exercice.tailleDiaporama)
      }
    }
    Mathalea.renderDiv(divDiaporama)
  })

  afterUpdate(async () => {
    await tick()
    if (divDiaporama) Mathalea.renderDiv(divDiaporama)
  })

  function prevQuestion() {
    if (currentQuestion > 0) goToQuestion(currentQuestion - 1)
  }

  function nextQuestion() {
    if (currentQuestion < listQuestions.length - 1) goToQuestion(currentQuestion + 1)
  }

  function goToQuestion(i: number) {
    if (i >= 0 && i < listQuestions.length) currentQuestion = i
  }

  const ARROW_LEFT = 37
  const ARROW_RIGHT = 39
  function handleShortcut(e) {
    if (e.keyCode === ARROW_LEFT) {
      prevQuestion()
    }
    if (e.keyCode === ARROW_RIGHT) {
      nextQuestion()
    }
  }
</script>

<svelte:window on:keyup={handleShortcut} />
<div class="flex flex-col h-screen justify-between scrollbar-hide">
  <header class="flex flex-col h-20">
    <div class="flex flex-row h-6 border border-coopmaths">
      <div class="basis-[33%] bg-coopmaths" />
    </div>
    <div class="flex flex-row h-full mt-6 w-full">
      <div class="flex flex-row h-2 bg-gray-300 w-full  justify-around items-center">
        {#each listQuestions as question, i }
          <div class="rounded-full w-6 h-6 {currentQuestion === i ? 'bg-coopmaths' : 'bg-gray-300'} " on:click={()=> goToQuestion(i)}/>
        {/each}
        
      </div>
    </div>
  </header>
  <main class="flex h-full dark:bg-white dark:text-slate-800 p-10">
    <div>
      {#each listQuestions as question, i (question)}
        {#if i === currentQuestion}
          <div bind:this={divDiaporama} style={`font-size: ${1.5 * listSize[i]}rem; line-height: ${2 * listSize[i]}rem;`} in:fly={{ y: 100, duration: 1000 }} out:fly={{ y: -200, duration: 1000 }}>
            {@html question}
          </div>
        {/if}
      {/each}
    </div>
  </main>
  <footer class="w-full h-20 flex bottom-0 opacity-100">
    <div class="flex flex-row justify-between w-full text-coopmaths">
      <div class="flex flex-row justify-start ml-10 w-[33%] items-center">
        <button type="button"><i class="bx ml-2 bx-lg bx-fullscreen" /></button>
        <button type="button"><i class="bx ml-2 bx-lg bx-plus" /></button>
        <button type="button"><i class="bx ml-2 bx-lg bx-minus" /></button>
      </div>
      <div class="flex flex-row justify-center w-[33%] items-center">
        <button type="button" on:click={prevQuestion}><i class="bx ml-2 bx-lg bx-skip-previous" /></button>
        <button type="button"><i class="bx ml-2 bx-lg bx-pause" /></button>
        <button type="button" on:click={nextQuestion}><i class="bx ml-2 bx-lg bx-skip-next" /></button>
      </div>
      <div class="flex flex-row justify-end mr-10 w-[33%] items-center">
        <button type="button"><i class="bx ml-2 bx-lg bx-stopwatch" /></button>
        <button type="button"><i class="bx ml-2 bx-lg bx-show" /></button>
        <button type="button"><i class="bx ml-2 bx-lg bx-bulb" /></button>
        <button type="button"><i class="bx ml-2 bx-lg bx-power-off" /></button>
      </div>
    </div>
  </footer>
</div>

<style>
</style>
