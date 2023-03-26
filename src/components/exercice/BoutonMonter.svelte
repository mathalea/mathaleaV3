<script lang="ts">
  import { exercicesParams, moveExercice } from "../store"
  export let indice: number
  function monter() {
    exercicesParams.update((l) => {
      return moveExercice(l, indice, indice - 1)
    })
  }
</script>

<button on:click={monter} class={indice > 0 ? "" : "hidden md:invisible"}>
  <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-up-arrow-circle" />
</button>
