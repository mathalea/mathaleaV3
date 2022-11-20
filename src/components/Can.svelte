<script lang="ts">
  import { globalOptions } from "./store"
  import { onMount, tick } from "svelte"
  import { Mathalea } from "../Mathalea"
  import { exercicesParams } from "./store"
  import type { Exercice } from "./utils/typeExercice"
  import seedrandom from "seedrandom"
  import { context } from "../modules/context"

  let exercices: Exercice[] = []
  let questions: [string[], string[], string[], string[]] = [[], [], [], []] // Concaténation de toutes les questions des exercices de exercicesParams, vue par vue
  let corrections: [string[], string[], string[], string[]] = [[], [], [], []]
  let consignes: string[] = []
  let durations: number[] = []
  let nbOfVues = $globalOptions.nbVues
  let currentVue: 0 | 1 | 2 | 3 | 4 = nbOfVues > 1 ? 4 : 0
  let isCorrectionVisible = false
  let isQuestionsVisible = true
  let divExercice: HTMLElement

  onMount(async () => {
    context.vue = "can"
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
      exercices.push(exercice)
    }
    exercices = exercices
    updateExercices()
  })

  async function updateExercices() {
    questions = [[], [], [], []]
    corrections = [[], [], [], []]
    consignes = []
    durations = []
    for (let idVue = 0; idVue < nbOfVues; idVue++) {
      questions[idVue] = []
      corrections[idVue] = []
      for (const exercice of exercices) {
        if (idVue > 0) {
          exercice.seed = exercice.seed.substring(0, 4) + idVue
        } else {
          exercice.seed = exercice.seed.substring(0, 4)
        }
        if (exercice.typeExercice === "simple") Mathalea.handleExerciceSimple(exercice, false)
        seedrandom(exercice.seed, { global: true })
        exercice.nouvelleVersion()
        questions[idVue] = [...questions[idVue], ...exercice.listeQuestions]
        corrections[idVue] = [...corrections[idVue], ...exercice.listeCorrections]
        questions[idVue] = questions[idVue].map(Mathalea.formatExercice)
        corrections[idVue] = corrections[idVue].map(Mathalea.formatExercice)
      }
    }
    for (const exercice of exercices) {
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        consignes.push(exercice.consigne)
      }
    }
    await tick()
    if (divExercice) Mathalea.renderDiv(divExercice)
  }

  async function switchCorrectionVisible(section) {
    switch (section) {
      case "correction":
        isCorrectionVisible = !isCorrectionVisible
        break
      case "instructions":
        isQuestionsVisible = !isQuestionsVisible
        break
      default:
        break
    }
    updateDisplay()
  }

  async function updateDisplay() {
    await tick()
    if (divExercice) Mathalea.renderDiv(divExercice)
  }

  function newDataForAll() {
    const newParams = []
    for (const exercice of exercices) {
      exercice.seed = Mathalea.generateSeed({
        includeUpperCase: true,
        includeNumbers: true,
        length: 4,
        startsWithLowerCase: false,
      })
      newParams.push({
        uuid: exercice.uuid,
        id: exercice.id,
        alea: exercice.seed.substring(0, 4),
        nbQuestions: exercice.nbQuestions,
        duration: exercice.duration,
      })
    }
    exercicesParams.update((l) => newParams)
    updateExercices()
    Mathalea.updateUrl($exercicesParams)
  }
</script>

