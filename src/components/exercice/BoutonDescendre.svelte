<script lang="ts">
  import { exercicesParams, moveExercice } from "../store"
  export let indice: number
  export let indiceLastExercice: number
  function descendre() {
    exercicesParams.update((l) => {
      return moveExercice(l, indice, indice + 1)
    })
  }
</script>

<button on:click={descendre} class="{indice < indiceLastExercice - 1 ? '' : 'invisible'}"><i class="bx bx-down-arrow-circle ml-[0.5]" /></button>
