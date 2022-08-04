<script lang="ts">
  import { afterUpdate, onMount, tick } from "svelte"
  import { listeExercices } from "../store"
  import seedrandom from "seedrandom"
  import BoutonMonter from "./BoutonMonter.svelte"
  import BoutonDescendre from "./BoutonDescendre.svelte"
  import { Mathalea } from "../../Mathalea"
  import Settings from "./Settings.svelte"
  import { randomInt } from "mathjs"
  import Contenu from "./Contenu.svelte"
  import { loadMathLive } from "../../modules/loaders"
  import { exerciceInteractif, prepareExerciceCliqueFigure } from "../../interactif/interactif"

  export let directory: string
  export let id: string
  export let nbQuestions = undefined
  export let sup = undefined
  export let sup2 = undefined
  export let sup3 = undefined
  export let sup4 = undefined
  export let indiceExercice: number
  export let indiceLastExercice: number

  let exercice
  let divExercice: HTMLDivElement
  let divScore: HTMLDivElement
  let buttonScore: HTMLButtonElement
  let isVisible = true
  let isContenuVisible = true
  let isCorrectionVisible = false
  let isParametresVisible = false
  let isInteractif = false
  let titre: string
  let consigne: string
  let consigneCorrection: string
  let listeQuestions: string[] = []
  let listeCorrections: string[] = []
  let spacing: number
  let spacingCorr: number

  // transitions options
  // let transitionOptions = { duration: 300, easing: linear }

  afterUpdate(async () => {
    if (isInteractif) {
      loadMathLive()
      // Evènement indispensable pour pointCliquable par exemple
      const exercicesAffiches = new window.Event("exercicesAffiches", { bubbles: true })
      document.dispatchEvent(exercicesAffiches)
      if (exercice.interactifType === "cliqueFigure") {
        prepareExerciceCliqueFigure(exercice)
      }
      // Ne pas être noté sur un exercice dont on a déjà vu la correction
      if (window.localStorage.getItem(`${exercice.id}|${exercice.seed}`)) {
        newData()
      }
    }
    if (exercice) {
      await tick()
      Mathalea.renderDiv(divExercice)
    }
  })

  function handleNewSettings(event: CustomEvent) {
    if (event.detail.nbQuestions) {
      nbQuestions = event.detail.nbQuestions
      exercice.nbQuestions = nbQuestions
      $listeExercices[indiceExercice].nbQuestions = nbQuestions
    }
    if (event.detail.sup) {
      sup = event.detail.sup
      exercice.sup = sup
      $listeExercices[indiceExercice].sup = sup
    }
    if (event.detail.sup2) {
      sup2 = event.detail.sup2
      exercice.sup2 = sup2
      $listeExercices[indiceExercice].sup2 = sup2
    }
    if (event.detail.sup3) {
      sup3 = event.detail.sup3
      exercice.sup3 = sup3
      $listeExercices[indiceExercice].sup3 = sup3
    }
    if (event.detail.sup4) {
      sup4 = event.detail.sup4
      exercice.sup4 = sup4
      $listeExercices[indiceExercice].sup4 = sup4
    }
    updateDisplay()
    Mathalea.updateUrl($listeExercices)
  }

  async function transitionContenuCorrection() {
    isCorrectionVisible = !isCorrectionVisible
    isContenuVisible = !isContenuVisible

    if (isCorrectionVisible) {
      window.localStorage.setItem(`${exercice.id}|${exercice.seed}`, "true")
    }
  }

  async function newData() {
    const seed = (Math.random() * 1000).toString()
    exercice.seed = seed
    updateDisplay()
  }

  function toggle(flag: boolean) {
    flag !== flag
  }

  function remove() {
    listeExercices.update((l) => [...l.slice(0, indiceExercice), ...l.slice(indiceExercice + 1)])
  }

  function updateDisplay() {
    if (exercice.seed === undefined) exercice.seed = randomInt(1, 9999).toString()
    seedrandom(exercice.seed, { global: true })
    exercice.interactif = isInteractif
    exercice.nouvelleVersion()
    titre = exercice.titre
    listeQuestions = [...exercice.listeQuestions]
    listeCorrections = [...exercice.listeCorrections]
    consigne = exercice.consigne + exercice.introduction
    consigneCorrection = exercice.consigneCorrection
    spacing = exercice.spacing
    spacingCorr = exercice.spacingCorr
  }

  onMount(async () => {
    exercice = await Mathalea.load(directory, id)
    // Nombre de questions transmis par App.svelte
    if (nbQuestions) exercice.nbQuestions = nbQuestions
    if (sup) exercice.sup = sup
    if (sup2) exercice.sup2 = sup2
    if (sup3) exercice.sup3 = sup3
    if (sup4) exercice.sup4 = sup4
    exercice.numeroExercice = indiceExercice
    updateDisplay()
  })

  function switchInteractif() {
    isInteractif = !isInteractif
    exercice.interactif = isInteractif
    updateDisplay()
  }

  function verifExercice() {
    exerciceInteractif(exercice, divScore, buttonScore)
  }
