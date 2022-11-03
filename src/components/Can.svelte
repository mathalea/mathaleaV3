<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { Mathalea } from '../Mathalea'
  import { exercicesParams } from './store'
  import type { Exercice } from './utils/typeExercice'
  import seedrandom from 'seedrandom'

  let exercices: Exercice[] = []
  let questions: [string[], string[], string[], string[]] = [[], [], [], []] // Concaténation de toutes les questions des exercices de exercicesParams, vue par vue
  let corrections: [string[], string[], string[], string[]] = [[], [], [], []]
  let consignes: string[] = []
  let durations: number[] = []
  let nbOfVues = 4
  let currentVue: 0|1|2|3 = 0
  let isCorrectionVisible = false
  let divExercice: HTMLElement

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
      if (paramsExercice.cd !== undefined) exercice.correctionDetaillee = paramsExercice.cd === '1'
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
        if (idVue > 0) exercice.seed = exercice.seed + idVue
        if (exercice.typeExercice === 'simple') Mathalea.handleExerciceSimple(exercice, false)
        seedrandom(idVue, { global: true })
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

  async function switchCorrectionVisible () {
    isCorrectionVisible = !isCorrectionVisible
    updateDisplay()
  }

  async function updateDisplay() {
    await tick()
    if (divExercice) Mathalea.renderDiv(divExercice)
  }
</script>

<button type="button" on:click={switchCorrectionVisible}><i class="bx ml-2 bx-sm {isCorrectionVisible ? 'bx-hide' : 'bx-show'}" /></button>

  <input
    class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
    type="radio"
    name="version"
    value={0}
    bind:group={currentVue}
    on:change={updateDisplay}
  />
  <label class="form-check-label inline-block text-gray-800" for="multivueRadio1"> Version 1 </label>

  <input
    class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
    type="radio"
    name="version"
    value={1}
    bind:group={currentVue}
    on:change={updateDisplay}
  />
  <label class="form-check-label inline-block text-gray-800" for="multivueRadio1"> Version 2 </label>

  <input
    class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
    type="radio"
    name="version"
    value={2}
    bind:group={currentVue}
    on:change={updateDisplay}
  />
  <label class="form-check-label inline-block text-gray-800" for="multivueRadio1"> Version 3 </label>

  <input
    class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
    type="radio"
    name="version"
    value={3}
    bind:group={currentVue}
    on:change={updateDisplay}
  />
  <label class="form-check-label inline-block text-gray-800" for="multivueRadio1"> Version 4 </label>


<main class="flex grow max-h-full dark:bg-white dark:text-slate-800 p-10">
  <div bind:this={divExercice}>
    <ul class="list-inside list-decimal mt-2 mx-2 lg:mx-6 marker:text-coopmaths marker:font-bold">
      {#each questions[currentVue] as question, i}
        <div>
          <li class="my-4">
            {@html Mathalea.formatExercice(question)}
          </li>
          {#if isCorrectionVisible}
          <div class="bg-gray-200 my-4 p-2">
            {@html Mathalea.formatExercice(corrections[currentVue][i])}
          </div>
          {/if}
        </div>
      {/each}
    </ul>
  </div>
</main>
