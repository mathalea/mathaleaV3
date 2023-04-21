<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import BoutonMonter from "./BoutonMonter.svelte"
  import BoutonDescendre from "./BoutonDescendre.svelte"
  import InteractivityIcon from "../icons/TwoStatesIcon.svelte"
  import { globalOptions } from "../store"
  import { exercicesParams, isMenuNeededForExercises } from "../store"
  export let title: string
  // export let randomReady = true
  export let indiceExercice: number
  // export let isInteractif = false
  // export let interactifReady: boolean
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
  <h1 class=" text-coopmaths-struct dark:text-coopmathsdark-struct mt-8 pb-2 flex {$isMenuNeededForExercises ? 'flex-col items-start' : 'flex-row items-center'}">
    <!-- titre -->
    <div class="flex flex-row justify-start items-start" id="exerciceHeader{indiceExercice}">
      <div class={showNumber && $globalOptions.presMode === "liste_exos" ? "flex" : "hidden"}>
        <div
          class="{$isMenuNeededForExercises && $globalOptions.presMode !== 'liste_exos'
            ? 'hidden'
            : 'inline-flex'} items-center justify-center h-6 w-6 bg-coopmaths-struct text-coopmaths-canvas font-light text-lg lg:text-normal translate-y-1"
        >
          {indiceExercice + 1}
        </div>
      </div>
      <div class="font-light {$isMenuNeededForExercises && $globalOptions.presMode !== 'liste_exos' ? 'text-xl' : 'text-lg'} ml-2">
        {title}
      </div>
    </div>
  </h1>
</div>

<style>
</style>
