<script lang="ts">
  import { globalOptions, questionsOrder, selectedExercises, darkMode } from "./store"
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
  let isCorrectionVisible = false
  let isQuestionsVisible = true
  let divExercice: HTMLElement
  let correctionsSteps: number[] = []

  let currentExerciceNumber: number = 0
  let currentExercice = {}

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
  })

  function handleExerciseChange(exoNum: number) {
    currentExerciceNumber = exoNum
  }
</script>

<div class={$darkMode.isActive ? "dark" : ""}>
  <div class="flex flex-col min-h-screen min-w-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus">
    <div class="h-32 w-full  bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-struct dark:text-coopmathsdark-struct">
      <div class="flex flex-row justify-start p-4 items-center">
        <div class="text-4xl font-extrabold ml-4 mr-10">Évaluation</div>
        <div class="w-full flex flex-row justify-center space-x-0 border-b-2 border-coopmaths-struct">
          {#each $exercicesParams as paramsExercice, i (paramsExercice)}
            <div class="">
              <button
                class="{currentExerciceNumber === i
                  ? 'border-b-4'
                  : 'border-b-0'} border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                disabled={currentExerciceNumber === i}
                on:click={() => handleExerciseChange(i)}
              >
                <div class="py-2 px-6 text-xl font-bold">
                  Exercice {i + 1}
                </div>
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class="px-8">
      Exercice {currentExerciceNumber}
    </div>
  </div>
</div>
