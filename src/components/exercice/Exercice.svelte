<script lang="ts">
  import { Mathalea } from "../../lib/Mathalea"
  import { onMount } from "svelte"
  import { globalOptions } from "../store"
    import type { InterfaceParams } from "src/lib/types";

  // paramsExercice est de type {url, nbQuestions, sup, sup2, sup3, sup4, duration}
  export let paramsExercice: InterfaceParams
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isCorrectionVisible = false

  let exercice
  let ComponentExercice
  let optionsComponent

  onMount(async () => {
    if (
      paramsExercice.uuid.substring(0, 5) === "crpe-" ||
      paramsExercice.uuid.substring(0, 4) === "dnb_" ||
      paramsExercice.uuid.substring(0, 4) === "e3c_" ||
      paramsExercice.uuid.substring(0, 4) === "bac_"
    ) {
      optionsComponent = { uuid: paramsExercice.uuid }
      ComponentExercice = (await import("./ExerciceStatic.svelte")).default
    } else {
      exercice = await Mathalea.load(paramsExercice.uuid)
      if (exercice === undefined) return
      exercice.numeroExercice = indiceExercice
      if (paramsExercice.nbQuestions) exercice.nbQuestions = paramsExercice.nbQuestions
      if (paramsExercice.duration) exercice.duree = paramsExercice.duration
      if (paramsExercice.sup) exercice.sup = handleStringFromUrl(paramsExercice.sup)
      if (paramsExercice.sup2) exercice.sup2 = handleStringFromUrl(paramsExercice.sup2)
      if (paramsExercice.sup3) exercice.sup3 = handleStringFromUrl(paramsExercice.sup3)
      if (paramsExercice.sup4) exercice.sup4 = handleStringFromUrl(paramsExercice.sup4)
      if (paramsExercice.interactif) exercice.interactif = paramsExercice.interactif
      if (paramsExercice.alea) exercice.seed = paramsExercice.alea
      if (paramsExercice.cd !== undefined) exercice.correctionDetaillee = paramsExercice.cd === "1"
      optionsComponent = { exercice }
      if ($globalOptions.v === "eleve") {
        ComponentExercice = (await import("./ExerciceVueEleve.svelte")).default
      } else {
        ComponentExercice = (await import("./ExerciceMathalea.svelte")).default
      }
    }
  })

function handleStringFromUrl (text: string): boolean|number|string {
  if (text === 'true' || text === 'false') {
    // "true"=>true
    return text === 'true'
  } else if (/^\d+$/.test(text)) {
    // "17"=>17
    return parseInt(text)
  } else {
    return text
  }
}
</script>

<div class="z-0 flex-1 overflow-hidden">
  <svelte:component this={ComponentExercice} {...optionsComponent} {indiceExercice} {indiceLastExercice} {isCorrectionVisible} />
</div>

<style>
</style>
