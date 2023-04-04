<script lang="ts">
  import HeaderExercice from "./HeaderExercice.svelte"
  import referentielStatic from "../../json/referentielStatic.json"
  export let uuid: string
  export let indiceExercice
  export let indiceLastExercice

  function getExerciceByUuid(uuid) {
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

  if (typeof exercice.png === "string") exercice.png = [exercice.png]
  if (typeof exercice.pngCor === "string") exercice.pngCor = [exercice.pngCor]

  let headerExerciceProps = { title: "", isInteractif: false, settingsReady: false, interactifReady: false, randomReady: false, indiceExercice, indiceLastExercice }

  headerExerciceProps.title = `${exercice.typeExercice.toUpperCase()} - ${exercice.mois || ""} ${exercice.annee} - ${exercice.lieu} - ${exercice.numeroInitial}`
</script>

<HeaderExercice
  {...headerExerciceProps}
  on:clickCorrection={(event) => {
    isCorrectionVisible = event.detail.isCorrectionVisible
  }}
  on:clickVisible={(event) => {
    isContentVisible = event.detail.isVisible
    isCorrectionVisible = event.detail.isVisible
  }}
/>

<div class="p-4">
  {#if isContentVisible}
    {#each exercice.png as url}
      <img src={url} class="w-full" alt="énoncé" />
    {/each}
  {/if}

  {#if isCorrectionVisible}
    <div
      class="relative self-start border-l-coopmaths-warn-dark dark:border-l-coopmathsdark-warn-dark border-l-4 text-coopmaths-corpus dark:text-coopmathsdark-corpus mb-2 lg:mb-0 ml-0 lg:ml-0 py-2 pl-4 lg:pl-6 mt-4 lg:mt-6"
      id="correction${indiceExercice}"
    >
      <div class="container">
        {#each exercice.pngCor as url}
          <img src={url} class="w-full p-2" alt="correction" />
        {/each}
      </div>
      <div class="absolute border-coopmaths-warn-dark top-0 left-0 border-b-4 w-10" />
      <div
        class="absolute h-6 w-6 flex flex-row justify-center items-center -left-3 -top-2 rounded-full bg-coopmaths-warn-dark dark:bg-coopmathsdark-warn-dark text-coopmaths-canvas dark:text-coopmathsdark-canvas"
      >
        <i class="bx bx-check font-bold" />
      </div>
      <div class="absolute border-coopmaths-warn-dark bottom-0 left-0 border-b-4 w-4" />
    </div>
  {/if}
</div>
