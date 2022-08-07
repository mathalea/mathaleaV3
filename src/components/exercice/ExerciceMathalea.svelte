<script lang="ts">
  import { afterUpdate, onMount, tick } from "svelte"
  import { randomInt } from "mathjs"
  import seedrandom from "seedrandom"
  import { prepareExerciceCliqueFigure } from "../../interactif/interactif"
  import { loadMathLive } from "../../modules/loaders"
  import { Mathalea } from "../../Mathalea"
  import { exerciceInteractif } from "../../interactif/interactif"
  import { listeExercices } from "../store"

  import Contenu from "./Contenu.svelte"
  import HeaderExercice from "./HeaderExercice.svelte"
  import Settings from "./Settings.svelte"
  export let exercice
  export let indiceExercice
  export let indiceLastExercice

  let divExercice: HTMLDivElement
  let divScore: HTMLDivElement
  let buttonScore: HTMLButtonElement
  let isVisible = true
  let isContentVisible = true
  let isCorrectionVisible = false
  let isSettingsVisible = false
  let isInteractif = false
  let consigne: string
  let consigneCorrection: string
  let listQuestions: string[] = []
  let listCorrections: string[] = []
  let spacing: number
  let spacingCorr: number

  $: {
    if (isContentVisible && isInteractif && buttonScore) initButtonScore()
  }

  const headerExerciceProps = {
    title: exercice.titre,
  }

  onMount(async () => {
    updateDisplay()
  })

  afterUpdate(async () => {
    if (isInteractif) {
      loadMathLive()
      // Evènement indispensable pour pointCliquable par exemple
      const exercicesAffiches = new window.Event("exercicesAffiches", {
        bubbles: true,
      });
      document.dispatchEvent(exercicesAffiches);
      if (exercice.interactifType === "cliqueFigure") {
        prepareExerciceCliqueFigure(exercice);
      }
      // Ne pas être noté sur un exercice dont on a déjà vu la correction
      if (window.localStorage.getItem(`${exercice.id}|${exercice.seed}`) && isContentVisible) {
        newData();
      }
    }
    if (exercice) {
      await tick();
      Mathalea.renderDiv(divExercice);
    }
  });

  async function newData() {
    const seed = (Math.random() * 1000).toString();
    exercice.seed = seed;
    updateDisplay();
  }

  function handleNewSettings(event: CustomEvent) {
    if (event.detail.nbQuestions) {
      exercice.nbQuestions = event.detail.nbQuestions;
      $listeExercices[indiceExercice].nbQuestions = exercice.nbQuestions;
    }
    if (event.detail.sup) {
      exercice.sup = event.detail.sup;
      $listeExercices[indiceExercice].sup = exercice.sup;
    }
    if (event.detail.sup2) {
      exercice.sup2 = event.detail.sup2;
      $listeExercices[indiceExercice].sup2 = exercice.sup2;
    }
    if (event.detail.sup3) {
      exercice.sup3 = event.detail.sup3;
      $listeExercices[indiceExercice].sup3 = exercice.sup3;
    }
    if (event.detail.sup4) {
      exercice.sup4 = event.detail.sup4;
      $listeExercices[indiceExercice].sup4 = exercice.sup4;
    }
    updateDisplay();
    Mathalea.updateUrl($listeExercices);
  }

  function updateDisplay() {
    if (exercice.seed === undefined)
      exercice.seed = randomInt(1, 9999).toString();
    seedrandom(exercice.seed, { global: true });
    exercice.interactif = isInteractif;
    exercice.nouvelleVersion();
    listQuestions = [...exercice.listeQuestions];
    listCorrections = [...exercice.listeCorrections];
    consigne = exercice.consigne + exercice.introduction;
    consigneCorrection = exercice.consigneCorrection;
    spacing = exercice.spacing;
    spacingCorr = exercice.spacingCorr;
  }

  function verifExercice() {
    exerciceInteractif(exercice, divScore, buttonScore);
  }

  function initButtonScore() {
    buttonScore.classList.remove(...buttonScore.classList)
    buttonScore.classList.add('inline-block',
      'px-6', 'py-2.5','mr-10','my-5','ml-6','bg-coopmaths','text-white','font-medium','text-xs','leading-tight','uppercase', 'rounded', 'shadow-md',
      'transform', 'hover:scale-110', 'hover:bg-coopmaths-dark', 'hover:shadow-lg', 'focus:bg-coopmaths-dark', 'focus:shadow-lg', 'focus:outline-none', 'focus:ring-0', 'active:bg-coopmaths-dark', 'active:shadow-lg', 'transition', 'duration-150', 'ease-in-out', 'checkReponses')
    if (divScore) divScore.innerHTML = ''
  }
</script>

<div class="z-0 flex-1 overflow-hidden" bind:this={divExercice}>
  <HeaderExercice 
    on:clickVisible = {(event) => {
      isVisible = event.detail.isVisible 
    }}
    on:clickSettings = {(event) => isSettingsVisible = event.detail.isSettingsVisible }
    on:clickCorrection = {(event) => {isContentVisible = event.detail.isContentVisible
      isCorrectionVisible = event.detail.isCorrectionVisible
      if (isCorrectionVisible) {
        window.localStorage.setItem(`${exercice.id}|${exercice.seed}`, "true")
      }
    }}
    on:clickInteractif = {(event) => {
      isInteractif = event.detail.isInteractif
      exercice.interactif = isInteractif
      updateDisplay()
    } }
    on:clickNewData = { newData }
    {...headerExerciceProps}
    {indiceExercice}
    {indiceLastExercice}
  />

  {#if isVisible}
    <div class="flex flex-col-reverse lg:flex-row">
      <div
        class="flex flex-col relative {isSettingsVisible
          ? 'w-full lg:w-3/4'
          : 'w-full'} duration-500"
        id="exercice{indiceExercice}"
      >
        {#if isContentVisible}
          <Contenu
            chapeau={consigne}
            entrees={listQuestions}
            {spacing}
            {indiceExercice}
            type={"enonce"}
          />
        {:else}
          <Contenu
            chapeau={consigneCorrection}
            entrees={listCorrections}
            spacing={spacingCorr}
            {indiceExercice}
            type={"correction"}
          />
        {/if}
        {#if isInteractif && !isCorrectionVisible && isContentVisible}
          <button
            type="submit"
            on:click={verifExercice}
            bind:this={buttonScore}
            >Vérifier les réponses
          </button>
          <div bind:this={divScore} />
        {/if}
      </div>
      <div
        class="bg-gray-100 {isSettingsVisible
          ? 'visible lg:w-1/4'
          : 'hidden lg:w-0'} flex flex-col duration-500"
      >
        {#if isSettingsVisible}
          <Settings {exercice} on:settings={handleNewSettings} />
        {/if}
      </div>
    </div>
  {/if}
</div>
