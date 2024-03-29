<script lang="ts">
  import { globalOptions, resultsByExercice } from "../store"
  import { afterUpdate, onMount, tick } from "svelte"
  import type TypeExercice from "../utils/typeExercice"
  import seedrandom from "seedrandom"
  import { prepareExerciceCliqueFigure } from "../../lib/interactif/interactif"
  import { loadMathLive } from "../../modules/loaders"
  import { MathaleaFormatExercice, MathaleaHandleExerciceSimple, MathaleaHandleStringFromUrl, MathaleaHandleSup, MathaleaRenderDiv, MathaleaUpdateUrlFromExercicesParams } from "../../lib/Mathalea"
  import { exerciceInteractif } from "../../lib/interactif/interactif"
  import { exercicesParams } from "../store"
  import HeaderExercice from "./HeaderExercice.svelte"
  import Settings from "./Settings.svelte"
  export let exercice: TypeExercice
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isCorrectionVisible = false

  let divExercice: HTMLDivElement
  let divScore: HTMLDivElement
  let buttonScore: HTMLButtonElement
  let columnsCount = $exercicesParams[indiceExercice].cols || 1
  let isVisible = true
  let isContentVisible = true
  let isSettingsVisible = false
  let isInteractif = exercice.interactif
  let isMessagesVisible = true
  let interactifReady = exercice.interactifReady
  let isExerciceChecked = false

  const title = exercice.id ? `${exercice.id.replace(".js", "")} - ${exercice.titre}` : exercice.titre

  let headerExerciceProps: {
    title: string
    isInteractif: boolean
    settingsReady?: boolean
    isSortable?: boolean
    isDeletable?: boolean
    isHidable?: boolean
    correctionReady?: boolean
    randomReady?: boolean
    interactifReady?: boolean
  } = {
    title,
    isInteractif,
    interactifReady,
  }

  $: {
    if (isContentVisible && isInteractif && buttonScore) initButtonScore()

    if ($globalOptions.v === "eleve") {
      headerExerciceProps.settingsReady = false
      headerExerciceProps.isSortable = false
      headerExerciceProps.isDeletable = false
      headerExerciceProps.isHidable = false
      if ($globalOptions.setInteractive === "1") {
        setAllInteractif()
      } else if ($globalOptions.setInteractive === "0") {
        removeAllInteractif()
      }
      if (!$globalOptions.isSolutionAccessible) {
        headerExerciceProps.correctionReady = false
        headerExerciceProps.randomReady = false
      }
    } else {
      headerExerciceProps.settingsReady = true
      headerExerciceProps.isSortable = true
      headerExerciceProps.isDeletable = true
      headerExerciceProps.isHidable = true
    }
    headerExerciceProps.isInteractif = isInteractif
    headerExerciceProps = headerExerciceProps
  }

  let numberOfAnswerFields: number = 0
  async function countMathField() {
    // IDs de la forme 'champTexteEx1Q0'
    const answerFields = document.querySelectorAll(`[id^='champTexteEx${indiceExercice}']`)
    numberOfAnswerFields = answerFields.length
  }

  onMount(async () => {
    document.addEventListener("newDataForAll", newData)
    document.addEventListener("setAllInteractif", setAllInteractif)
    document.addEventListener("removeAllInteractif", removeAllInteractif)
    updateDisplay()
    await tick()
    countMathField()
  })

  afterUpdate(async () => {
    if (exercice) {
      await tick()
      if (isInteractif) {
        loadMathLive()
        if (exercice.interactifType === "cliqueFigure") {
          prepareExerciceCliqueFigure(exercice)
        }
        // Ne pas être noté sur un exercice dont on a déjà vu la correction
        if (window.localStorage.getItem(`${exercice.id}|${exercice.seed}`) && isContentVisible) {
          newData()
        }
      }
      MathaleaRenderDiv(divExercice)
    }
  })

  async function newData() {
    if (isCorrectionVisible && isInteractif) isCorrectionVisible = false
    exercice.applyNewSeed()
    if (buttonScore) initButtonScore()
    if (isCorrectionVisible) {
      window.localStorage.setItem(`${exercice.id}|${exercice.seed}`, "true")
    }
    updateDisplay()
  }

  async function setAllInteractif() {
    if (exercice.interactifReady) isInteractif = true
    updateDisplay()
  }
  async function removeAllInteractif() {
    if (exercice.interactifReady) isInteractif = false
    updateDisplay()
  }

  function handleNewSettings(event: CustomEvent) {
    if (event.detail.nbQuestions) {
      exercice.nbQuestions = event.detail.nbQuestions
      $exercicesParams[indiceExercice].nbQuestions = exercice.nbQuestions
    }
    if (event.detail.duration) {
      exercice.duration = event.detail.duration
      $exercicesParams[indiceExercice].duration = exercice.duration
    }
    if (event.detail.sup !== undefined) {
      exercice.sup = event.detail.sup
      $exercicesParams[indiceExercice].sup = MathaleaHandleSup(exercice.sup)
    }
    if (event.detail.sup2 !== undefined) {
      exercice.sup2 = event.detail.sup2
      $exercicesParams[indiceExercice].sup2 = MathaleaHandleSup(exercice.sup2)
    }
    if (event.detail.sup3 !== undefined) {
      exercice.sup3 = event.detail.sup3
      $exercicesParams[indiceExercice].sup3 = MathaleaHandleSup(exercice.sup3)
    }
    if (event.detail.sup4 !== undefined) {
      exercice.sup4 = event.detail.sup4
      $exercicesParams[indiceExercice].sup4 = MathaleaHandleSup(exercice.sup4)
    }
    if (event.detail.alea !== undefined) {
      exercice.seed = event.detail.alea
      $exercicesParams[indiceExercice].alea = exercice.seed
    }
    if (event.detail.correctionDetaillee !== undefined) {
      exercice.correctionDetaillee = event.detail.correctionDetaillee
      $exercicesParams[indiceExercice].cd = exercice.correctionDetaillee ? "1" : "0"
    }
    if (isExerciceChecked) {
      // Si on change des réglages alors qu'on a déjà une note à l'exercice
      // alors on part sur de nouvelles données ainsi on efface le score et les réponses proposées
      isExerciceChecked = false
      newData()
    } else {
      updateDisplay()
    }
  }

  async function updateDisplay() {
    if (exercice.seed === undefined) {
      exercice.applyNewSeed()
    }
    seedrandom(exercice.seed, { global: true })
    if (exercice.typeExercice === "simple") MathaleaHandleExerciceSimple(exercice, isInteractif)
    exercice.interactif = isInteractif
    $exercicesParams[indiceExercice].alea = exercice.seed
    $exercicesParams[indiceExercice].interactif = isInteractif ? "1" : "0"
    $exercicesParams[indiceExercice].cols = columnsCount > 1 ? columnsCount : undefined
    exercice.numeroExercice = indiceExercice
    exercice.nouvelleVersion(indiceExercice)
    MathaleaUpdateUrlFromExercicesParams()
    adjustMathalea2dFiguresWidth()
  }

  function verifExercice() {
    isCorrectionVisible = true
    isExerciceChecked = true
    resultsByExercice.update((l) => {
      l[exercice.numeroExercice] = exerciceInteractif(exercice, divScore, buttonScore)
      return l
    })
  }

  function initButtonScore() {
    buttonScore.classList.remove(...buttonScore.classList)
    buttonScore.classList.add(
      "inline-flex",
      "px-6",
      "py-2.5",
      "ml-6",
      "bg-coopmaths-action",
      "dark:bg-coopmathsdark-action",
      "text-coopmaths-canvas",
      "dark:text-coopmathsdark-canvas",
      "font-medium",
      "text-xs",
      "leading-tight",
      "uppercase",
      "rounded",
      "shadow-md",
      "transform",
      "hover:bg-coopmaths-action-lightest",
      "dark:hover:bg-coopmathsdark-action-lightest",
      "hover:shadow-lg",
      "focus:bg-coopmaths-action-lightest",
      "dark:focus:bg-coopmathsdark-action-lightest",
      "focus:shadow-lg",
      "focus:outline-none",
      "focus:ring-0",
      "active:bg-coopmaths-action-lightest",
      "dark:active:bg-coopmathsdark-action-lightest",
      "active:shadow-lg",
      "transition",
      "duration-150",
      "ease-in-out",
      "checkReponses"
    )
    if (divScore) divScore.innerHTML = ""
  }

  /**
   * Recherche toutes les figures ayant la classe `mathalea2d` et réduit leur largeur à 95% de la valeur
   * maximale du div reperé par l'ID `consigne<X>-0` où `X` est l'indice de l'exercice
   * @param {boolean} initialDimensionsAreNeeded si `true`, les valeurs initiales sont rechargées ()`false` par défaut)
   * @author sylvain
   */
  async function adjustMathalea2dFiguresWidth(initialDimensionsAreNeeded: boolean = false) {
    const mathalea2dFigures = document.getElementsByClassName("mathalea2d") as HTMLCollectionOf<SVGElement>
    if (mathalea2dFigures.length !== 0) {
      await tick()
      const consigneDiv = document.getElementById("consigne" + indiceExercice + "-0")
      for (let k = 0; k < mathalea2dFigures.length; k++) {
        if (initialDimensionsAreNeeded) {
          // réinitialisation
          const initialWidth = mathalea2dFigures[k].getAttribute("data-width-initiale")
          const initialHeight = mathalea2dFigures[k].getAttribute("data-height-initiale")
          mathalea2dFigures[k].setAttribute("width", initialWidth)
          mathalea2dFigures[k].setAttribute("height", initialHeight)
        }
        // console.log("got figures !!! --> DIV " + consigneDiv.clientWidth + " vs FIG " + mathalea2dFigures[k].clientWidth)
        if (mathalea2dFigures[k].clientWidth > consigneDiv.clientWidth) {
          const coef = (consigneDiv.clientWidth * 0.95) / mathalea2dFigures[k].clientWidth
          const newFigWidth = consigneDiv.clientWidth * 0.95
          const newFigHeight = mathalea2dFigures[k].clientHeight * coef
          mathalea2dFigures[k].setAttribute("width", newFigWidth.toString())
          mathalea2dFigures[k].setAttribute("height", newFigHeight.toString())
          // console.log("fig" + k + " new dimensions : " + newFigWidth + " x " + newFigHeight)
        }
      }
    }
  }
  // pour recalculer les tailles lors d'un changement de dimension de la fenêtre
  window.onresize = (event) => {
    adjustMathalea2dFiguresWidth(true)
  }
