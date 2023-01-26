<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import BoutonMonter from "./BoutonMonter.svelte"
  import BoutonDescendre from "./BoutonDescendre.svelte"
  import { exercicesParams } from "../store"
  export let title: string
  export let interactifReady = true
  export let randomReady = true
  export let settingsReady = true
  export let correctionReady = true
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isInteractif = false
  export let isSortable = true
  export let isDeletable = true
  export let isHidable = true
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

  function remove() {
    exercicesParams.update((l) => [...l.slice(0, indiceExercice), ...l.slice(indiceExercice + 1)])
  }
</script>

<!-- 
  @component
  Barre de titre et d'actions au-dessus d'un exercice
  
  Utilisation :
    ```tsx
  const headerExerciceProps = {
    title: exercice.titre,
    indiceExercice: 2,
    indiceLastExercice: 4,
    interactifReady: true,
    randomReady: true,
    settingsReady: true,
    correctionReady: true
  }
  <HeaderExercice {...headerExerciceProps}/>
  ```
 -->

<div class="z-0 flex-1 overflow-hidden">
  <h1 class="border-b border-coopmaths-titleexercise text-coopmaths-titleexercise pl-4 mt-4 pb-2 flex flex-col lg:flex-row lg:justify-between lg:items-center">
    <div class="flex flex-col lg:flex-row lg:justify-start lg:items-center" id="exercice{indiceExercice}">
      <div class="flex font-bold text-3xl md:text-lg">
        Exercice&#8239;{indiceExercice + 1}
      </div>
      <div class="flex font-normal text-lg lg:text-normal">
        <span class="invisible lg:visible mx-1 font-bold">&middot;</span>{title}
      </div>
    </div>
    <div class="flex justify-start text-normal mt-1 text-3xl lg:justify-end lg:text-xl mr-1">
      <!-- <button
        class="mx-2 tooltip tooltip-left"
        data-tip={isMessagesVisible ? "Masquer les messages" : "Montrer les messages"}
        type="button"
        on:click={() => {
          isMessagesVisible = !isMessagesVisible
          dispatch("clickMessages", { isMessagesVisible })
        }}
      >
        <i class="bx {isMessagesVisible ? 'bxs-bulb' : 'bx-bulb'}" />
      </button> -->
      <button
        class="mx-2 tooltip tooltip-left {correctionReady ? '' : 'invisible'}"
        data-tip={isCorrectionVisible ? "Masquer la correction" : "Montrer la correction"}
        type="button"
        on:click={() => {
          isCorrectionVisible = !isCorrectionVisible
          dispatch("clickCorrection", {
            isCorrectionVisible,
            isContentVisible,
          })
        }}
      >
        <i class="bx {isCorrectionVisible ? 'bxs-check-circle' : 'bx-check-circle'}" />
      </button>
      <button
        class="mx-2 tooltip tooltip-left {interactifReady ? '' : 'invisible'}"
        data-tip={isInteractif ? "Désactiver l'interactivité" : "Rendre interactif"}
        type="button"
        on:click={switchInteractif}
      >
        <i class="bx {isInteractif ? 'bxs-edit' : 'bx-edit'}" />
      </button>
      <button class="mx-2 tooltip tooltip-left" data-tip="Nouvel énoncé" type="button" on:click={newData}><i class="bx bx-refresh {randomReady ? '' : 'invisible'}" /></button>
      <button
        class="mx-2 tooltip tooltip-left {settingsReady ? '' : 'invisible'} "
        data-tip="Changer les paramètres de l'exercice"
        type="button"
        on:click={() => {
          isSettingsVisible = !isSettingsVisible
          dispatch("clickSettings", { isSettingsVisible: isSettingsVisible })
        }}
      >
        <i class="bx {isSettingsVisible ? 'bxs-cog' : 'bx-cog'}" />
      </button>
      {#if isHidable}
        <button
          type="button"
          on:click={() => {
            isVisible = !isVisible
            dispatch("clickVisible", { isVisible })
          }}
          class="mx-2 tooltip tooltip-left"
          data-tip=" {isVisible ? 'Masquer' : 'Montrer'} l'exercice"
        >
          <i class="bx {isVisible ? 'bx-hide' : 'bx-show'}" />
        </button>
      {/if}
      {#if isDeletable}
        <button class="mx-2 tooltip tooltip-left" data-tip="Supprimer l'exercice" type="button" on:click={remove}><i class="bx bx-trash" /></button>
      {/if}
      {#if isSortable}
        <BoutonMonter indice={indiceExercice} />
        <BoutonDescendre indice={indiceExercice} {indiceLastExercice} />
      {/if}
    </div>
  </h1>
</div>

<style>
</style>