<main class="flex h-full dark:bg-white dark:text-slate-800">
  <!-- boutons commandes -->
  <aside class="flex flex-col bg-coopmaths text-white w-14 min-h-screen py-4 items-center">
    <button
      type="button"
      class="pb-8"
      on:click={() => {
        document.location.href = document.location.href.replace("&v=can", "&v=diaporama")
      }}><i class="bx bx-sm bx-arrow-back" /></button
    >
    <button type="button" class="pb-8" on:click={newDataForAll}><i class="bx bx-sm bx-refresh" /></button>
    <!-- <button type="button" class="hover:text-coopmaths-dark" on:click={newDataForAll}><i class="bx bx-sm bx-refresh" /></button> -->

    <span class="text-xs {isQuestionsVisible ? 'font-bold' : 'font-light'}">Questions</span>
    <button type="button" disabled={!isCorrectionVisible} on:click={() => switchCorrectionVisible("instructions")}
      ><i class="bx bx-sm {isQuestionsVisible ? 'bx-toggle-right' : 'bx-toggle-left'}" /></button
    >
    <span class="text-xs {isCorrectionVisible ? 'font-bold' : 'font-light'} pt-2">Réponses</span>
    <button type="button" disabled={!isQuestionsVisible} on:click={() => switchCorrectionVisible("correction")}
      ><i class="mb-8 bx bx-sm {isCorrectionVisible ? 'bx-toggle-right' : 'bx-toggle-left'}" /></button
    >
    <!-- Onglets Séries -->
    {#if nbOfVues > 1}
      <input type="radio" id="tab1" value={0} bind:group={currentVue} on:change={updateDisplay} class="peer/tab1 items-center justify-center hidden" />
      <label
        class="flex flex-row rounded-l-lg border-y border-l border-white w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths peer-checked/tab1:bg-white peer-checked/tab1:text-coopmaths"
        for="tab1">1</label
      >
      <input type="radio" id="tab2" value={1} bind:group={currentVue} on:change={updateDisplay} class="peer/tab2 items-center justify-center hidden" />
      <label
        class="flex flex-row rounded-l-lg border-y border-l border-white w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths peer-checked/tab2:bg-white peer-checked/tab2:text-coopmaths"
        for="tab2">2</label
      >
    {/if}
    {#if nbOfVues > 2}
      <input type="radio" id="tab3" value={2} bind:group={currentVue} on:change={updateDisplay} class="peer/tab3 items-center justify-center hidden" />
      <label
        class="flex flex-row rounded-l-lg border-y border-l border-white w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths peer-checked/tab3:bg-white peer-checked/tab3:text-coopmaths"
        for="tab3">3</label
      >
    {/if}
    {#if nbOfVues > 3}
      <input type="radio" id="tab4" value={3} bind:group={currentVue} on:change={updateDisplay} class="peer/tab4 items-center justify-center hidden" />
      <label
        class="flex flex-row rounded-l-lg border-y border-l border-white w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths peer-checked/tab4:bg-white peer-checked/tab4:text-coopmaths"
        for="tab4">4</label
      >
    {/if}
    {#if nbOfVues > 1}
      <input type="radio" id="tab5" value={4} bind:group={currentVue} on:change={updateDisplay} class="hidden peer/tab5 items-center justify-center" />
      <label
        class="flex flex-row rounded-l-lg border-y border-l border-white w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths peer-checked/tab5:bg-white peer-checked/tab5:text-coopmaths"
        for="tab5">Tout</label
      >
    {/if}
  </aside>
  <!-- Affichage Questions/Réponses -->
  <div class="flex p-2 h-full w-full">
    <div class="w-full" bind:this={divExercice}>
      {#if currentVue < 4}
        {#if nbOfVues > 1}
          <div class="text-3xl font-black text-coopmaths p-6">
            Série {currentVue + 1}
          </div>
        {:else}
          <div class="text-3xl font-black text-coopmaths p-6">
            {isQuestionsVisible ? "Questions" : ""}{isCorrectionVisible && isQuestionsVisible ? " / " : ""}{isCorrectionVisible ? "Réponses" : ""}
          </div>
        {/if}
        <div class="list-inside list-decimal mt-2 mx-2 lg:mx-6 marker:text-coopmaths marker:font-bold">
          {#each questions[currentVue] as question, i}
            <div>
              <div class="flex flex-row my-4">
                <div class="flex flex-col justify-start items-center pr-2">
                  <span class="inline-flex text-center text-coopmaths font-black text-lg">{i + 1}.</span>
                </div>
                <div class="flex flex-col justify-start items-start">
                  {#if isQuestionsVisible}
                    <div>
                      {@html Mathalea.formatExercice(question)}
                    </div>
                  {/if}
                  {#if isCorrectionVisible}
                    <div class="bg-gray-200 {isQuestionsVisible ? 'my-4' : ''} p-2">
                      {@html Mathalea.formatExercice(corrections[currentVue][i])}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="flex flex-row justify-evenly w-full">
          {#each Array(nbOfVues) as _, currentVueId}
            <div style="width: {100 / nbOfVues}%">
              <div class="text-3xl font-black text-coopmaths p-6">
                Série {currentVueId + 1}
              </div>
              {#each questions[currentVueId] as question, i}
                <div class="pl-6">
                  <div class="flex flex-row my-4">
                    <div class="flex flex-col justify-start items-center pr-2">
                      <span class="inline-flex text-center text-coopmaths font-black text-lg">{i + 1}.</span>
                    </div>
                    <div class="flex flex-col justify-start items-start">
                      {#if isQuestionsVisible}
                        <div>
                          {@html Mathalea.formatExercice(question)}
                        </div>
                      {/if}
                      {#if isCorrectionVisible}
                        <div class="bg-gray-200 {isQuestionsVisible ? 'my-4' : ''} p-2">
                          {@html Mathalea.formatExercice(corrections[currentVueId][i])}
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</main>
