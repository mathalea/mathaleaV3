<script lang="ts">
  import Start from "./Start.svelte"
  import Diaporama from "./Diaporama.svelte"
  import Can from "./Can.svelte"
  import Eleve from "./Eleve.svelte"
  import { globalOptions } from "./store"


</script>

<div class="subpixel-antialiased">
  {#if $globalOptions.v === "diaporama"}
    <Diaporama />
  {:else if $globalOptions.v === "can"}
    <Can />
  {:else if $globalOptions.v === "eleve"}
    <Eleve />
  {:else}
    <Start />
  {/if}
</div>
