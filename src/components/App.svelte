<script lang='ts'>
  import Start from './Start.svelte'
  import Diaporama from './Diaporama.svelte'
  import Can from './Can.svelte'
  import { displayOptions } from "./store"
</script>

{#if $displayOptions.v === 'diaporama'}
  <Diaporama></Diaporama>
  {:else if $displayOptions.v === 'can'}
  <Can></Can>
  {:else}
  <Start></Start>
{/if}
