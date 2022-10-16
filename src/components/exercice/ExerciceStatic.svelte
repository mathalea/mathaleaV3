<script lang="ts">
  import HeaderExercice from './HeaderExercice.svelte'
  export let uuid
  export let indiceExercice
  export let indiceLastExercice


  import { dictionnaireCrpe } from '../../modules/dictionnaireCrpe'

  let isCorrectionVisible = false
  let isContentVisible = true
  
  const exerciceStatic = dictionnaireCrpe[uuid]

  const headerExerciceProps = { title: 'CRPE', isInteractif: false, settingsReady: false, interactifReady: false, randomReady: false, indiceExercice, indiceLastExercice }

</script>

<HeaderExercice {...headerExerciceProps}
  on:clickCorrection = {(event) => {
    isCorrectionVisible = event.detail.isCorrectionVisible
  }}
  on:clickVisible = {(event) => {
    isContentVisible = event.detail.isVisible 
    isCorrectionVisible = event.detail.isVisible 
  }}
></HeaderExercice>

{#if isCorrectionVisible}
  {#each exerciceStatic.pngCor as url }
    <img src={url} width="100%" alt="énoncé">
  {/each}
{/if} 
{#if isContentVisible}
  {#each exerciceStatic.png as url }
    <img src={url} width="100%" alt="correction">
  {/each}
{/if} 