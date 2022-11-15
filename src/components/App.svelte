<script lang='ts'>
  import Start from './Start.svelte'
  import Diaporama from './Diaporama.svelte'
  import Can from './Can.svelte'
  import { globalOptions } from "./store"
</script>

{#if $globalOptions.v === 'diaporama'}
  <Diaporama></Diaporama>
  {:else if $globalOptions.v === 'can'}
  <Can></Can>
  {:else}
  <Start></Start>
{/if}
