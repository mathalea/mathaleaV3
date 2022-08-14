<script lang="ts">
  import { closeModal } from "svelte-modals"
  import Contenu from "../exercice/Contenu.svelte"
  import { Mathalea } from "../../Mathalea"
  import { onMount } from "svelte"

  // provided by Modals
  export let isOpen

  export let titre
  export let chapeau
  export let entrees

  let divExercice: HTMLDivElement

  onMount(async () => {
    Mathalea.renderDiv(divExercice)
  })

  let scaleIndex = 3
  let scales = ["scale-100", "scale-110", "scale-125", "scale-150", "scale-[1.75]", "scale-[2]", "scale-[2.25]", "scale-[2.5]", "scale-[2.75]", "scale-[3]"]
  // let scales = Array.from(Array(26), (e, i) => ["scale-[", 1 + i / 10, "]"].join(""))

  function upScale() {
    if (scaleIndex < scales.length - 1) {
      scaleIndex++
    }
  }
  function downScale() {
    if (scaleIndex > 0) {
      scaleIndex--
    }
  }
</script>

{#if isOpen}
  <div role="dialog" class="flex justify-center items-center inset-0 pointer-events-none fixed {scales[scaleIndex]}">
    <div bind:this={divExercice} class="bg-white flex flex-col justify-between rounded-sm min-w-60 pointer-events-auto">
      <!-- <h2>{titre}</h2> -->
      <div class="container flex flex-wrap px-4 py-2 mx-auto bg-coopmaths justify-between items-center text-white font-semibold">
        {titre}
        <div class="flex flex-row justify-end text-lg font-thin">
          <button on:click={upScale}><i class="bx bx-plus-circle" /></button>
          <button class="ml-2" on:click={downScale}><i class="bx bx-minus-circle" /></button>
          <button class="ml-6" on:click={closeModal}><i class="bx bx-x" /></button>
        </div>
      </div>
      <div class="py-3 pr-3">
        <Contenu {chapeau} {entrees} />
      </div>
    </div>
  </div>
{/if}

<style>
</style>
