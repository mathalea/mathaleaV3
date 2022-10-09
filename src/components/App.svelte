<script lang='ts'>
  import Start from './Start.svelte'
  import Diaporama from './Diaporama.svelte'
  import { displayOptions } from "./store"
</script>

{#if $displayOptions.v === 'diaporama'}
  <Diaporama></Diaporama>
  {:else}
  <Start></Start>
{/if}
