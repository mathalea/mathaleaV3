<script lang="ts">
  import { globalOptions, resultsByExercice } from "../store"
  import { afterUpdate, onMount, tick } from "svelte"
  import seedrandom from "seedrandom"
  import { prepareExerciceCliqueFigure } from "../../lib/interactif/interactif"
  import { loadMathLive } from "../../modules/loaders"
  import { Mathalea } from "../../lib/Mathalea"
  import { exerciceInteractif } from "../../lib/interactif/interactif"
  import { exercicesParams } from "../store"
  import HeaderExercice from "./HeaderExercice.svelte"
  import Settings from "./Settings.svelte"
  export let exercice
  export let indiceExercice
  export let indiceLastExercice
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
        if (window.localStorage.getItem(`${exercice.id}|${exercice.seed}`) && isContentVisible) {
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
      $exercicesParams[indiceExercice].sup = exercice.sup
    }
    if (event.detail.sup2 !== undefined) {
      exercice.sup2 = event.detail.sup2
      $exercicesParams[indiceExercice].sup2 = exercice.sup2
    }
    if (event.detail.sup3 !== undefined) {
      exercice.sup3 = event.detail.sup3
      $exercicesParams[indiceExercice].sup3 = exercice.sup3
    }
    if (event.detail.sup4 !== undefined) {
      exercice.sup4 = event.detail.sup4
      $exercicesParams[indiceExercice].sup4 = exercice.sup4
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
    $exercicesParams[indiceExercice].interactif = isInteractif ? "1" : "0"
    $exercicesParams[indiceExercice].cols = columnsCount > 1 ? columnsCount : undefined
    exercice.numeroExercice = indiceExercice
    exercice.nouvelleVersion(indiceExercice)
    Mathalea.updateUrl($exercicesParams)
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
        <div class="text-right text-coopmaths-struct dark:text-coopmathsdark-struct text-xs mt-2">
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
        <article class="lg:text-base" style="font-size: {($globalOptions.z || 1).toString()}rem">
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
          <div style="columns: {columnsCount.toString()}" class="mb-5">
            <ul
              class="{exercice.listeQuestions.length > 1
                ? 'list-decimal'
                : 'list-none'} list-inside my-2 mx-2 lg:mx-6 marker:text-coopmaths-struct dark:marker:text-coopmathsdark-struct marker:font-bold"
            >
              {#each exercice.listeQuestions as item, i (i)}
                <div style="break-inside:avoid">
                  <li style={i < exercice.listeQuestions.length ? `margin-bottom: ${exercice.spacing}em; line-height: 1` : ""} id="exercice{indiceExercice}Q{i}">
                    {@html Mathalea.formatExercice(item)}
                  </li>
                  {#if isCorrectionVisible}
                    <div
                      class="relative border-l-coopmaths-warn-dark dark:border-l-coopmathsdark-warn-dark border-l-4 text-coopmaths-corpus dark:text-coopmathsdark-corpus mt-2 mb-6 py-2 pl-4"
                      style="margin-top: ${exercice.spacing}em; margin-bottom: ${exercice.spacing}em; line-height: {exercice.spacingCorr || 1}; break-inside:avoid"
                      id="correction${indiceExercice}Q${i}"
                    >
                      {@html Mathalea.formatExercice(exercice.listeCorrections[i])}
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
        {#if isInteractif && !isCorrectionVisible && isContentVisible}
          <button type="submit" on:click={verifExercice} bind:this={buttonScore}>Vérifier les réponses </button>
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
