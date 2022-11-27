<script lang="ts">
  import Start from "./Start.svelte"
  import Diaporama from "./Diaporama.svelte"
  import Can from "./Can.svelte"
  import { globalOptions, questionsOrder } from "./store"
  import { onDestroy } from "svelte"

  const unsubscribe = questionsOrder.subscribe((value) => {})
  onDestroy(unsubscribe)
</script>

{#if $globalOptions.v === "diaporama"}
  <Diaporama />
{:else if $globalOptions.v === "can"}
  <Can />
{:else}
  <Start />
{/if}
