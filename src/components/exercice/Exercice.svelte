<script lang="ts">
  import { MathaleaHandleParamOfOneExercice, MathaleaLoadExerciceFromUuid } from "../../lib/Mathalea"
  import { onMount, SvelteComponent } from "svelte"
  import { globalOptions } from "../store"
    import type { InterfaceParams } from "src/lib/types";

  // paramsExercice est de type {url, nbQuestions, sup, sup2, sup3, sup4, duration}
  export let paramsExercice: InterfaceParams
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isCorrectionVisible = false

  let exercice
  let ComponentExercice: typeof SvelteComponent
  let optionsComponent: object

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
      exercice = await MathaleaLoadExerciceFromUuid(paramsExercice.uuid)
      if (exercice === undefined) return
      exercice.numeroExercice = indiceExercice
      MathaleaHandleParamOfOneExercice(exercice, paramsExercice)
      if (paramsExercice.duration) exercice.duree = paramsExercice.duration
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
