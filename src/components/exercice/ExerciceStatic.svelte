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
      class="relative border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus mt-6 lg:mt-2 mb-6 py-2 pl-4"
      id="correction${indiceExercice}Q${i}"
    >
      <div class="container">
        {#each exercice.pngCor as url}
          <img src={url} class="w-full p-2" alt="correction" />
        {/each}
      </div>
      <!-- <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct top-0 left-0 border-b-[3px] w-10" /> -->
      <div
        class="absolute flex flex-row py-[0.08rem] px-3 rounded-t-md justify-center items-center -left-[0.2rem] -top-[16px] bg-coopmaths-struct dark:bg-coopmathsdark-struct font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
      >
        Correction
      </div>
      <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct bottom-0 left-0 border-b-[3px] w-4" />
    </div>
  {/if}
</div>
