<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import BoutonMonter from "./BoutonMonter.svelte"
  import BoutonDescendre from "./BoutonDescendre.svelte"
  import { globalOptions } from "../store"
  import { exercicesParams } from "../store"
  export let title: string
  export let randomReady = true
  export let indiceExercice: number
  export let isInteractif = false
  export let interactifReady: boolean
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

<div class="z-0 flex-1 overflow-hidden">
  <h1 class=" text-coopmaths-struct dark:text-coopmathsdark-struct  mt-4 pb-2 flex flex-col md:flex-row items-center">
    <!-- titre -->
    <div class="flex flex-row justify-start items-center" id="exerciceHeader{indiceExercice}">
      <div class="hidden md:inline-flex items-center justify-center h-6 w-6 bg-coopmaths-struct text-coopmaths-canvas font-light text-lg lg:text-normal">
        {indiceExercice + 1}
      </div>
      <div class="font-light text-3xl lg:text-xl ml-2">
        {title}
      </div>
    </div>
    <!-- boutons contrôle -->
    <div class="flex justify-start md:text-xl mt-1 text-3xl mr-1">
      <button
        class="mx-2 tooltip tooltip-right tooltip-neutral {$globalOptions.isInteractiveFree && interactifReady ? '' : 'hidden'}"
        data-tip={isInteractif ? "Désactiver l'interactivité" : "Rendre interactif"}
        type="button"
        on:click={switchInteractif}
      >
        <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx {isInteractif ? 'bxs-edit' : 'bx-edit'}" />
      </button>
      <button class="mx-2 tooltip tooltip-right" data-tip="Nouvel énoncé" type="button" on:click={newData}>
        <i
          class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-refresh {randomReady ? '' : 'hidden'}"
        />
      </button>
    </div>
  </h1>
</div>

<style>
</style>
