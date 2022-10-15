<script lang="ts">
  import { Mathalea } from "../../Mathalea"
  import { onMount } from "svelte"

  // paramsExercice est de type {url, nbQuestions, sup, sup2, sup3, sup4, duration}
  export let paramsExercice
  export let indiceExercice: number
  export let indiceLastExercice: number

  let exercice
  let typeExercice = undefined
  let ComponentExercice

  onMount(async () => {
    exercice = await Mathalea.load(paramsExercice.uuid)
    if (exercice === undefined) return
    if (paramsExercice.nbQuestions) exercice.nbQuestions = paramsExercice.nbQuestions
    if (paramsExercice.duration) exercice.duree = paramsExercice.duration
    if (paramsExercice.sup) exercice.sup = paramsExercice.sup
    if (paramsExercice.sup2) exercice.sup2 = paramsExercice.sup2
    if (paramsExercice.sup3) exercice.sup3 = paramsExercice.sup3
    if (paramsExercice.sup4) exercice.sup4 = paramsExercice.sup4
    if (paramsExercice.interactif) exercice.interactif = paramsExercice.interactif
    if (paramsExercice.alea) exercice.seed = paramsExercice.alea
    if (paramsExercice.cd !== undefined) exercice.correctionDetaillee = paramsExercice.cd === "1"
    exercice.numeroExercice = indiceExercice
    typeExercice = exercice.typeExercice
    // Chargement dynamique du component correspondant au type d'exercice
    if (typeExercice === "simplefdfd") {
      //ToFix, ce n'est plus utilisé pour simple mais ça pourra l'être pour statique
      // ComponentExercice = (await import('./ExerciceSimple.svelte')).default
    } else {
      ComponentExercice = (await import("./ExerciceMathalea.svelte")).default
    }
  })
</script>

<div class="z-0 flex-1 overflow-hidden">
  <svelte:component this={ComponentExercice} {exercice} {indiceExercice} {indiceLastExercice} />
</div>

<style>
</style>
