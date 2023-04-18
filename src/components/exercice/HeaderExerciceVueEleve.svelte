<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import BoutonMonter from "./BoutonMonter.svelte"
  import BoutonDescendre from "./BoutonDescendre.svelte"
  import InteractivityIcon from "../icons/TwoStatesIcon.svelte"
  import { globalOptions } from "../store"
  import { exercicesParams, isMenuNeededForExercises } from "../store"
  export let title: string
  export let randomReady = true
  export let indiceExercice: number
  export let isInteractif = false
  export let interactifReady: boolean
  export let showNumber = true
  let isVisible = true
  let isSettingsVisible = false
  let isContentVisible = true
  let isCorrectionVisible = false
  let isMessagesVisible = true

  const dispatch = createEventDispatcher()

  function switchInteractif() {
    isInteractif = !isInteractif
    dispatch("clickInteractif", { isInteractif })
  }

  function newData() {
    dispatch("clickNewData")
  }
</script>

<!-- 
  @component
  Barre de titre et d'actions au-dessus d'un exercice

  __Utilisation__ :

  ```tsx
  const headerExerciceProps = {
    title: exercice.titre,
    indiceExercice: 2,
    interactifReady: true,
    randomReady: true
  }
  <HeaderExerciceVueEleve {...headerExerciceProps}/>
  ```
 -->

<div class="z-0 flex-1">
  <h1 class=" text-coopmaths-struct dark:text-coopmathsdark-struct mt-8 pb-2 flex {$isMenuNeededForExercises ? 'flex-col items-center' : 'flex-row items-center'}">
    <!-- titre -->
    <div class="flex flex-row justify-start items-center" id="exerciceHeader{indiceExercice}">
      {#if showNumber}
      <div class="{$isMenuNeededForExercises ? 'hidden' : 'inline-flex'} items-center justify-center h-6 w-6 bg-coopmaths-struct text-coopmaths-canvas font-light text-lg lg:text-normal">
        {indiceExercice + 1}
      </div>
      {/if}
      <div class="font-light {$isMenuNeededForExercises ? 'text-3xl' : 'text-2xl'} ml-2">
        {title}
      </div>
    </div>
    <!-- boutons contrôle -->
    <div class="flex justify-start items-start lg:items-center {$isMenuNeededForExercises ? 'text-3xl mt-4' : 'text-2xl ml-10 mt-2'}">
      <button class="mx-2 tooltip tooltip-right" data-tip="Nouvel énoncé" type="button" on:click={newData}>
        <i
          class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-refresh {randomReady ? '' : 'hidden'}"
        />
      </button>
      <button
        class="mx-2 tooltip tooltip-right tooltip-neutral {$globalOptions.isInteractiveFree && interactifReady ? '' : 'hidden'}"
        data-tip={isInteractif ? "Désactiver l'interactivité" : "Rendre interactif"}
        type="button"
        on:click={switchInteractif}
      >
        <!-- <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx {isInteractif ? 'bxs-edit' : 'bx-edit'}" /> -->
        <InteractivityIcon isOnStateActive={isInteractif} />
      </button>
    </div>
  </h1>
</div>

<style>
</style>
