<script lang="ts">
  import HeaderExercice from './HeaderExercice.svelte'
  import referentielStatic from '../../json/referentielStatic.json'
  export let uuid: string
  export let indiceExercice
  export let indiceLastExercice

  function getExerciceByUuid (uuid) {
    for (const examen in referentielStatic) {
      for (const anneOuTag in referentielStatic[examen]) {
        for (const exercice in referentielStatic[examen][anneOuTag])
        if (referentielStatic[examen][anneOuTag][exercice].uuid === uuid) {
          return referentielStatic[examen][anneOuTag][exercice]
        }
      }
    }
  } 

  const exercice = getExerciceByUuid(uuid)
  
  let isCorrectionVisible = false
  let isContentVisible = true
  
  if (typeof exercice.png === 'string') exercice.png = [exercice.png]
  if (typeof exercice.pngCor === 'string') exercice.pngCor = [exercice.pngCor]

  let headerExerciceProps = {title: '', isInteractif: false, settingsReady: false, interactifReady: false, randomReady: false, indiceExercice, indiceLastExercice }

  headerExerciceProps.title = `${exercice.typeExercice.toUpperCase()} - ${exercice.annee} - ${exercice.lieu} - ${exercice.numeroInitial}`
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
    <img src={url} width="100%" alt="correction">
  {/each}
{/if} 
{#if isContentVisible}
  {#each exercice.png as url }
    <img src={url} width="100%" alt="énoncé">
  {/each}
{/if} 