<script lang="ts">
  import HeaderExercice from './HeaderExercice.svelte'
  export let uuid: string
  export let indiceExercice
  export let indiceLastExercice


  import { dictionnaireCrpe } from '../../modules/dictionnaireCrpe'

  let isCorrectionVisible = false
  let isContentVisible = true
  
  const exercice = dictionnaireCrpe[uuid]

  let headerExerciceProps = {title: '', isInteractif: false, settingsReady: false, interactifReady: false, randomReady: false, indiceExercice, indiceLastExercice }

  if (uuid.substring(0,5) === 'crpe-') headerExerciceProps.title = `CRPE - ${exercice.annee} - ${exercice.lieu} - ${exercice.numeroInitial}`
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
  {#each exercice.pngCor as url }
    <img src={url} width="100%" alt="énoncé">
  {/each}
{/if} 
{#if isContentVisible}
  {#each exercice.png as url }
    <img src={url} width="100%" alt="correction">
  {/each}
{/if} 