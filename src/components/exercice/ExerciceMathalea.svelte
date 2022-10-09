<script lang="ts">
  import { displayOptions } from '../store'
  import { afterUpdate, onMount, tick } from "svelte"
  import seedrandom from "seedrandom"
  import { prepareExerciceCliqueFigure } from "../../interactif/interactif"
  import { loadMathLive } from "../../modules/loaders"
  import { Mathalea } from "../../Mathalea"
  import { exerciceInteractif } from "../../interactif/interactif"
  import { exercicesParams } from "../store"
  
  import HeaderExercice from "./HeaderExercice.svelte"
  import Settings from "./Settings.svelte"
  import { scratchTraductionFr } from "../../modules/scratchBlocksFr";
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
  let isInteractif = exercice.interactif

  let headerExerciceProps: {title: string, isInteractif: boolean, settingsReady?: boolean,
  isSortable?: boolean, isDeletable ?: boolean, isHidable?: boolean } = {
    title: exercice.titre,
    isInteractif,
  }

  $: {
    if (isContentVisible && isInteractif && buttonScore) initButtonScore()

    if ($displayOptions.v === 'eleve') {
    headerExerciceProps.settingsReady = false
    headerExerciceProps.isSortable = false
    headerExerciceProps.isDeletable = false
    headerExerciceProps.isHidable = false
  } else {
    headerExerciceProps.settingsReady = true
    headerExerciceProps.isSortable = true
    headerExerciceProps.isDeletable = true
    headerExerciceProps.isHidable = true
  }
    headerExerciceProps = headerExerciceProps
  }

  

  onMount(async () => {
    updateDisplay()
  })

  afterUpdate(async () => {
    if (exercice) {
      await tick();
      if (isInteractif) {
        loadMathLive()
        if (exercice.interactifType === "cliqueFigure") {
          prepareExerciceCliqueFigure(exercice);
        }
        // Ne pas être noté sur un exercice dont on a déjà vu la correction
        if (window.localStorage.getItem(`${exercice.id}|${exercice.seed}`) && isContentVisible) {
          newData();
        }
      }
      Mathalea.renderDiv(divExercice);
    }
  });

  async function newData() {
    const seed = Mathalea.generateSeed({
      includeUpperCase: true,
      includeNumbers: true,
      length: 4,
      startsWithLowerCase: false
    })
    exercice.seed = seed;
    if (buttonScore) initButtonScore()
    if (isCorrectionVisible) {
      window.localStorage.setItem(`${exercice.id}|${exercice.seed}`, "true")
    }
    updateDisplay();
  }

  function handleNewSettings(event: CustomEvent) {
    if (event.detail.nbQuestions) {
      exercice.nbQuestions = event.detail.nbQuestions;
      $exercicesParams[indiceExercice].nbQuestions = exercice.nbQuestions;
    }
    if (event.detail.sup !== undefined) {
      exercice.sup = event.detail.sup;
      $exercicesParams[indiceExercice].sup = exercice.sup;
    }
    if (event.detail.sup2 !== undefined) {
      exercice.sup2 = event.detail.sup2;
      $exercicesParams[indiceExercice].sup2 = exercice.sup2;
    }
    if (event.detail.sup3 !== undefined) {
      exercice.sup3 = event.detail.sup3;
      $exercicesParams[indiceExercice].sup3 = exercice.sup3;
    }
    if (event.detail.sup4 !== undefined) {
      exercice.sup4 = event.detail.sup4;
      $exercicesParams[indiceExercice].sup4 = exercice.sup4;
    }
    if (event.detail.alea !== undefined) {
      exercice.seed = event.detail.alea;
      $exercicesParams[indiceExercice].alea = exercice.seed;
    }
    if (event.detail.correctionDetaillee !== undefined) {
      exercice.correctionDetaillee = event.detail.correctionDetaillee;
      $exercicesParams[indiceExercice].cd = exercice.correctionDetaillee ? '1' : '0';
    }
    updateDisplay();
  }

  async function updateDisplay() {
    if (exercice.typeExercice === 'simple') Mathalea.handleExerciceSimple(exercice, isInteractif)
    if (exercice.seed === undefined)
      exercice.seed = Mathalea.generateSeed({
      includeUpperCase: true,
      includeNumbers: true,
      length: 4,
      startsWithLowerCase: false
    })
    seedrandom(exercice.seed, { global: true })
    exercice.interactif = isInteractif
    $exercicesParams[indiceExercice].alea = exercice.seed
    $exercicesParams[indiceExercice].i = isInteractif
    exercice.nouvelleVersion(indiceExercice)
    Mathalea.updateUrl($exercicesParams)
    if (exercice.typeExercice === 'Scratch') {
      await scratchTraductionFr()
      /* global scratchblocks */
      scratchblocks.renderMatching('pre.blocks', {
        style: 'scratch3',
        languages: ['fr']
      })
      scratchblocks.renderMatching('code.b', {
        inline: true,
        style: 'scratch3',
        languages: ['fr']
      })
    }
  }

  function verifExercice() {
    exerciceInteractif(exercice, divScore, buttonScore)
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
      if (isInteractif) {
        isInteractif = !isInteractif
        exercice.interactif = isInteractif
        updateDisplay()
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
    interactifReady={exercice.interactifReady && !isCorrectionVisible}
  />

  {#if isVisible}
    <div class="flex flex-col-reverse lg:flex-row">
      <div class="flex flex-col relative {isSettingsVisible ? 'w-full lg:w-3/4' : 'w-full'} duration-500" id="exercice{indiceExercice}">
        <article class="text-2xl lg:text-base">
          {#if isCorrectionVisible}
          <p class="leading-relaxed mt-2  ml-2 lg:mx-5 text-gray-800">
            {@html exercice.consigne + exercice.introduction}
          </p>
            <div class="bg-gray-200 leading-relaxed mt-2  ml-2 lg:mx-5">
              {@html exercice.consigneCorrection}
            </div>
          <ul class="{(exercice.listeQuestions.length > 1) ? 'list-decimal' : 'list-none'} list-inside mt-2 mx-2 lg:mx-6 marker:text-coopmaths marker:font-bold">
            {#each exercice.listeQuestions as item, i (i)}
            <li style="{(i < exercice.listeQuestions.length) ? `margin-bottom: ${exercice.spacing}` : ''}" id="exercice${indiceExercice}Q${i}">{@html item.replace(/\\dotfill/g, '..............................').replace(/\\not=/g, '≠').replace(/\\ldots/g, '....')}</li>
            <div class="bg-gray-200" style="line-height: {Math.max(3, exercice.spacingCorr * 2)}em;" id="correction${indiceExercice}Q${i}"> {@html exercice.listeCorrections[i].replace(/\\dotfill/g, '..............................').replace(/\\not=/g, '≠').replace(/\\ldots/g, '....')}</div>
            {/each}
          </ul>
          {:else}
          <p class="leading-relaxed mt-2  ml-2 lg:mx-5 text-gray-800">
            {@html exercice.consigne + exercice.introduction}
          </p>
          <ul class="{(exercice.listeQuestions.length > 1) ? 'list-decimal' : 'list-none'} list-inside mt-2 mx-2 lg:mx-6 marker:text-coopmaths marker:font-bold">
            {#each exercice.listeQuestions as item, i (i)}
              <li style="line-height: {Math.max(3, exercice.spacing * 2)}em;" id="exercice${indiceExercice}Q${i}">{@html item.replace(/\\dotfill/g, '..............................').replace(/\\not=/g, '≠').replace(/\\ldots/g, '....')}</li>
            {/each}
          </ul>
            {/if}
        </article>
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
