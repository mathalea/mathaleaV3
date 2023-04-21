<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { tick } from "svelte"
  import { exercicesParams } from "../store"
  import type { InterfaceReferentiel } from "../../lib/types"
  import EntreeRecherche from "./EntreeRecherche.svelte"
  import Button from "../forms/Button.svelte"
  import Chip from "../forms/Chip.svelte"
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
  export let isAmcOnlySelected: boolean = false
  export let isInteractiveOnlySelected: boolean = false
  let isFiltersDisplayed: boolean = false

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

  const dispatch = createEventDispatcher()

  function triggerAction() {
    dispatch("specific", {
      msg: "Action triggered !",
    })
  }
</script>

<!-- <svelte:window on:keydown={handlePressEnter} /> -->
<div class="flex flex-row space-x-6 {isFiltersDisplayed ? 'mb-0' : 'mb-2'} justify-start items-center">
  <div class="font-bold text-large text-coopmaths-struct dark:text-coopmathsdark-struct">Recherche</div>
  <Button
    title=""
    icon="bx-filter-alt"
    on:click={() => {
      isFiltersDisplayed = !isFiltersDisplayed
    }}
  />
  <div class="inline-flex justify-start text-sm">
    <Chip
      text="AMC"
      textColor="canvas"
      bgColor="struct"
      isVisible={isAmcOnlySelected}
      on:action={() => {
        isAmcOnlySelected = !isAmcOnlySelected
        triggerAction()
      }}
    />
    <Chip
      text="Interactif"
      textColor="canvas"
      bgColor="struct"
      isVisible={isInteractiveOnlySelected}
      on:action={() => {
        isInteractiveOnlySelected = !isInteractiveOnlySelected
        triggerAction()
      }}
    />
    <!-- <span class={isAmcOnlySelected ? "flex" : "hidden"}>AMC</span>
    <span class={isInteractiveOnlySelected ? "flex" : "hidden"}>Interactif</span> -->
  </div>
</div>
<div class="{isFiltersDisplayed ? 'flex' : 'hidden'} flex-col justify-start items-start mb-2">
  <div class="flex-row justify-start items-center pr-4 pl-6">
    <input
      id="checkbox-amc"
      aria-describedby="checkbox-amc"
      type="checkbox"
      class="w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action rounded"
      bind:checked={isAmcOnlySelected}
      on:change={triggerAction}
    />
    <label for="checkbox-choice" class="ml-2 text-xs font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"> Exercices compatibles AMC </label>
  </div>
  <div class="flex-row justify-start items-center pr-4 pl-6">
    <input
      id="checkbox-interactive"
      aria-describedby="checkbox-interactive"
      type="checkbox"
      class="w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action rounded"
      bind:checked={isInteractiveOnlySelected}
      on:change={triggerAction}
    />
    <label for="checkbox-choice" class="ml-2 text-xs font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"> Exercices interactifs </label>
  </div>
</div>
<div class="mb-4 w-full">
  <input
    type="text"
    id="searchField"
    class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light text-sm"
    placeholder="Thème, identifiant..."
    bind:value={inputSearch}
  />
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
