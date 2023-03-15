<script lang="ts">
  import { globalOptions, resultsByExercice } from "../store"
  import { afterUpdate, onMount, tick } from "svelte"
  import seedrandom from "seedrandom"
  import { prepareExerciceCliqueFigure, exerciceInteractif } from "../../lib/interactif/interactif"
  import { loadMathLive } from "../../modules/loaders"
  import { Mathalea } from "../../lib/Mathalea"
  import { exercicesParams } from "../store"
  import HeaderExerciceVueEleve from "./HeaderExerciceVueEleve.svelte"
  export let exercice
  export let indiceExercice
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
      Mathalea.renderDiv(divExercice)
    }
  })

  async function newData() {
    if (isCorrectionVisible && isInteractif) isCorrectionVisible = false
    const seed = Mathalea.generateSeed({
      includeUpperCase: true,
      includeNumbers: true,
      length: 4,
      startsWithLowerCase: false,
    })
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
    if (exercice.seed === undefined)
      exercice.seed = Mathalea.generateSeed({
        includeUpperCase: true,
        includeNumbers: true,
        length: 4,
        startsWithLowerCase: false,
      })
    seedrandom(exercice.seed, { global: true })
    if (exercice.typeExercice === "simple") Mathalea.handleExerciceSimple(exercice, isInteractif)
    exercice.interactif = isInteractif
    $exercicesParams[indiceExercice].alea = exercice.seed
    $exercicesParams[indiceExercice].i = isInteractif
    $exercicesParams[indiceExercice].cols = columnsCount > 1 ? columnsCount : undefined
    exercice.numeroExercice = indiceExercice
    exercice.nouvelleVersion(indiceExercice)
    Mathalea.updateUrl($exercicesParams)
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
      <div class="hidden md:flex flex-row justify-end items-center text-coopmaths-struct dark:text-coopmathsdark-struct text-xs mt-2">
        {#if columnsCount > 1}
          <button
            type="button"
            on:click={() => {
              columnsCount--
              updateDisplay()
            }}
          >
            <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 bx-xs bx-minus" />
          </button>
        {/if}
        <i class="bx ml-1 bx-xs bx-columns" />
        <button
          type="button"
          on:click={() => {
            columnsCount++
            updateDisplay()
          }}
        >
          <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest  bx ml-1 bx-xs bx-plus" />
        </button>
      </div>
      <article class="text-base mt-4 md:mt-0" style="font-size: {($globalOptions.z || 1).toString()}rem">
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
            <div class="bg-coopmaths-warn-lightest dark:bg-coopmathsdark-warn-lightest text-coopmaths-corpus dark:text-coopmathsdark-corpus leading-relaxed mt-2  ml-2 lg:mx-5">
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
              <div style="break-inside:avoid" class="container grid grid-cols-1 lg:grid-cols-2 auto-cols-min gap-4 lg:gap-10 mb-2 lg:mb-4">
                <li style={i < exercice.listeQuestions.length ? `margin-bottom: ${exercice.spacing}em; line-height: 1` : ""} id="exercice{indiceExercice}Q{i}">
                  {@html Mathalea.formatExercice(item)}
                </li>
                {#if isCorrectionVisible}
                  <div
                    class="relative border-l-coopmaths-warn-lightest dark:border-l-coopmathsdark-warn-lightest border-l-8 text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest mb-2 lg:mb-0 ml-4 lg:ml-0 py-2 pl-6"
                    style="margin-top: ${exercice.spacing}em; margin-bottom: ${exercice.spacing}em; line-height: {exercice.spacingCorr || 1}; break-inside:avoid"
                    id="correction${indiceExercice}Q${i}"
                  >
                    {@html Mathalea.formatExercice(exercice.listeCorrections[i])}
                    <div
                      class="absolute flex flex-row justify-center items-center -left-4 top-0 rounded-full bg-coopmaths-warn-lightest dark:bg-coopmathsdark-warn-lightest text-coopmaths-canvas dark:text-coopmathsdark-canvas h-6 w-6"
                    >
                      <i class="bx bx-sm bx-check" />
                    </div>
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
