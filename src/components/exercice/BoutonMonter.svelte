<script lang="ts">
  import { listeExercices, moveExercice } from "../store"
  export let indice: number
  function monter() {
    listeExercices.update((l) => {
      return moveExercice(l, indice, indice - 1)
    })
  }
</script>

<button on:click={monter} class="{indice > 0 ? '' : 'invisible'}"> <i class="bx bx-up-arrow-circle ml-4" /> </button>
