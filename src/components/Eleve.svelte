<script lang="ts">
  import { Mathalea } from "../Mathalea"
  import { exercicesParams, darkMode, globalOptions } from "./store"
  import type TypeExercice from "./utils/typeExercice"
  import Exercice from "./exercice/Exercice.svelte"
  import { onMount, tick } from "svelte"
  import seedrandom from "seedrandom"
  import { loadMathLive } from '../modules/loaders'
  import Button from "./forms/Button.svelte"
  import { verifQuestionMathLive } from '../interactif/mathLive'

  let currentIndex: number = 0
  let exercices: TypeExercice[] = []
  let questions: string[] = []
  let consignes: string[] = []
  let corrections: string[] = []
  let indiceExercice: number[] = []
  let indiceQuestionInExercice : number[] = []
  let results: string[] = []
  
  function urlToDisplay() {
    let urlOptions = Mathalea.loadExercicesFromUrl()
    globalOptions.update(() => {
      urlOptions.v = 'eleve'
      return urlOptions
    })
  }

  /**
   * Adaptation du titre des pages pour chaque exercice
   * Plus le nombre d'exercices est élevé, moins le titre contient de caractères
   * @param {number} num  nombre d'exercices
   * @returns {string} titre
   * @author sylvain
   */
  function buildExoTitle(num: number) {
    if (num <= 6) {
      return "Exercice"
    } else if (num <= 12) {
      return "Ex"
    } else {
      return ""
    }
  }
  $: exerciceTitle = buildExoTitle(exercices.length)

  /**
   * Adaptation du titre des pages pour chaque question
   * Plus le nombre de questions est élevé, moins le titre contient de caractères
   * @param {number} num  nombre de questions
   * @returns {string} titre
   * @author sylvain
   */
  function buildQuestionTitle(num: number) {
    if (num <= 6) {
      return "Question"
    } else if (num <= 20) {
      return "Q"
    } else {
      return ""
    }
  }
  $: questionTitle = buildQuestionTitle(questions.length)

  onMount(async () => {
    if ($globalOptions.presMode === undefined) {
      let urlOptions = Mathalea.loadExercicesFromUrl()
      urlOptions.v = 'eleve'
      globalOptions.update(() => {
        return urlOptions
      })
      urlToDisplay()
    }
    for (const paramsExercice of $exercicesParams) {
      const exercice: TypeExercice = await Mathalea.load(paramsExercice.uuid)
      if (typeof exercice === "undefined") return
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
    await tick()
    buildQuestions()
  })

  async function buildQuestions() {
    for (const [k, exercice] of exercices.entries()) {
      if ($globalOptions.setInteractive === '1') {
        exercice.interactif = true
      }
      if (exercice.typeExercice === "simple") {
        Mathalea.handleExerciceSimple(exercice, exercice.interactif)
      } 
      seedrandom(exercice.seed, { global: true })
      exercice.numeroExercice = k
      exercice.nouvelleVersion(k)
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        consignes.push(exercice.consigne)
        indiceExercice.push(k)
        indiceQuestionInExercice.push(i)
      }
      questions = [...questions, ...exercice.listeQuestions]
      corrections = [...corrections, ...exercice.listeCorrections]
      questions = questions.map(Mathalea.formatExercice)
      corrections = corrections.map(Mathalea.formatExercice)
      consignes = consignes.map(Mathalea.formatExercice)
    }
    if ($globalOptions.presMode === 'liste' || $globalOptions.presMode === 'question') {
      // Pour les autres mode de présentation, cela est géré par ExerciceMathalea
      Mathalea.updateUrl($exercicesParams)
      await tick()
      Mathalea.renderDiv(document.querySelector('section'))
      loadMathLive()
    }
  }
function checkQuestion (i) {
  // ToFix il faudra gérer les exercices non MathLive
  results[i] =verifQuestionMathLive(exercices[indiceExercice[i]], indiceQuestionInExercice[i])
}

  function handleIndexChange(exoNum: number) {
    currentIndex = exoNum
  }
</script>

<section class={$darkMode.isActive ? "dark" : ""}>
  <div class="flex flex-col min-h-screen min-w-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus">
    <div class="h-32 w-full  bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-struct dark:text-coopmathsdark-struct">
      <div class="w-full flex flex-row justify-start p-4 items-center">
        <!-- titre de la feuille -->
        <div class="inline-flex text-4xl font-extrabold ml-4 mr-10">{$globalOptions.title}</div>
        <!-- barre de navigation -->
        {#if $globalOptions.presMode === "exos"}
          <div class="w-full flex flex-row overflow-x-auto justify-center space-x-0 border-b-2 border-coopmaths-struct">
            {#each $exercicesParams as paramsExercice, i (paramsExercice)}
              <div class="">
                <button
                  class="{currentIndex === i
                    ? 'border-b-4'
                    : 'border-b-0'} border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                  disabled={currentIndex === i}
                  on:click={() => handleIndexChange(i)}
                >
                  <div class="py-2 px-6 text-xl font-bold">
                    {exerciceTitle}
                    {i + 1}
                  </div>
                </button>
              </div>
            {/each}
          </div>
        {/if}
        {#if $globalOptions.presMode === "question"}
          <div class="w-full flex flex-row overflow-x-auto justify-center space-x-0 border-b-2 border-coopmaths-struct">
            {#each questions as question, i (question)}
              <div class="">
                <button
                  class="{currentIndex === i
                    ? 'border-b-4'
                    : 'border-b-0'} border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                  disabled={currentIndex === i}
                  on:click={() => handleIndexChange(i)}
                >
                  <div class="py-2 px-6 text-xl font-bold">
                    {questionTitle}
                    {i + 1}
                  </div>
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    <div class="px-8">
      {#if $globalOptions.presMode === "exos"}
        {#each $exercicesParams as paramsExercice, i (paramsExercice)}
          <div class={currentIndex === i ? "" : "hidden"}>
            <Exercice {paramsExercice} indiceExercice={currentIndex} indiceLastExercice={$exercicesParams.length} />
          </div>
        {/each}
      {:else if $globalOptions.presMode === "page"}
        {#each $exercicesParams as paramsExercice, i (paramsExercice)}
          <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} />
        {/each}
      {:else if $globalOptions.presMode === "liste"}
        {#each questions as question, k (question)}
          <div class="pb-4 flex flex-col items-start justify-start">
            <div class="text-coopmaths-struct font-bold text-md">Question {k + 1}</div>
            <div class="text-coopmaths-corpus pl-2">
              {@html consignes[k]}
            </div>
            <div class="text-coopmaths-corpus pl-2">
              {@html question}
            </div>
          </div>
        {/each}
      {:else if $globalOptions.presMode === "question"}
        {#each questions as question, k (question)}
          <div class={currentIndex === k ? "" : "hidden"}>
            <div class="pb-4 flex flex-col items-start justify-start">
              <div class="text-coopmaths-struct font-bold text-md">Question {k + 1}</div>
              <div class="text-coopmaths-corpus pl-2">
                {@html consignes[k]}
              </div>
              <div class="text-coopmaths-corpus pl-2">
                {@html question}
              </div>
              {#if exercices[indiceExercice[k]].interactif}
              <div class="pb-4 mt-10">
                <Button title="Vérifier" on:click={() => checkQuestion(k)}/>
              </div>
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</section>
