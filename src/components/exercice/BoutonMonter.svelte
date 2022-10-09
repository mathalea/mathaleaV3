<script lang="ts">
  import { exercicesParams, moveExercice } from "../store"
  export let indice: number
  function monter() {
    exercicesParams.update((l) => {
      return moveExercice(l, indice, indice - 1)
    })
  }
</script>

<button on:click={monter} class="{indice > 0 ? '' : 'invisible'}"> <i class="bx bx-up-arrow-circle ml-4" /> </button>
