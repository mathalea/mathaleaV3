<script lang="ts">
  import ButtonToggle from "../forms/ButtonToggle.svelte"
  import { globalOptions, resultsByExercice } from "../store"
  import { afterUpdate, onMount, tick } from "svelte"
  import type TypeExercice from "../utils/typeExercice"
  import seedrandom from "seedrandom"
  import { prepareExerciceCliqueFigure, exerciceInteractif } from "../../lib/interactif/interactif"
  import { loadMathLive } from "../../modules/loaders"
  import { MathaleaFormatExercice, MathaleaGenerateSeed, MathaleaHandleExerciceSimple, MathaleaRenderDiv, MathaleaUpdateUrlFromExercicesParams } from "../../lib/Mathalea"
  import { exercicesParams, isMenuNeededForExercises } from "../store"
  import HeaderExerciceVueEleve from "./HeaderExerciceVueEleve.svelte"
  export let exercice: TypeExercice
  export let indiceExercice: number
  export let isCorrectionVisible = false

  let divExercice: HTMLDivElement
  let divScore: HTMLDivElement
  let buttonScore: HTMLButtonElement
  let columnsCount = $exercicesParams[indiceExercice].cols || 1
  let isInteractif = exercice.interactif
  let isMessagesVisible = true
  let interactifReady = exercice.interactifReady

  const title = exercice.id ? `${exercice.id.replace(".js", "")} - ${exercice.titre}` : exercice.titre

  let headerExerciceProps: {
    title: string
    isInteractif: boolean
    correctionReady?: boolean
    randomReady?: boolean
    interactifReady?: boolean
  } = {
    title,
    isInteractif,
    interactifReady,
  }

  $: {
    if (isInteractif && buttonScore) initButtonScore()

    if ($globalOptions.setInteractive === "1") {
      setAllInteractif()
    } else if ($globalOptions.setInteractive === "0") {
      removeAllInteractif()
    }
    if (!$globalOptions.isSolutionAccessible) {
      headerExerciceProps.correctionReady = false
      headerExerciceProps.randomReady = false
    }
    headerExerciceProps.isInteractif = isInteractif
    headerExerciceProps = headerExerciceProps
  }

  onMount(async () => {
    document.addEventListener("newDataForAll", newData)
    document.addEventListener("setAllInteractif", setAllInteractif)
    document.addEventListener("removeAllInteractif", removeAllInteractif)
    updateDisplay()
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
        if (window.localStorage.getItem(`${exercice.id}|${exercice.seed}`)) {
          newData()
        }
      }
      MathaleaRenderDiv(divExercice)
      adjustMathalea2dFiguresWidth()
    }
  })

  async function newData() {
    if (isCorrectionVisible) isCorrectionVisible = false
    const seed = MathaleaGenerateSeed()
    exercice.seed = seed
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

  async function updateDisplay() {
    if (exercice.seed === undefined) exercice.seed = MathaleaGenerateSeed()
    seedrandom(exercice.seed, { global: true })
    if (exercice.typeExercice === "simple") MathaleaHandleExerciceSimple(exercice, isInteractif)
    exercice.interactif = isInteractif
    $exercicesParams[indiceExercice].alea = exercice.seed
    $exercicesParams[indiceExercice].interactif = isInteractif ? "1" : "0"
    $exercicesParams[indiceExercice].cols = columnsCount > 1 ? columnsCount : undefined
    exercice.numeroExercice = indiceExercice
    exercice.nouvelleVersion(indiceExercice)
    MathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }

  function verifExercice() {
    isCorrectionVisible = true
    resultsByExercice.update((l) => {
      l[exercice.numeroExercice] = exerciceInteractif(exercice, divScore, buttonScore)
      return l
    })
  }

  function initButtonScore() {
    buttonScore.classList.remove(...buttonScore.classList)
    buttonScore.classList.add(
      "inline-block",
      "px-6",
      "py-2.5",
      "mr-10",
      "my-5",
      "ml-6",
      "bg-coopmaths",
      "text-white",
      "font-medium",
      "text-xs",
      "leading-tight",
      "uppercase",
      "rounded",
      "shadow-md",
      "transform",
      "hover:scale-110",
      "hover:bg-coopmaths-dark",
      "hover:shadow-lg",
      "focus:bg-coopmaths-dark",
      "focus:shadow-lg",
      "focus:outline-none",
      "focus:ring-0",
      "active:bg-coopmaths-dark",
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
      const consigne_div = document.getElementById("consigne" + indiceExercice + "-0")
      for (let k = 0; k < mathalea2dFigures.length; k++) {
        if (initialDimensionsAreNeeded) {
          // réinitialisation
          const initialWidth = mathalea2dFigures[k].getAttribute("data-width-initiale")
          const initialHeight = mathalea2dFigures[k].getAttribute("data-height-initiale")
          mathalea2dFigures[k].setAttribute("width", initialWidth)
          mathalea2dFigures[k].setAttribute("height", initialHeight)
        }
        // console.log("got figures !!! --> DIV " + consigne_div.clientWidth + " vs FIG " + mathalea2dFigures[k].clientWidth)
        if (mathalea2dFigures[k].clientWidth > consigne_div.clientWidth) {
          const coef = (consigne_div.clientWidth * 0.95) / mathalea2dFigures[k].clientWidth
          const newFigWidth = consigne_div.clientWidth * 0.95
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

<div class="z-0 flex-1 overflow-hidden" bind:this={divExercice}>
  <HeaderExerciceVueEleve
    on:clickCorrection={(event) => {
      isCorrectionVisible = event.detail.isCorrectionVisible
      if (isCorrectionVisible) {
        window.localStorage.setItem(`${exercice.id}|${exercice.seed}`, "true")
      }
      if (isInteractif) {
        isInteractif = !isInteractif
        exercice.interactif = isInteractif
        updateDisplay()
      }
    }}
    on:clickInteractif={(event) => {
      isInteractif = event.detail.isInteractif
      exercice.interactif = isInteractif
      $exercicesParams[indiceExercice].interactif = isInteractif ? "1" : "0"
      updateDisplay()
    }}
    on:clickNewData={newData}
    {...headerExerciceProps}
    {indiceExercice}
    interactifReady={exercice.interactifReady && !isCorrectionVisible && headerExerciceProps.interactifReady}
    on:clickMessages={(event) => {
      isMessagesVisible = event.detail.isMessagesVisible
      updateDisplay()
    }}
  />

  <div class="flex flex-col-reverse lg:flex-row">
    <div class="flex flex-col w-full" id="exercice{indiceExercice}">
      <div class="flex flex-row justify-start items-center mt-2">
        <div class="hidden md:flex flex-row justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct text-xs pl-0 md:pl-2">
          <button
            class={columnsCount > 1 ? "visible" : "invisible"}
            type="button"
            on:click={() => {
              columnsCount--
              updateDisplay()
            }}
          >
            <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 bx-xs bx-minus" />
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
        {#if $globalOptions.isSolutionAccessible && !isInteractif}
          <div class="ml-2 lg:mx-5">
            <ButtonToggle titles={["Masquer la correction", "Voir la correction"]} bind:value={isCorrectionVisible} on:click={() => adjustMathalea2dFiguresWidth()} />
          </div>
        {/if}
      </div>
      <article class=" {$isMenuNeededForExercises ? 'text-2xl' : 'text-base'} relative" style="font-size: {($globalOptions.z || 1).toString()}rem">
        <div class="flex flex-col">
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
              class="{exercice.consigneCorrection.length !== 0
                ? ''
                : 'hidden'} bg-coopmaths-warn-lightest dark:bg-coopmathsdark-warn-lightest text-coopmaths-corpus dark:text-coopmathsdark-corpus leading-relaxed mt-2 ml-2 lg:mx-5"
            >
              {@html exercice.consigneCorrection}
            </div>
          {/if}
        </div>
        <div style="columns: {columnsCount.toString()}">
          <ul
            class="{exercice.listeQuestions.length > 1
              ? 'list-decimal'
              : 'list-none'} list-inside my-2 mx-2 lg:mx-6 marker:text-coopmaths-struct dark:marker:text-coopmathsdark-struct marker:font-bold"
          >
            {#each exercice.listeQuestions as item, i (i)}
              <div style="break-inside:avoid" id="consigne{indiceExercice}-{i}" class="container grid grid-cols-1 auto-cols-min gap-4 mb-2 lg:mb-4">
                <li style={i < exercice.listeQuestions.length ? `margin-bottom: ${exercice.spacing}em; line-height: 1` : ""} id="exercice{indiceExercice}Q{i}">
                  {@html MathaleaFormatExercice(item)}
                </li>
                {#if isCorrectionVisible}
                  <div
                    class="relative self-start border-l-coopmaths-warn-dark dark:border-l-coopmathsdark-warn-dark border-l-4 text-coopmaths-corpus dark:text-coopmathsdark-corpus mb-2 lg:mb-0 ml-0 lg:ml-0 py-2 pl-4 lg:pl-6"
                    style="margin-top: ${exercice.spacing}em; margin-bottom: ${exercice.spacing}em; line-height: {exercice.spacingCorr || 1}; break-inside:avoid"
                    id="correction${indiceExercice}Q${i}"
                  >
                    <div class="container">{@html MathaleaFormatExercice(exercice.listeCorrections[i])}</div>
                    <div class="absolute border-coopmaths-warn-dark top-0 left-0 border-b-4 w-10" />
                    <div
                      class="absolute h-6 w-6 flex flex-row justify-center items-center -left-3 -top-2 rounded-full bg-coopmaths-warn-dark dark:bg-coopmathsdark-warn-dark text-coopmaths-canvas dark:text-coopmathsdark-canvas"
                    >
                      <i class="bx bx-check font-bold" />
                    </div>
                    <div class="absolute border-coopmaths-warn-dark bottom-0 left-0 border-b-4 w-4" />
                  </div>
                {/if}
              </div>
            {/each}
          </ul>
        </div>
      </article>
      {#if isInteractif && !isCorrectionVisible}
        <button type="submit" on:click={verifExercice} bind:this={buttonScore}>Vérifier les réponses</button>
      {/if}
      <div bind:this={divScore} />
    </div>
  </div>
</div>

<style>
  li {
    break-inside: avoid;
  }
</style>
