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
  <h1
    class="border-b border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-struct dark:text-coopmathsdark-struct pl-4 mt-4 pb-2 flex flex-col lg:flex-row lg:justify-between lg:items-center"
  >
    <div class="flex flex-col lg:flex-row lg:justify-start lg:items-center" id="exercice{indiceExercice}">
      <div class="hidden md:flex font-bold md:text-2xl lg:text-lg">
        Exercice&#8239;{indiceExercice + 1}
      </div>
      <div class="flex font-bold md:font-normal text-lg lg:text-normal md:ml-2">
        <span class="hidden lg:block mx-1 font-bold">&middot;</span>{title}
      </div>
    </div>
    <div class="flex justify-start text-normal mt-1 text-3xl lg:justify-end lg:text-xl mr-1">
      <button
        class="mx-2 tooltip tooltip-left tooltip-neutral {$globalOptions.isInteractiveFree && interactifReady ? '' : 'hidden'}"
        data-tip={isInteractif ? "Désactiver l'interactivité" : "Rendre interactif"}
        type="button"
        on:click={switchInteractif}
      >
        <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx {isInteractif ? 'bxs-edit' : 'bx-edit'}" />
      </button>
      <button class="mx-2 tooltip tooltip-left" data-tip="Nouvel énoncé" type="button" on:click={newData}>
        <i
          class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-refresh {randomReady ? '' : 'hidden'}"
        />
      </button>
    </div>
  </h1>
</div>

<style>
</style>
