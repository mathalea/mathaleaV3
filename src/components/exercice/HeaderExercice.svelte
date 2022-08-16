<script lang="ts">
    import { createEventDispatcher } from 'svelte' 
    import BoutonMonter from './BoutonMonter.svelte'
    import BoutonDescendre from './BoutonDescendre.svelte'
    import { listeExercices } from "../store"
    export let title: string
    export let interactifReady = true
    export let randomReady = true
    export let settingsReady = true
    export let correctionReady = true
    export let indiceExercice: number
    export let indiceLastExercice: number


    let isInteractif = false
    let isVisible = true
    let isSettingsVisible = false
    let isContentVisible = true
    let isCorrectionVisible = false

    const dispatch = createEventDispatcher()


    function switchInteractif () {
        isInteractif = !isInteractif
        dispatch('clickInteractif', {isInteractif})
    }

    function newData () {
      dispatch('clickNewData')
    }

    function remove() {
    listeExercices.update((l) => [...l.slice(0, indiceExercice), ...l.slice(indiceExercice + 1)])
  }

  async function transitionContenuCorrection() {
    isCorrectionVisible = !isCorrectionVisible
    isContentVisible = !isContentVisible
    if (isCorrectionVisible) isInteractif = false
    dispatch('clickCorrection', {isCorrectionVisible, isContentVisible})

    if (isCorrectionVisible) {
      // window.localStorage.setItem(`${exercice.id}|${exercice.seed}`, "true")
    }
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
  <h1 class="border-b border-gray-300 text-orange-600 pl-4 mt-4 pb-2 flex flex-col lg:flex-row lg:justify-between lg:items-center">
    <div class="flex flex-col lg:flex-row lg:justify-start lg:items-center" id="exercice{indiceExercice}">
      <div class="flex font-bold text-3xl md:text-lg">Exercice&#8239;{indiceExercice + 1}</div>
      <div class="flex font-normal text-lg lg:text-normal"><span class="invisible lg:visible mx-1 font-bold">&middot;</span>{title}</div>
    </div>
    <div class="flex justify-start text-normal mt-1 text-3xl lg:justify-end lg:text-xl">
      <button type="button" on:click={switchInteractif} class="{interactifReady ? '' : 'invisible' }"><i class="bx ml-2 {isInteractif ? 'bxs-mouse' : 'bx-mouse'}" /></button>
      <button type="button" on:click={() => {
        isVisible = !isVisible
        dispatch('clickVisible', {isVisible})
        }}>
        <i class="bx ml-2 {isVisible ? 'bx-hide' : 'bx-show'}" />
      </button>
      <button type="button" on:click={() => {
        isSettingsVisible = !isSettingsVisible
        dispatch('clickSettings', {isSettingsVisible: isSettingsVisible})
        }}
        class="{settingsReady ? '' : 'invisible' }">
        <i class="bx ml-2 {isSettingsVisible ? 'bxs-cog' : 'bx-cog'}" />
      </button>
      <button type="button" on:click={newData}><i class="bx bx-refresh ml-2 {randomReady ? '' : 'invisible'}" /></button>
      <button type="button" on:click={remove}><i class="bx bx-trash ml-2" /></button>
      <BoutonMonter indice={indiceExercice} />
      <BoutonDescendre indice={indiceExercice} {indiceLastExercice} />
      <button class="flew flex-row items-center w-32 {correctionReady ? '' : 'invisible'}" type="button" on:click={transitionContenuCorrection}>
        <i class="bx ml-2 {isContentVisible ? 'bxs-toggle-left' : 'bxs-toggle-right'}"> <span class="font-thin text-sm"> {isCorrectionVisible ? "Consigne" : "Correction"} </span> </i></button
      >
    </div>
  </h1>
  </div>


<style>
</style>
  