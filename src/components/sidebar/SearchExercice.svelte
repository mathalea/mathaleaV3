<script lang="ts">
  import { exercicesParams } from "../store"
  import type { InterfaceReferentiel } from "../../lib/types"
  import EntreeRecherche from "./EntreeRecherche.svelte"
  export let referentiel: object

  /**
   * Renvoie tous les objets qui ont une clé uuid
   */
  export function getAllExercices(referentiel: object) {
    const exercices: InterfaceReferentiel[] = []
    function recursiveSearch(object: object) {
      Object.keys(object).forEach((key) => {
        // Les exercces "nouveaux" apparaissent en doublon dans le référentiel
        if (key === "Nouveautés") return
        //@ts-ignore
        const value = object[key]
        if (key === "uuid" && typeof value !== "object") {
          exercices.push(object as InterfaceReferentiel)
        } else if (typeof value === "object") {
          recursiveSearch(value)
        }
      })
    }
    recursiveSearch(referentiel)
    return exercices
  }

  let listeDesExercices = getAllExercices(referentiel)
  let filteredList: InterfaceReferentiel[]
  let isCanInclusDansResultats: boolean

  $: {
    referentiel = referentiel
    listeDesExercices = getAllExercices(referentiel)
    filteredList = listeDesExercices.filter((exercice) => filtre(exercice, inputSearch, isCanInclusDansResultats))
  }
  let inputSearch = ""

  // function handlePressEnter(e: KeyboardEvent) {
  //   if (e.key === "Enter") {
  //     if (filteredList.length === 1) {
  //       addToList(filteredList[0])
  //     }
  //   }
  // }

  /**
   * Détermine si un exercice est dans les résultats de la recherche ou pas
   */
  function filtre(exercice: InterfaceReferentiel, inputSearch: string, isCanPossible: boolean) {
    // Les exercices statiques ont une année on les exclue de la recherche
    if (!inputSearch || exercice.annee) return false
    // Cela permet de trouver les problèmes de construction du dictionnaire
    if (!exercice.id) console.log("Manque id", exercice)
    if (inputSearch.includes("can")) {
      isCanInclusDansResultats = true
    }
    const inputs = inputSearch.split(" ")
    let results = []
    for (const input of inputs) {
      // Pour les exercices statiques exercice.titre n'existe pas
      try {
        results.push(exercice.titre && (exercice.titre.toLowerCase().includes(input.toLowerCase()) || exercice.id.toLowerCase().includes(input.toLowerCase())))
      } catch (error) {
        console.log(error)
      }
    }
    if (!isCanPossible) {
      // Pour les exercices statiques exercice.id n'existe pas
      results.push(exercice.id && !exercice.id.includes("can"))
    }
    return results.every((value) => value === true)
  }

  // /**
  //  * Ajouter l'exercice courant à la liste
  //  */
  // function addToList(exercice: InterfaceReferentiel) {
  //   const newExercise = {
  //     url: exercice.url,
  //     id: exercice.id,
  //     uuid: exercice.uuid,
  //   }
  //   exercicesParams.update((list) => [...list, newExercise])
  // }
</script>

<!-- <svelte:window on:keydown={handlePressEnter} /> -->
<div class="mb-2 items-center font-bold text-large text-coopmaths-struct dark:text-coopmathsdark-struct">Recherche</div>
<div class="mb-4 w-full">
  <!-- <span class="block"> -->
  <input
    type="text"
    class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light text-sm"
    placeholder="Thème, identifiant..."
    bind:value={inputSearch}
  />
  <!-- </span> -->
</div>
{#if inputSearch.length > 0}
  <div class="mb-4 text-coopmaths-struct-light dark:text-coopmathsdark-struct-light text-sm font-light">
    Inclure les courses aux nombres :
    <input
      type="checkbox"
      class="ml-2 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-2 border-transparent focus:border-2 text-coopmaths-action focus:border-coopmaths-action dark:text-coopmathsdark-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-30"
      bind:checked={isCanInclusDansResultats}
    />
  </div>
{/if}

{#each filteredList as exercice}
  <!-- <div class="relative flex flex-row items-center text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas ml-1">
    <div class="flex-1 hover:bg-coopmaths-light dark:hover:bg-coopmathsdark-light cursor-pointer" on:click={() => addToList(exercice)} on:keydown={() => addToList(exercice)}>
      <div class="ml-[3px] pl-2 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas  hover:bg-coopmaths-canvas-dark dark:hover:bg-coopmathsdark-canvas-dark flex-1">
        <span class="font-bold">{exercice.id} - </span>{exercice.titre}
      </div>
    </div>
  </div> -->
  <EntreeRecherche {exercice} />
{/each}
