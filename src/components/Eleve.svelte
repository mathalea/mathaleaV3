<script lang="ts">
  import { Mathalea } from '../Mathalea'
  import { exercicesParams, darkMode, globalOptions, resultsByExercice } from './store'
  import type TypeExercice from './utils/typeExercice'
  import Exercice from './exercice/Exercice.svelte'
  import { onMount, tick } from 'svelte'
  import seedrandom from 'seedrandom'
  import { loadMathLive } from '../modules/loaders'
  import Button from './forms/Button.svelte'
  import { verifQuestionMathLive } from '../interactif/mathLive'
  import { verifQuestionQcm } from '../interactif/qcm'
  import { verifQuestionListeDeroulante } from '../interactif/questionListeDeroulante'
  import ButtonToggle from './forms/ButtonToggle.svelte'
  import { verifQuestionCliqueFigure } from '../modules/interactif/cliqueFigure'
  import { prepareExerciceCliqueFigure } from '../interactif/interactif'
  import Footer from './Footer.svelte'

  let currentIndex: number = 0
  let exercices: TypeExercice[] = []
  let questions: string[] = []
  let consignes: string[] = []
  let corrections: string[] = []
  let indiceExercice: number[] = []
  let indiceQuestionInExercice: number[] = []
  let resultsByQuestion: boolean[] = []
  let isDisabledButton: boolean[] = []
  let isCorrectionVisible: boolean[] = []
  let divsCorrection: HTMLDivElement[] = []

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
      return 'Exercice'
    } else if (num <= 12) {
      return 'Ex'
    } else {
      return ''
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
      return 'Question'
    } else if (num <= 20) {
      return 'Q'
    } else {
      return ''
    }
  }
  $: questionTitle = buildQuestionTitle(questions.length)

  onMount(async () => {
    // Si presMode est undefined cela signifie que l'on charge cet url
    // sinon en venant du modal il existerait
    if ($globalOptions.presMode === undefined) {
      let urlOptions = Mathalea.loadExercicesFromUrl()
      urlOptions.v = 'eleve'
      globalOptions.update(() => {
        return urlOptions
      })
      urlToDisplay()
    } else {
      // Si ce n'est pas un chargement d'url alors il faut initialiser le store des résultats
      resultsByExercice.update(() => [])
    }
    for (const paramsExercice of $exercicesParams) {
      const exercice: TypeExercice = await Mathalea.load(paramsExercice.uuid)
      if (typeof exercice === 'undefined') return
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
      if (paramsExercice.cd !== undefined) exercice.correctionDetaillee = paramsExercice.cd === '1'
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
      if ($globalOptions.setInteractive === '1' && exercice.interactifReady) {
        exercice.interactif = true
      }
      if (exercice.typeExercice === 'simple') {
        Mathalea.handleExerciceSimple(exercice, exercice.interactif, k)
      }
      seedrandom(exercice.seed, { global: true })
      exercice.numeroExercice = k
      exercice.nouvelleVersion(k)
      isCorrectionVisible[k] = false
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
  async function checkQuestion(i) {
    // ToFix exercices custom avec pointsCliquable
    const type = exercices[indiceExercice[i]].interactifType
    if (type === 'mathLive') {
      resultsByQuestion[i] = verifQuestionMathLive(exercices[indiceExercice[i]], indiceQuestionInExercice[i]) === 'OK'
    } else if (type === 'qcm') {
      resultsByQuestion[i] = verifQuestionQcm(exercices[indiceExercice[i]], indiceQuestionInExercice[i]) === 'OK'
    } else if (type === 'listeDeroulante') {
      resultsByQuestion[i] = verifQuestionListeDeroulante(exercices[indiceExercice[i]], indiceQuestionInExercice[i]) === 'OK'
    } else if (type === 'cliqueFigure') {
      resultsByQuestion[i] = verifQuestionCliqueFigure(exercices[indiceExercice[i]], indiceQuestionInExercice[i]) === 'OK'
    } else if (type === 'custom') {
      resultsByQuestion[i] = exercices[indiceExercice[i]].correctionInteractive(i) === 'OK'
    }
    isDisabledButton[i] = true
    isCorrectionVisible[i] = true
    await tick()
    Mathalea.renderDiv(divsCorrection[i])
  }

  async function switchCorrectionVisible(i: number) {
    isCorrectionVisible[i] = !isCorrectionVisible[i]
    if (isCorrectionVisible[i]) {
      await tick()
      Mathalea.renderDiv(divsCorrection[i])
    }
  }

  function handleIndexChange(exoNum: number) {
    currentIndex = exoNum
    if (exercices[exoNum].interactifType === "cliqueFigure" && exercices[exoNum].interactif) {
          prepareExerciceCliqueFigure(exercices[exoNum])
        }
  }
</script>

<section class="flex flex-col min-h-screen min-w-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus {$darkMode.isActive ? 'dark' : ''}">
  <div
    class="mb-auto"
  >
    <div class="h-32 w-full  bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-struct dark:text-coopmathsdark-struct">
      <div class="w-full flex flex-row justify-start p-4 items-center">
        <!-- titre de la feuille -->
        <div class="inline-flex text-4xl font-extrabold ml-4 mr-10">{$globalOptions.title}</div>
        <!-- barre de navigation -->
        {#if $globalOptions.presMode === 'exos'}
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
                  <div class="relative py-2 px-6 text-xl font-bold">
                    {exerciceTitle}
                    {i + 1}
                    {#if $resultsByExercice[i] !== undefined}
                      <div class="text-xs">
                        {$resultsByExercice[i].numberOfPoints + '/' + $resultsByExercice[i].numberOfQuestions}
                      </div>
                    {/if}
                  </div>
                </button>
              </div>
            {/each}
          </div>
        {/if}
        {#if $globalOptions.presMode === 'question'}
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
                  <div class="relative py-2 px-6 text-xl font-bold">
                    {questionTitle}
                    {i + 1}
                    <div
                      class="absolute left-0 right-0 ml-auto mr-auto bottom-1 h-2 w-2 rounded-full bg-coopmaths-warn
                    {resultsByQuestion[i] === true ? '' : 'invisible'}"
                    />
                    <div
                      class="absolute left-0 right-0 ml-auto mr-auto bottom-1 h-2 w-2 rounded-full bg-red-600
                    {resultsByQuestion[i] === false ? '' : 'invisible'}"
                    />
                  </div>
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    <!-- Exercices -->
    <div class="px-8">
      {#if $globalOptions.presMode === 'exos'}
        {#each $exercicesParams as paramsExercice, i (paramsExercice)}
          <div class={currentIndex === i ? '' : 'hidden'}>
            <Exercice
              {paramsExercice}
              indiceExercice={i}
              indiceLastExercice={$exercicesParams.length}
              isCorrectionVisible={isCorrectionVisible[i]}
            />
            {#if exercices[i] && $globalOptions.isSolutionAccessible && !exercices[i].interactif}
              <ButtonToggle titles={['Masquer la correction', 'Voir la correction']} bind:value={isCorrectionVisible[i]} />
            {/if}
          </div>
        {/each}
      {:else if $globalOptions.presMode === 'page'}
        {#each $exercicesParams as paramsExercice, i (paramsExercice)}
          <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} />
        {/each}
      {:else if $globalOptions.presMode === 'liste'}
        {#each questions as question, k (question)}
          <div class="pb-4 flex flex-col items-start justify-start" id={`exercice${indiceExercice[k]}Q${k}`}>
            <div class="text-coopmaths-struct font-bold text-md">Question {k + 1}</div>
            <div class="text-coopmaths-corpus pl-2">
              {@html consignes[k]}
            </div>
            <div class="text-coopmaths-corpus pl-2">
              {@html question}
              <span id={`resultatCheckEx${indiceExercice[k]}Q${k}`}></span>
            </div>
            {#if isCorrectionVisible[k]}
              <div
                class="relative border-l-coopmaths-warn-lightest dark:border-l-coopmathsdark-warn-lightest border-l-8 text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest my-2 py-2 pl-6"
                style="break-inside:avoid"
                bind:this={divsCorrection[k]}
              >
                {@html Mathalea.formatExercice(corrections[k])}
                <div
                  class="absolute flex flex-row justify-center items-center -left-4 top-0 rounded-full bg-coopmaths-warn-lightest dark:bg-coopmathsdark-warn-lightest text-coopmaths-canvas dark:text-coopmathsdark-canvas h-6 w-6"
                >
                  <i class="bx bx-sm bx-check" />
                </div>
              </div>
            {/if}
            {#if exercices[indiceExercice[k]].interactif}
              <Button title="Vérifier" on:click={() => checkQuestion(k)} isDisabled={isDisabledButton[k]} />
            {:else if $globalOptions.isSolutionAccessible}
              <ButtonToggle titles={['Masquer la correction', 'Voir la correction']} on:click={() => switchCorrectionVisible(k)} />
            {/if}
          </div>
        {/each}
      {:else if $globalOptions.presMode === 'question'}
        {#each questions as question, k (question)}
          <div class={currentIndex === k ? '' : 'hidden'} id={`exercice${indiceExercice[k]}Q${k}`}>
            <div class="pb-4 flex flex-col items-start justify-start">
              <div class="text-coopmaths-struct font-bold text-md">Question {k + 1}</div>
              <div class="text-coopmaths-corpus pl-2">
                {@html consignes[k]}
              </div>
              <div class="text-coopmaths-corpus pl-2">
                {@html question}
                <span id={`resultatCheckEx${indiceExercice[k]}Q${k}`}></span>
              </div>
              {#if exercices[indiceExercice[k]].interactif}
                <div class="pb-4 mt-10">
                  <Button title="Vérifier" on:click={() => checkQuestion(k)} isDisabled={isDisabledButton[k]} />
                </div>
              {:else if $globalOptions.isSolutionAccessible}
                <ButtonToggle titles={['Masquer la correction', 'Voir la correction']} on:click={() => switchCorrectionVisible(k)} />
              {/if}
              {#if isCorrectionVisible[k]}
                <div
                  class="relative border-l-coopmaths-warn-lightest dark:border-l-coopmathsdark-warn-lightest border-l-8 text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest my-2 py-2 pl-6"
                  style="break-inside:avoid"
                  bind:this={divsCorrection[k]}
                >
                  {@html Mathalea.formatExercice(corrections[k])}
                  <div
                    class="absolute flex flex-row justify-center items-center -left-4 top-0 rounded-full bg-coopmaths-warn-lightest dark:bg-coopmathsdark-warn-lightest text-coopmaths-canvas dark:text-coopmathsdark-canvas h-6 w-6"
                  >
                    <i class="bx bx-sm bx-check" />
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <Footer/>
</section>
