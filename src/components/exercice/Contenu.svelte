<script lang="ts">
  import Consigne from "./Consigne.svelte"
  import Liste from "./Liste.svelte"
  export let chapeau: string
  export let chapeau2 = ''
  export let entrees: string[]
  export let entrees2 = []
  export let spacing: number
  export let indiceExercice: number
  export let type: "enonce" | "correction"
</script>

<article class="text-2xl lg:text-base">
  <!-- Consigne -->
  <Consigne consigne={chapeau} />
  {#if chapeau2}
  <Consigne consigne={chapeau2} />
  {/if}
  <!-- Liste des questions -->
  <Liste liste={entrees} liste2={entrees2} {spacing} {indiceExercice} {type} />
</article>

<style></style>
