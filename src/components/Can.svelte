<script lang="ts">
  import { globalOptions, questionsOrder, selectedExercises, darkMode } from "./store"
  import { onMount, tick } from "svelte"
  import {
    MathaleaFormatExercice,
    MathaleaGenerateSeed,
    MathaleaHandleComponentChange,
    MathaleaHandleExerciceSimple,
    MathaleaHandleParamOfOneExercice,
    MathaleaLoadExerciceFromUuid,
    MathaleaRenderDiv,
    MathaleaUpdateUrlFromExercicesParams,
  } from "../lib/Mathalea"
  import { exercicesParams } from "./store"
  import type Exercice from "./utils/typeExercice"
  import seedrandom from "seedrandom"
  import type { InterfaceParams } from "src/lib/types"
  import BtnZoom from "./ui/btnZoom.svelte"

  let exercices: Exercice[] = []
  let questions: [string[], string[], string[], string[]] = [[], [], [], []] // Concaténation de toutes les questions des exercices de exercicesParams, vue par vue
  let corrections: [string[], string[], string[], string[]] = [[], [], [], []]
  let consignes: string[] = []
  let durations: number[] = []
  let nbOfVues = $globalOptions.nbVues
  let currentVue: 0 | 1 | 2 | 3 = nbOfVues > 1 ? 3 : 0
  let isCorrectionVisible = false
  let isQuestionsVisible = true
  let divExercice: HTMLElement
  let correctionsSteps: number[] = []

  onMount(async () => {
    MathaleaUpdateUrlFromExercicesParams($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
      const exercice: Exercice = await MathaleaLoadExerciceFromUuid(paramsExercice.uuid)
      if (exercice === undefined) return
      MathaleaHandleParamOfOneExercice(exercice, paramsExercice)
      exercice.duration = paramsExercice.duration ?? 10
      exercices.push(exercice)
    }
    exercices = exercices
    updateExercices()
  })

  /**
   * Met à jour le code des exercices pour autant de vue qu'il faut à l'aide des params trouvés dans exercices
   */
  async function updateExercices() {
    questions = [[], [], [], []]
    corrections = [[], [], [], []]
    consignes = []
    durations = []
    for (let idVue = 0; idVue < nbOfVues; idVue++) {
      questions[idVue] = []
      corrections[idVue] = []
      for (const [k, exercice] of exercices.entries()) {
        if (idVue > 0) {
          exercice.seed = exercice.seed.substring(0, 4) + idVue
        } else {
          exercice.seed = exercice.seed.substring(0, 4)
        }
        if (exercice.typeExercice === "simple") MathaleaHandleExerciceSimple(exercice, false)
        seedrandom(exercice.seed, { global: true })
        exercice.nouvelleVersion()
        if ($selectedExercises.indexes.includes(k)) {
          questions[idVue] = [...questions[idVue], ...exercice.listeQuestions]
          corrections[idVue] = [...corrections[idVue], ...exercice.listeCorrections]
          questions[idVue] = questions[idVue].map(MathaleaFormatExercice)
          corrections[idVue] = corrections[idVue].map(MathaleaFormatExercice)
        }
      }
    }
    for (const exercice of exercices) {
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        consignes.push(exercice.consigne)
      }
    }
    // console.log("can/store = " + $questionsOrder.indexes)
    await tick()
    if (divExercice) MathaleaRenderDiv(divExercice)
  }

  async function switchCorrectionVisible(section: "correction" | "instructions") {
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
    if (divExercice) MathaleaRenderDiv(divExercice)
  }

  function newDataForAll() {
    const newParams: InterfaceParams[] = []
    for (const exercice of exercices) {
      exercice.seed = MathaleaGenerateSeed()
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
    MathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }

  /**
   * Gestion du pas à pas pour l'affichage des corrections
   * @param {string} button chaîne correspondant à la direction du pas à pas ("backward" ou "forward")
   */
  function handleCorrectionsStepsClick(button: "backward" | "forward") {
    if (button === "backward") {
      if (correctionsSteps.length !== 0) {
        correctionsSteps.pop()
        correctionsSteps = correctionsSteps
      }
    }
    if (button === "forward") {
      if (correctionsSteps.length < $questionsOrder.indexes.length) {
        correctionsSteps.push($questionsOrder.indexes[correctionsSteps.length])
      }
      correctionsSteps = correctionsSteps
    }
    updateDisplay()
    // console.log("correctionsSteps: " + correctionsSteps)
  }
</script>

<div class={$darkMode.isActive ? "dark" : ""}>
  <div class="fixed z-20 bottom-2 lg:bottom-6 right-2 lg:right-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas rounded-b-full rounded-t-full bg-opacity-80">
    <div class="flex flex-col space-y-2 scale-75 lg:scale-100">
      <BtnZoom size="md" />
    </div>
  </div>
  <div class="flex bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <!-- boutons commandes -->
    <aside class=" h-screen sticky top-0">
      <div class="flex flex-col bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-struct dark:text-coopmathsdark-struct w-14 min-h-screen py-4 items-center">
        <button
          type="button"
          class="pb-8 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
          on:click={() => MathaleaHandleComponentChange("can", "diaporama")}><i class="bx bx-sm bx-arrow-back" /></button
        >
        <button
          type="button"
          class="pb-8 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
          on:click={newDataForAll}><i class="bx bx-sm bx-refresh" /></button
        >
        <!-- <button type="button" class="hover:text-coopmaths-dark" on:click={newDataForAll}><i class="bx bx-sm bx-refresh" /></button> -->

        <span class="text-xs text-coopmaths-struct dark:text-coopmathsdark-struct {isQuestionsVisible ? 'font-bold' : 'font-light'}">Questions</span>
        <button type="button" disabled={!isCorrectionVisible && correctionsSteps.length === 0} on:click={() => switchCorrectionVisible("instructions")}
          ><i
            class="bx bx-sm text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest {isQuestionsVisible
              ? 'bx-toggle-right'
              : 'bx-toggle-left'} cursor-pointer"
          /></button
        >
        <span class="text-xs text-coopmaths-struct dark:text-coopmathsdark-struct {isCorrectionVisible ? 'font-bold' : 'font-light'} pt-2">Réponses</span>
        <button type="button" disabled={!isQuestionsVisible} on:click={() => switchCorrectionVisible("correction")}>
          <i
            class="mb-8 bx bx-sm text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest {isCorrectionVisible
              ? 'bx-toggle-right'
              : 'bx-toggle-left'} cursor-pointer"
          />
        </button>
        <span class="text-xs font-bold pt-2 text-coopmaths-struct dark:text-coopmathsdark-struct">Pas à pas</span>
        <div
          class="flex flex-row justify-center items-center mb-8 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
        >
          <button
            type="button"
            on:click={() => {
              handleCorrectionsStepsClick("backward")
            }}
          >
            <i class="bx bxs-left-arrow mr-2 cursor-pointer" />
          </button>
          <button
            type="button"
            on:click={() => {
              handleCorrectionsStepsClick("forward")
            }}
          >
            <i class="bx bxs-right-arrow cursor-pointer" />
          </button>
        </div>

        <!-- Onglets Séries -->
        {#if nbOfVues > 1}
          <input type="radio" id="tab1" value={0} bind:group={currentVue} on:change={updateDisplay} class="peer/tab1 items-center justify-center hidden" />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark font-bold dark:bg-coopmathsdark-canvas-dark text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab1:bg-coopmaths-canvas dark:peer-checked/tab1:bg-coopmathsdark-canvas peer-checked/tab1:text-coopmaths-struct dark:peer-checked/tab1:text-coopmathsdark-struct peer-checked/tab1:cursor-default"
            for="tab1">1</label
          >
          <input type="radio" id="tab2" value={1} bind:group={currentVue} on:change={updateDisplay} class="peer/tab2 items-center justify-center hidden" />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark font-bold dark:bg-coopmathsdark-canvas-dark text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab2:bg-coopmaths-canvas dark:peer-checked/tab2:bg-coopmathsdark-canvas peer-checked/tab2:text-coopmaths-struct dark:peer-checked/tab2:text-coopmathsdark-struct peer-checked/tab2:cursor-default"
            for="tab2">2</label
          >
        {/if}
        {#if nbOfVues > 2}
          <input type="radio" id="tab3" value={2} bind:group={currentVue} on:change={updateDisplay} class="peer/tab3 items-center justify-center hidden" />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark font-bold text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab3:bg-coopmaths-canvas dark:peer-checked/tab3:bg-coopmathsdark-canvas peer-checked/tab3:text-coopmaths-struct dark:peer-checked/tab3:text-coopmathsdark-struct peer-checked/tab3:cursor-default"
            for="tab3">3</label
          >
        {/if}
        {#if nbOfVues > 3}
          <input type="radio" id="tab4" value={3} bind:group={currentVue} on:change={updateDisplay} class="peer/tab4 items-center justify-center hidden" />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark font-bold text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab4:bg-coopmaths-canvas dark:peer-checked/tab4:bg-coopmathsdark-canvas peer-checked/tab4:text-coopmaths-struct dark:peer-checked/tab4:text-coopmathsdark-struct peer-checked/tab4:cursor-default"
            for="tab4">4</label
          >
        {/if}
        {#if nbOfVues > 1}
          <input type="radio" id="tab5" value={4} bind:group={currentVue} on:change={updateDisplay} class="hidden peer/tab5 items-center justify-center" />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark font-bold text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab5:bg-coopmaths-canvas dark:peer-checked/tab5:bg-coopmathsdark-canvas peer-checked/tab5:text-coopmaths-struct dark:peer-checked/tab5:text-coopmathsdark-struct peer-checked/tab5:cursor-default"
            for="tab5">Tout</label
          >
        {/if}
      </div>
    </aside>
    <main class="bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus w-full">
      <!-- Affichage Questions/Réponses -->
      <div class="flex p-2 h-full w-full">
        <div class="w-full" bind:this={divExercice}>
          {#if currentVue < 4}
            {#if nbOfVues > 1}
              <div class="flex flex-row items-center justify-start text-3xl font-black text-coopmaths-struct dark:text-coopmathsdark-struct p-6">
                Série {currentVue + 1}
                <!-- <button type="button" class="pl-4">
                  <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm bx-refresh" />
                </button> -->
              </div>
            {:else}
              <div class="flex flex-row items-center justify-start text-3xl font-black text-coopmaths-struct dark:text-coopmathsdark-struct p-6">
                {isQuestionsVisible ? "Questions" : ""}{isCorrectionVisible && isQuestionsVisible ? " / " : ""}{isCorrectionVisible ? "Réponses" : ""}
                <!-- <button type="button" class="pl-4">
                  <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm bx-refresh" />
                </button> -->
              </div>
            {/if}
            <div class="list-inside list-decimal mt-2 mx-2 lg:mx-6 marker:text-coopmaths-struct dark:text-coopmathsdark-struct marker:font-bold">
              {#each questions[currentVue] as question, i}
                <div>
                  <div class="flex flex-row my-4" style="font-size: {($globalOptions.z || 1).toString()}rem">
                    <div class="flex flex-col justify-start items-center pr-2">
                      <span class="inline-flex text-center text-coopmaths-struct dark:text-coopmathsdark-struct font-black">{i + 1}.</span>
                    </div>
                    <div class="flex flex-col justify-start items-start max-w-full">
                      {#if isQuestionsVisible}
                        <div>
                          {@html MathaleaFormatExercice(questions[currentVue][$questionsOrder.indexes[i]])}
                        </div>
                      {/if}
                      {#if isCorrectionVisible || correctionsSteps.includes($questionsOrder.indexes[i])}
                        <div
                          class="relative self-start border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus {isQuestionsVisible
                            ? 'my-4'
                            : ''} py-2 pl-6 max-w-full"
                        >
                          <div class="container overflow-x-auto overflow-y-hidden">
                            {@html MathaleaFormatExercice(corrections[currentVue][$questionsOrder.indexes[i]])}
                          </div>
                          <div
                            class="absolute flex flex-row py-[1.5px] px-3 rounded-t-md justify-center items-center -left-[3px] -top-[15px] bg-coopmaths-struct dark:bg-coopmathsdark-struct font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
                          >
                            Correction
                          </div>
                          <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct bottom-0 left-0 border-b-[3px] w-4" />
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="grid grid-cols-4 gap-4 place-content-stretch w-full">
              {#each Array(nbOfVues) as _, currentVueId}
                <div class="flex flex-col w-full">
                  <div class="flex flex-row justify-start items-center text-3xl font-black text-coopmaths-struct dark:text-coopmathsdark-struct p-6 w-full">
                    Série {currentVueId + 1}
                    <!-- <button type="button" class="pl-4">
                      <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm bx-refresh" />
                    </button> -->
                  </div>
                  {#each questions[currentVueId] as question, i}
                    <div class="pl-6">
                      <div class="flex flex-row items-start my-4" style="font-size: {($globalOptions.z || 1).toString()}rem">
                        <div class="flex flex-col justify-start items-center pr-2">
                          <span class="inline-flex text-center text-coopmaths-struct dark:text-coopmathsdark-struct font-black">{i + 1}.</span>
                        </div>
                        <div class="flex flex-col justify-start items-start max-w-full">
                          {#if isQuestionsVisible}
                            <div>
                              {@html MathaleaFormatExercice(questions[currentVueId][$questionsOrder.indexes[i]])}
                            </div>
                          {/if}
                          {#if isCorrectionVisible || correctionsSteps.includes($questionsOrder.indexes[i])}
                            <div
                              class="relative self-start border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus {isQuestionsVisible
                                ? 'my-4'
                                : ''} p-2 max-w-full"
                            >
                              <div class="container overflow-x-auto overflow-y-hidden">
                                {@html MathaleaFormatExercice(corrections[currentVueId][$questionsOrder.indexes[i]])}
                              </div>
                              <div
                                class="absolute flex flex-row py-[1.5px] px-3 rounded-t-md justify-center items-center -left-[3px] -top-[15px] bg-coopmaths-struct dark:bg-coopmathsdark-struct font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
                              >
                                Correction
                              </div>
                              <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct bottom-0 left-0 border-b-[3px] w-4" />
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
  </div>
</div>
