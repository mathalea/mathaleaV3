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
  import InteractivityIcon from "../icons/TwoStatesIcon.svelte"
  import type { MathfieldElement } from "mathlive"
  export let exercice: TypeExercice
  export let indiceExercice: number
  export let indiceLastExercice: number
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

  if ($globalOptions.recorder !== undefined) {
    headerExerciceProps.randomReady = false
    headerExerciceProps.interactifReady = false
  }

  $: {
    if (isInteractif && buttonScore) initButtonScore()

    if (!$globalOptions.isSolutionAccessible) {
      headerExerciceProps.correctionReady = false
      headerExerciceProps.randomReady = false
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
    setTimeout(() => {
      if ($globalOptions.done === "1") {
        const fields = document.querySelectorAll("math-field")
        fields.forEach((field) => {
          field.setAttribute("disabled", "true")
        })
        const url = new URL(window.location.href)
        const answers = url.searchParams.get("answers")
        const objAnswers = answers ? JSON.parse(answers) : undefined
        $globalOptions.answers = objAnswers
        MathaleaUpdateUrlFromExercicesParams($exercicesParams)
        for (const answer in objAnswers) {
          const field = document.querySelector(`#champTexte${answer}`) as MathfieldElement
          field?.setValue(objAnswers[answer])
        }
        if (buttonScore) {
          buttonScore.click()
        }
      }
    }, 100)
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

  function verifExerciceVueEleve() {
    isCorrectionVisible = true
    resultsByExercice.update((l) => {
      l[exercice.numeroExercice] = {
        uuid: exercice.uuid,
        title: exercice.titre,
        alea: exercice.seed,
        answers: exercice.answers,
        ...exerciceInteractif(exercice, divScore, buttonScore),
      }
      return l
    })
    const url = new URL(window.location.href)
    const iframe = url.searchParams.get("iframe")
    window.parent.postMessage({ resultsByExercice: $resultsByExercice, action: "mathalea:score", iframe }, "*")
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

<div class="z-0 flex-1" bind:this={divExercice}>
  <HeaderExerciceVueEleve {...headerExerciceProps} {indiceExercice} showNumber={indiceLastExercice > 1} />

  <div class="flex flex-col-reverse lg:flex-row">
    <div class="flex flex-col justify-start items-start" id="exercice{indiceExercice}">
      <div class="flex flex-row justify-start items-center mt-2">
        {#if $globalOptions.recorder === undefined}
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
        {/if}
        <button class="mx-2 tooltip tooltip-right" data-tip="Nouvel énoncé" type="button" on:click={newData}>
          <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-xs bx-refresh" />
        </button>
        <button
          class="w-5 tooltip tooltip-right tooltip-neutral {$globalOptions.isInteractiveFree && headerExerciceProps.interactifReady ? '' : 'hidden'}"
          data-tip={isInteractif ? "Désactiver l'interactivité" : "Rendre interactif"}
          type="button"
          on:click={() => {
            isInteractif = !isInteractif
            exercice.interactif = isInteractif
            $exercicesParams[indiceExercice].interactif = isInteractif ? "1" : "0"
            updateDisplay()
          }}
        >
          <InteractivityIcon isOnStateActive={isInteractif} size={4} />
        </button>

        {#if $globalOptions.isSolutionAccessible && !isInteractif}
          <div class="ml-2">
            <ButtonToggle titles={["Masquer la correction", "Voir la correction"]} textSize="xs" buttonSize="xs" bind:value={isCorrectionVisible} on:click={() => adjustMathalea2dFiguresWidth()} />
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
                <li id="exercice{indiceExercice}Q{i}">
                  {@html MathaleaFormatExercice(item)}
                </li>
                {#if isCorrectionVisible}
                  <div
                    class="relative self-start border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus my-2 lg:mb-0 ml-0 lg:ml-0 py-2 pl-4 lg:pl-6"
                    id="correction${indiceExercice}Q${i}"
                  >
                    <div class="container overflow-x-scroll overflow-y-hidden md:overflow-x-auto" style="line-height: {exercice.spacingCorr || 1}; break-inside:avoid">
                      {@html MathaleaFormatExercice(exercice.listeCorrections[i])}
                    </div>
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
      {#if isInteractif && !isCorrectionVisible}
        <button type="submit" on:click={verifExerciceVueEleve} bind:this={buttonScore}>Vérifier {numberOfAnswerFields > 1 ? "les réponses" : "la réponse"}</button>
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
