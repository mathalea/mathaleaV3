<script>
  import { exercicesParams } from "../store.ts"
  export let referentiel

  /**
   * Renvoie tous les objets qui ont une clé uuid
   */
  export function getAllExercices(referentiel) {
    const exercices = []
    function recursiveSearch(object) {
      Object.keys(object).forEach((key) => {
        const value = object[key]
        if (key === "uuid" && typeof value !== "object") {
          exercices.push(object)
        } else if (typeof value === "object") {
          recursiveSearch(value)
        }
      })
    }
    recursiveSearch(referentiel)
    return exercices
  }

  let listeDesExercices = getAllExercices(referentiel)
  let filteredList
  let isCanInclusDansResultats

  $: {
    referentiel = referentiel
    listeDesExercices = getAllExercices(referentiel)
    filteredList = listeDesExercices.filter((exercice) => filtre(exercice, inputSearch, isCanInclusDansResultats))
  }
  let inputSearch = ""

  /**
   * Détermine si un exercice est dans les résultats de la recherche ou pas
   */
  function filtre(exercice, inputSearch, isCanPossible) {
    if (!inputSearch) return false
    const inputs = inputSearch.split(" ")
    let results = []
    for (const input of inputs) {
      if (!exercice.id) console.log(exercice)
      results.push(exercice.titre.toLowerCase().includes(input.toLowerCase()) || exercice.id.toLowerCase().includes(input.toLowerCase()))
    }
    if (!isCanPossible) {
      results.push(!exercice.id.includes("can"))
    }
    return results.every((value) => value === true)
  }

  /**
   * Ajouter l'exercice courant à la liste
   */
  function addToList(exercice) {
    const newExercise = {
      url: exercice.url,
      id: exercice.id,
      uuid: exercice.uuid,
    }
    exercicesParams.update((list) => [...list, newExercise])
  }
</script>

<div class="mb-2 items-center font-bold text-large">Recherche</div>
<div class="ml-2 mb-4">
  <input type="text" class="border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-gray-100" bind:value={inputSearch} />
</div>
{#if inputSearch.length > 0}
  <div class="mb-4">
    Inclure les courses aux nombres : <input type="checkbox" bind:checked={isCanInclusDansResultats} />
  </div>
{/if}

{#each filteredList as exercice}
  <div class="relative flex flex-row items-center text-sm text-gray-600 bg-gray-100 ml-1">
    <div class="flex-1 hover:bg-coopmaths-lightest cursor-pointer" on:click={() => addToList(exercice)}>
      <div class="ml-[3px] pl-2 bg-gray-100 hover:bg-gray-100 flex-1">
        <span class="font-bold">{exercice.id} - </span>{exercice.titre}
      </div>
    </div>
  </div>
{/each}

<style>
  input {
    border: 2px solid transparent;
    padding: 4px;
    font-size: 12px;
    margin: 0;
  }
  input[type="text"] {
    width: 98%;
  }
</style>
