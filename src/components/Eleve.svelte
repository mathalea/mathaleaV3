<script lang="ts">
  import { Mathalea } from "../lib/Mathalea"
  import { exercicesParams, darkMode, globalOptions, resultsByExercice } from "./store"
  import type TypeExercice from "./utils/typeExercice"
  import Exercice from "./exercice/Exercice.svelte"
  import { onMount, tick } from "svelte"
  import seedrandom from "seedrandom"
  import { loadMathLive } from "../modules/loaders"
  import Button from "./forms/Button.svelte"
  import { verifQuestionMathLive } from "../lib/interactif/mathLive"
  import { verifQuestionQcm } from "../lib/interactif/qcm"
  import { verifQuestionListeDeroulante } from "../lib/interactif/questionListeDeroulante"
  import ButtonToggle from "./forms/ButtonToggle.svelte"
  import { verifQuestionCliqueFigure } from "../modules/interactif/cliqueFigure"
  import { prepareExerciceCliqueFigure } from "../lib/interactif/interactif"
  import BtnZoom from "./ui/btnZoom.svelte"
  import { getCanvasFont, getTextWidth, remToPixels } from "./utils/measures"
  import Footer2 from "./Footer2.svelte"

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
  let currentWindowWidth: number = document.body.clientWidth
  let displayNeedsMenu: boolean = false

  function urlToDisplay() {
    let urlOptions = Mathalea.loadExercicesFromUrl()
    globalOptions.update(() => {
      urlOptions.v = "eleve"
      return urlOptions
    })
  }

  /**
   * Adaptation du titre des pages pour chaque exercice
   * Plus le nombre d'exercices est élevé, moins le titre contient de caractères
   * @param {numer} dim largeur disponible à considérer pour le calcul si élément non dispo (déclenche le re-calcul)
   * @param {number} nbOfExercises  nombre d'exercices
   * @returns {string} titre
   * @author sylvain
   */
  function buildExoTitle(dim: number, nbOfExercises: number) {
    const navigationHeaderElt = document.getElementById("navigationHeaderID")
    const exerciseTitleElt = document.getElementById("exerciseTitleID0")
    // soit l'élément existe et on récupère sa vraie largeur, soit on calcule une valeur approchée
    const roomForQuestionsTitles = navigationHeaderElt ? navigationHeaderElt.offsetWidth : ((dim - 2 * remToPixels(1)) * 11) / 12
    const roomForOne = roomForQuestionsTitles / nbOfExercises - 2 * remToPixels(1.5)
    if (roomForOne >= getTextWidth("Exercice 10", getCanvasFont(exerciseTitleElt ?? document.body))) {
      displayNeedsMenu = false
      console.log("Menu is needed ? " + displayNeedsMenu)
      return "Exercice"
    } else if (roomForOne >= getTextWidth("Ex 10", getCanvasFont(exerciseTitleElt ?? document.body)) + 20) {
      displayNeedsMenu = false
      console.log("Menu is needed ? " + displayNeedsMenu)
      return "Ex"
    } else if (roomForOne >= getTextWidth("10", getCanvasFont(exerciseTitleElt ?? document.body)) + 20) {
      displayNeedsMenu = false
      console.log("Menu is needed ? " + displayNeedsMenu)
      return ""
    } else {
      displayNeedsMenu = true
      console.log("Menu is needed ? " + displayNeedsMenu)
      return ""
    }
  }
  $: exerciseTitle = buildExoTitle(currentWindowWidth, exercices.length)

  /**
   * Adaptation du titre des pages pour chaque question
   * Plus le nombre de questions est élevé, moins le titre contient de caractères
   * @param {numer} dim largeur disponible à considérer pour le calcul si élément non dispo (déclenche le re-calcul)
   * @param {number} nbOfQuestions  nombre de questions
   * @returns {string} titre
   * @author sylvain
   */

  function buildQuestionTitle(dim: number, nbOfQuestions: number) {
    const navigationHeaderElt = document.getElementById("navigationHeaderID")
    const questionTitleElt = document.getElementById("questionTitleID0")
    // soit l'élément existe et on récupère sa vraie largeur, soit on calcule une valeur approchée
    const roomForQuestionsTitles = navigationHeaderElt ? navigationHeaderElt.offsetWidth : ((dim - 2 * remToPixels(1)) * 11) / 12
    const roomForOne = roomForQuestionsTitles / nbOfQuestions - 2 * remToPixels(0.5)
    if (roomForOne >= getTextWidth("Question 10", getCanvasFont(questionTitleElt ?? document.body))) {
      displayNeedsMenu = false
      return "Question"
    } else if (roomForOne >= getTextWidth("Q 10", getCanvasFont(questionTitleElt ?? document.body)) + 20) {
      displayNeedsMenu = false
      return "Q"
    } else if (roomForOne >= getTextWidth("10", getCanvasFont(questionTitleElt ?? document.body))) {
      displayNeedsMenu = false
      return ""
    } else {
      displayNeedsMenu = true
      return ""
    }
  }
  $: questionTitle = buildQuestionTitle(currentWindowWidth, questions.length)

  onMount(async () => {
    // Si presMode est undefined cela signifie que l'on charge cet url
    // sinon en venant du modal il existerait
    if ($globalOptions.presMode === undefined) {
      let urlOptions = Mathalea.loadExercicesFromUrl()
      urlOptions.v = "eleve"
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
      if ($globalOptions.setInteractive === "1" && exercice.interactifReady) {
        exercice.interactif = true
      }
      if (exercice.typeExercice === "simple") {
        Mathalea.handleExerciceSimple(exercice, exercice.interactif, k)
      }
      seedrandom(exercice.seed, { global: true })
      exercice.numeroExercice = k
      exercice.nouvelleVersion(k)
      isCorrectionVisible[k] = false
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        consignes.push(exercice.consigne + exercice.introduction)
        indiceExercice.push(k)
        indiceQuestionInExercice.push(i)
      }
      questions = [...questions, ...exercice.listeQuestions]
      corrections = [...corrections, ...exercice.listeCorrections]
      questions = questions.map(Mathalea.formatExercice)
      corrections = corrections.map(Mathalea.formatExercice)
      consignes = consignes.map(Mathalea.formatExercice)
    }
    if ($globalOptions.presMode === "liste" || $globalOptions.presMode === "question") {
      // Pour les autres mode de présentation, cela est géré par ExerciceMathalea
      Mathalea.updateUrl($exercicesParams)
      await tick()
      Mathalea.renderDiv(document.querySelector("section"))
      loadMathLive()
    }
  }

  async function checkQuestion(i) {
    // ToFix exercices custom avec pointsCliquable
    const type = exercices[indiceExercice[i]].interactifType
    if (type === "mathLive") {
      resultsByQuestion[i] = verifQuestionMathLive(exercices[indiceExercice[i]], indiceQuestionInExercice[i]) === "OK"
    } else if (type === "qcm") {
      resultsByQuestion[i] = verifQuestionQcm(exercices[indiceExercice[i]], indiceQuestionInExercice[i]) === "OK"
    } else if (type === "listeDeroulante") {
      resultsByQuestion[i] = verifQuestionListeDeroulante(exercices[indiceExercice[i]], indiceQuestionInExercice[i]) === "OK"
    } else if (type === "cliqueFigure") {
      resultsByQuestion[i] = verifQuestionCliqueFigure(exercices[indiceExercice[i]], indiceQuestionInExercice[i]) === "OK"
    } else if (type === "custom") {
      resultsByQuestion[i] = exercices[indiceExercice[i]].correctionInteractive(i) === "OK"
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

<svelte:window bind:innerWidth={currentWindowWidth} />
<section class="flex flex-col min-h-screen min-w-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus {$darkMode.isActive ? 'dark' : ''}">
  <div class="mb-auto">
    <div class="h-[10%] w-full flex flex-col justify-center items-center">
      <!-- titre de la feuille -->
      <div class="w-full p-8 text-center text-4xl font-light bg-coopmaths-struct dark:bg-coopmathsdark-struct text-coopmaths-canvas dark:text-coopmathsdark-canvas">
        {$globalOptions.title}
        {displayNeedsMenu}
      </div>
      <!-- barre de navigation -->

      <div class={displayNeedsMenu ? "hidden" : ""}>
        <div
          id="navigationHeaderID"
          class="grid justify-items-center w-full mt-4 mb-8  grid-cols-{$globalOptions.presMode === 'exos' ? exercices.length : questions.length}
              {$globalOptions.presMode === 'exos' || $globalOptions.presMode === 'question' ? 'border-b-2 border-coopmaths-struct' : 'border-b-0'}
              bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-struct dark:text-coopmathsdark-struct"
        >
          {#if $globalOptions.presMode === "exos"}
            {#each $exercicesParams as paramsExercice, i (paramsExercice)}
              <div class="">
                <button
                  class="relative group {currentIndex === i
                    ? 'border-b-4'
                    : 'border-b-0'} border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                  disabled={currentIndex === i}
                  on:click={() => handleIndexChange(i)}
                >
                  <div id="exerciseTitleID{i}" class="pt-2 pb-4 px-6 text-xl font-light">
                    {exerciseTitle}
                    {i + 1}
                    {#if $resultsByExercice[i] !== undefined}
                      <div class="absolute bottom-1 left-0 right-0 mx-auto text-xs text-coopmaths-warn dark:text-coopmathsdark-warn">
                        {$resultsByExercice[i].numberOfPoints + "/" + $resultsByExercice[i].numberOfQuestions}
                      </div>
                    {/if}
                  </div>
                  <span
                    class="absolute -bottom-1 left-1/2 w-0 h-1 bg-coopmaths-struct group-hover:w-1/2 group-hover:transition-all duration-300 ease-out group-hover:ease-in group-hover:duration-300"
                  />
                  <span
                    class="absolute -bottom-1 right-1/2 w-0 h-1 bg-coopmaths-struct group-hover:w-1/2 group-hover:transition-all duration-300 ease-out group-hover:ease-in group-hover:duration-300"
                  />
                </button>
              </div>
            {/each}
          {/if}
          {#if $globalOptions.presMode === "question"}
            {#each questions as question, i (question)}
              <div class="">
                <button
                  class="relative group {currentIndex === i
                    ? 'border-b-4'
                    : 'border-b-0'} border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                  disabled={currentIndex === i}
                  on:click={() => handleIndexChange(i)}
                >
                  <div id="questionTitleID{i}" class="py-2 px-2 text-xl font-light">
                    {questionTitle}
                    {i + 1}
                    <div
                      class="absolute left-0 right-0 mx-auto bottom-1 h-2 w-2 rounded-full bg-coopmaths-warn
                      {resultsByQuestion[i] === true ? '' : 'invisible'}"
                    />
                    <div
                      class="absolute left-0 right-0 mx-auto bottom-1 h-2 w-2 rounded-full bg-red-600
                      {resultsByQuestion[i] === false ? '' : 'invisible'}"
                    />
                  </div>
                  <span
                    class="absolute -bottom-1 left-1/2 w-0 h-1 bg-coopmaths-struct group-hover:w-1/2 group-hover:transition-all duration-300 ease-out group-hover:ease-in group-hover:duration-300"
                  />
                  <span
                    class="absolute -bottom-1 right-1/2 w-0 h-1 bg-coopmaths-struct group-hover:w-1/2 group-hover:transition-all duration-300 ease-out group-hover:ease-in group-hover:duration-300"
                  />
                </button>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
    <!-- Exercices -->
    <div class="px-8">
      {#if $globalOptions.presMode === "exos"}
        <div class="absolute top-2 right-2">
          <BtnZoom size="xs" />
        </div>
        {#each $exercicesParams as paramsExercice, i (paramsExercice)}
          <div class="flex flex-col">
            <div class={displayNeedsMenu ? "hidden" : ""}>
              <button
                class="w-full {currentIndex === i
                  ? 'bg-coopmaths-canvas-darkest'
                  : 'bg-coopmaths-canvas-dark'} hover:bg-coopmaths-canvas-darkest text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                disabled={currentIndex === i}
                on:click={() => handleIndexChange(i)}
              >
                <div id="exerciseTitleID2{i}" class="flex flex-row items-center justify-center py-3 px-2 text-2xl font-bold">
                  Exercice {i + 1}
                  {#if $resultsByExercice[i] !== undefined}
                    <div class="ml-4 text-sm text-coopmaths-warn dark:text-coopmathsdark-warn">
                      {$resultsByExercice[i].numberOfPoints + "/" + $resultsByExercice[i].numberOfQuestions}
                    </div>
                  {:else}
                    <div class="ml-4 text-sm invisible">8/8</div>
                  {/if}
                </div>
              </button>
            </div>
            <div class={currentIndex === i ? "" : "hidden"}>
              <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} isCorrectionVisible={isCorrectionVisible[i]} />
              {#if exercices[i] && $globalOptions.isSolutionAccessible && !exercices[i].interactif}
                <ButtonToggle titles={["Masquer la correction", "Voir la correction"]} bind:value={isCorrectionVisible[i]} />
              {/if}
            </div>
          </div>
        {/each}
      {:else if $globalOptions.presMode === "page"}
        <div class="absolute top-2 right-2">
          <BtnZoom size="xs" />
        </div>
        {#each $exercicesParams as paramsExercice, i (paramsExercice)}
          <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} isCorrectionVisible={isCorrectionVisible[i]} />
          {#if exercices[i] && $globalOptions.isSolutionAccessible && !exercices[i].interactif}
            <div class="ml-2 lg:mx-5">
              <ButtonToggle titles={["Masquer la correction", "Voir la correction"]} bind:value={isCorrectionVisible[i]} />
            </div>
          {/if}
        {/each}
      {:else if $globalOptions.presMode === "liste"}
        {#each questions as question, k (question)}
          <div class="pb-4 flex flex-col items-start justify-start" id={`exercice${indiceExercice[k]}Q${k}`}>
            <div class="flex flex-row justify-start items-center">
              <div class="text-coopmaths-struct font-bold text-md">Question {k + 1}</div>
              {#if exercices[indiceExercice[k]].interactif}
                <Button title="Vérifier" classDeclaration="p-1 font-bold rounded-xl text-xs ml-2" on:click={() => checkQuestion(k)} isDisabled={isDisabledButton[k]} />
              {:else if $globalOptions.isSolutionAccessible}
                <ButtonToggle titles={["Voir la correction", "Masquer la correction"]} classAddenda="ml-4" on:click={() => switchCorrectionVisible(k)} />
              {/if}
            </div>
            <div class="container grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
              <div class="flex flex-col my-2 py-2">
                <div class="text-coopmaths-corpus pl-2 pb-2">
                  {@html consignes[k]}
                </div>
                <div class="text-coopmaths-corpus pl-2 pb-2">
                  {@html question}
                  <span id={`resultatCheckEx${indiceExercice[k]}Q${k}`} />
                </div>
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
            </div>
          </div>
        {/each}
      {:else if $globalOptions.presMode === "question"}
        {#each questions as question, k (question)}
          <div class="flex flex-col">
            <div class="md:hidden">
              <button
                class="w-full {currentIndex === k
                  ? 'bg-coopmaths-canvas-darkest'
                  : 'bg-coopmaths-canvas-dark'} hover:bg-coopmaths-canvas-darkest text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                disabled={currentIndex === k}
                on:click={() => handleIndexChange(k)}
              >
                <div id="questionTitleID2{k}" class="flex flex-row items-center justify-center py-3 px-2 text-xl font-bold">
                  Question {k + 1}
                  <div class="relative ml-2 h-2 w-2 rounded-full bg-coopmaths-canvas-dark">
                    <div class="absolute h-2 w-2 rounded-full bg-coopmaths-warn {resultsByQuestion[k] === true ? '' : 'hidden'}" />
                    <div class="absolute h-2 w-2 rounded-full bg-red-600 {resultsByQuestion[k] === false ? '' : 'hidden'}" />
                  </div>
                </div>
              </button>
            </div>
            <div class={currentIndex === k ? "" : "hidden"} id={`exercice${indiceExercice[k]}Q${k}`}>
              <div class="pb-4 flex flex-col items-start justify-start">
                <!-- <div class="text-coopmaths-struct font-bold text-md">Question {k + 1}</div> -->
                <div class="container grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
                  <div class="flex flex-col my-2 py-2">
                    <div class="text-coopmaths-corpus pl-2">
                      {@html consignes[k]}
                    </div>
                    <div class="text-coopmaths-corpus pl-2">
                      {@html question}
                      <span id={`resultatCheckEx${indiceExercice[k]}Q${k}`} />
                    </div>
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
                </div>
                {#if exercices[indiceExercice[k]].interactif}
                  <div class="pb-4 mt-10">
                    <Button title="Vérifier" on:click={() => checkQuestion(k)} isDisabled={isDisabledButton[k]} />
                  </div>
                {:else if $globalOptions.isSolutionAccessible}
                  <ButtonToggle titles={["Voir la correction", "Masquer la correction"]} on:click={() => switchCorrectionVisible(k)} />
                {/if}
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <Footer2 />
</section>
