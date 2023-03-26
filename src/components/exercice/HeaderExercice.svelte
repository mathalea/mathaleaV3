<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import BoutonMonter from "./BoutonMonter.svelte"
  import BoutonDescendre from "./BoutonDescendre.svelte"
  import { globalOptions } from "../store"
  import { exercicesParams } from "../store"
  export let title: string
  export let randomReady = true
  export let settingsReady = true
  export let correctionReady = true
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isInteractif = false
  export let interactifReady: boolean
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
  
  __Utilisation__ :

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
  <h1
    class="border-b border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-struct dark:text-coopmathsdark-struct pl-0 md:pl-4 mt-4 pb-2 flex flex-col lg:flex-row lg:justify-between lg:items-center"
  >
    <div class="flex flex-col lg:flex-row lg:justify-start lg:items-center" id="exercice{indiceExercice}">
      <div class="flex font-bold text-xl md:text-lg">
        Exercice&#8239;{indiceExercice + 1}
      </div>
      <div class="flex font-normal text-lg lg:text-normal">
        <span class="invisible lg:visible mx-1 font-bold">&middot;</span>{title}
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-start space-x-2 md:space-x-10 text-normal mt-1 text-xl lg:justify-end mr-1">
      <div class="flex flex-row justify-start items-center">
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
          class="mx-2 tooltip tooltip-left tooltip-neutral {correctionReady ? '' : 'invisible'}"
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
          <i
            class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx {isCorrectionVisible
              ? 'bxs-check-circle'
              : 'bx-check-circle'}"
          />
        </button>
        <button
          class="mx-2 tooltip tooltip-left tooltip-neutral {$globalOptions.isInteractiveFree && interactifReady ? '' : 'invisible'}"
          data-tip={isInteractif ? "Désactiver l'interactivité" : "Rendre interactif"}
          type="button"
          on:click={switchInteractif}
        >
          <i
            class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx {isInteractif ? 'bxs-edit' : 'bx-edit'}"
          />
        </button>
        <button class="mx-2 tooltip tooltip-left" data-tip="Nouvel énoncé" type="button" on:click={newData}
          ><i
            class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-refresh {randomReady
              ? ''
              : 'invisible'}"
          /></button
        >
        <button
          class="mx-2 tooltip tooltip-left tooltip-neutral {settingsReady ? '' : 'invisible'} "
          data-tip="Changer les paramètres de l'exercice"
          type="button"
          on:click={() => {
            isSettingsVisible = !isSettingsVisible
            dispatch("clickSettings", { isSettingsVisible: isSettingsVisible })
          }}
        >
          <i
            class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx {isSettingsVisible
              ? 'bxs-cog'
              : 'bx-cog'}"
          />
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
            <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx {isVisible ? 'bx-hide' : 'bx-show'}" />
          </button>
        {/if}
        {#if isDeletable}
          <button class="mx-2 tooltip tooltip-left tooltip-neutral" data-tip="Supprimer l'exercice" type="button" on:click={remove}>
            <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-trash" />
          </button>
        {/if}
      </div>
      <div class="flex flex-row justify-start items-center space-x-4 md:space-x-1">
        {#if isSortable}
          <BoutonMonter indice={indiceExercice} />
          <BoutonDescendre indice={indiceExercice} {indiceLastExercice} />
        {/if}
      </div>
    </div>
  </h1>
</div>

<style>
</style>