</script>

<div class="z-0 flex-1" bind:this={divExercice}>
  <HeaderExercice
    on:clickVisible={(event) => {
      isVisible = event.detail.isVisible
    }}
    on:clickSettings={(event) => (isSettingsVisible = event.detail.isSettingsVisible)}
    on:clickCorrection={(event) => {
      isContentVisible = event.detail.isContentVisible
      isCorrectionVisible = event.detail.isCorrectionVisible
      if (isCorrectionVisible) {
        window.localStorage.setItem(`${exercice.id}|${exercice.seed}`, "true")
      }
      if (isInteractif) {
        isInteractif = !isInteractif
        exercice.interactif = isInteractif
        updateDisplay()
      }
      adjustMathalea2dFiguresWidth()
    }}
    on:clickInteractif={(event) => {
      isInteractif = event.detail.isInteractif
      exercice.interactif = isInteractif
      exercicesParams.update((params) => {
        params[indiceExercice].interactif = isInteractif ? "1" : "0"
        return params
      })
      updateDisplay()
    }}
    on:clickNewData={newData}
    {...headerExerciceProps}
    {indiceExercice}
    {indiceLastExercice}
    interactifReady={exercice.interactifReady && !isCorrectionVisible && headerExerciceProps.interactifReady}
    on:clickMessages={(event) => {
      isMessagesVisible = event.detail.isMessagesVisible
      updateDisplay()
    }}
  />

  {#if isVisible}
    <div class="flex flex-col-reverse lg:flex-row">
      <div class="flex flex-col justify-start items-start relative {isSettingsVisible ? 'w-full lg:w-3/4' : 'w-full'} duration-500" id="exercice{indiceExercice}">
        <div class="print-hidden hidden md:flex flex-row justify-start text-coopmaths-struct dark:text-coopmathsdark-struct text-xs mt-2 pl-0 md:pl-2">
          <button
            class={columnsCount > 1 ? "visible" : "invisible"}
            type="button"
            on:click={() => {
              columnsCount--
              updateDisplay()
            }}
          >
            <i class=" text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 bx-xs bx-minus" />
          </button>
          <i class="bx ml-1 bx-xs bx-columns" />
          <button
            type="button"
            on:click={() => {
              columnsCount++
              updateDisplay()
            }}
          >
            <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 bx-xs bx-plus" />
          </button>
        </div>
        <article class="lg:text-base relative" style="font-size: {($globalOptions.z || 1).toString()}rem">
          {#if typeof exercice.consigne !== undefined && exercice.consigne.length !== 0}
            <div>
              <p class="leading-relaxed mt-2 mb-2 ml-2 lg:mx-5 text-coopmaths-corpus dark:text-coopmathsdark-corpus">
                {@html exercice.consigne}
              </p>
            </div>
          {/if}
          {#if exercice.introduction}
            <div>
              <p class="leading-relaxed mt-2 mb-2 ml-2 lg:mx-5 text-coopmaths-corpus dark:text-coopmathsdark-corpus">
                {@html exercice.introduction}
              </p>
            </div>
          {/if}
          {#if isCorrectionVisible}
            <div
              class="{exercice.consigneCorrection.length !== 0 ? '' : 'hidden'}
                bg-coopmaths-warn-lightest dark:bg-coopmathsdark-warn-lightest text-coopmaths-corpus dark:text-coopmathsdark-corpus leading-relaxed mt-2 ml-2 lg:mx-5"
            >
              {@html exercice.consigneCorrection}
            </div>
          {/if}
          <div style="columns: {columnsCount.toString()}" class="mb-5">
            <ul
              class="{exercice.listeQuestions.length > 1
                ? 'list-decimal'
                : 'list-none'} list-inside my-2 mx-2 lg:mx-6 marker:text-coopmaths-struct dark:marker:text-coopmathsdark-struct marker:font-bold"
            >
              {#each exercice.listeQuestions as item, i (i)}
                <div style="break-inside:avoid" id="consigne{indiceExercice}-{i}" class="container grid grid-cols-1 auto-cols-min gap-1 lg:gap-4 mb-2 lg:mb-4">
                  <li id="exercice{indiceExercice}Q{i}">
                    {@html MathaleaFormatExercice(item)}
                  </li>
                  {#if isCorrectionVisible}
                    <div
                      class="relative border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus mt-6 lg:mt-2 mb-6 py-2 pl-4"
                      id="correction${indiceExercice}Q${i}"
                    >
                      <div class="container overflow-x-scroll overflow-y-hidden md:overflow-x-auto" style="line-height: {exercice.spacingCorr || 1}; break-inside:avoid">
                        {@html MathaleaFormatExercice(exercice.listeCorrections[i])}
                      </div>
                      <!-- Avant le commit du 28/03/23, il y avait une mise en page plus complexe
                      et cela posait problème au changement des paramètres avec la correction visible -->
                      <!-- <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct top-0 left-0 border-b-[3px] w-10" /> -->
                      <div
                        class="absolute flex flex-row py-[1.5px] px-3 rounded-t-md justify-center items-center -left-[3px] -top-[15px] bg-coopmaths-struct dark:bg-coopmathsdark-struct font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
                      >
                        Correction
                      </div>
                      <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct bottom-0 left-0 border-b-[3px] w-4" />
                    </div>
                  {/if}
                </div>
              {/each}
            </ul>
          </div>
        </article>
        {#if isInteractif && !isCorrectionVisible && isContentVisible}
          <button id="verif{indiceExercice}" type="submit" on:click={verifExercice} bind:this={buttonScore}>Vérifier {numberOfAnswerFields > 1 ? "les réponses" : "la réponse"}</button>
        {/if}
        <div bind:this={divScore} />
      </div>
      <div class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark {isSettingsVisible ? 'visible lg:w-1/4' : 'hidden lg:w-0'} flex flex-col duration-500">
        {#if isSettingsVisible}
          <Settings {exercice} on:settings={handleNewSettings} />
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  li {
    break-inside: avoid;
  }
</style>