</script>

<div class="z-0 flex-1 overflow-hidden" bind:this={divExercice}>
  <h1 class="border-b border-gray-300 text-orange-600 pl-4 mt-4 pb-2 flex flex-col lg:flex-row lg:justify-between lg:items-center">
    <div class="flex flex-col lg:flex-row lg:justify-start lg:items-center" id="exercice{indiceExercice}">
      <div class="flex font-bold text-3xl md:text-lg">Exercice&#8239;{indiceExercice + 1}</div>
      <div class="flex font-normal text-lg lg:text-normal"><span class="invisible lg:visible mx-1 font-bold">&middot;</span>{titre}</div>
    </div>
    <div class="flex justify-start text-normal mt-1 text-3xl lg:justify-end lg:text-xl">
      <button type="button" on:click={switchInteractif}><i class="bx ml-2 {isInteractif ? 'bxs-mouse' : 'bx-mouse'} {!exercice?.interactifReady ? 'invisible' : ''}" /></button>
      <button type="button" on:click={() => (isVisible = !isVisible)}>
        <i class="bx ml-2 {isVisible ? 'bx-hide' : 'bx-show'}" />
      </button>
      <button type="button" on:click={() => (isParametresVisible = !isParametresVisible)}>
        <i class="bx ml-2 {isParametresVisible ? 'bxs-cog' : 'bx-cog'}" />
      </button>
      <button type="button" on:click={newData}><i class="bx bx-refresh ml-2 {exercice?.typeExercice === 'statique' ? 'invisible' : ''}" /></button>
      <button type="button" on:click={remove}><i class="bx bx-trash ml-2" /></button>
      <BoutonMonter indice={indiceExercice} />
      <BoutonDescendre indice={indiceExercice} {indiceLastExercice} />
      <button class="flew flex-row items-center w-32" type="button" on:click={transitionContenuCorrection}>
        <i class="bx ml-2 {isContenuVisible ? 'bxs-toggle-left' : 'bxs-toggle-right'}"> <span class="font-thin text-sm"> {isCorrectionVisible ? "Correction" : "Consigne"} </span> </i></button
      >
    </div>
  </h1>

  {#if isVisible}
    <div class="flex flex-col-reverse lg:flex-row">
      <div class="flex flex-col relative {isParametresVisible ? 'w-full lg:w-3/4' : 'w-full'} duration-500" id="exercice{indiceExercice}">
        {#if isContenuVisible}
          <Contenu chapeau={consigne} entrees={listeQuestions} {spacing} {indiceExercice} type={"enonce"} />
        {:else}
          <Contenu chapeau={consigneCorrection} entrees={listeCorrections} spacing={spacingCorr} {indiceExercice} type={"correction"} />
        {/if}
        {#if isInteractif && !isCorrectionVisible && isContenuVisible}
          <button
            class="inline-block px-6 py-2.5 mr-10 my-5 ml-6 bg-coopmaths text-white font-medium text-xs leading-tight uppercase rounded shadow-md transform hover:scale-110 hover:bg-coopmaths-dark hover:shadow-lg focus:bg-coopmaths-dark focus:shadow-lg focus:outline-none focus:ring-0 active:bg-coopmaths-dark active:shadow-lg transition duration-150 ease-in-out checkReponses"
            type="submit"
            on:click={verifExercice}
            bind:this={buttonScore}
            >Vérifier les réponses
          </button>
          <div bind:this={divScore} />
        {/if}
      </div>
      <div class="bg-gray-100 {isParametresVisible ? 'visible lg:w-1/4' : 'hidden lg:w-0'} flex flex-col duration-500">
        {#if isParametresVisible}
          <Settings {exercice} on:settings={handleNewSettings} />
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
</style>
