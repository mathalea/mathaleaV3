<script lang="ts">
  import Chips from "./Chips.svelte"
  import { exercicesParams } from "../store"
  import refToUuid from "../../json/refToUuid.json"
    import type { InterfaceReferentiel } from "src/lib/types";

  let input: HTMLInputElement
  let listeIdPourLesChips: string[] = []

  const idExercicesDisponibles = Object.keys(refToUuid)

  const exercices = []
  $: {
    listeIdPourLesChips = []
    for (const ex of $exercicesParams) {
      listeIdPourLesChips.push(ex.id ?? ex.uuid)
    }
    listeIdPourLesChips = listeIdPourLesChips
  }

  let filteredExercices: string[] = []

  const filterEx = () => {
    //construit la liste des codes d'exercices à proposer dans l'input de saisie.
    let storageArr: string[] = []
    if (inputValue) {
      idExercicesDisponibles.forEach((ex) => {
        if (cleanInput(inputValue).every((element) => ex && ex.toLowerCase().includes(element))) {
          storageArr = [...storageArr, ex]
        }
      })
    }
    filteredExercices = storageArr
    // if (filteredExercices.length === 1) {
    //   addExercice(filteredExercices[0])
    //   clearInput()
    // }
  }

  let searchInput: HTMLInputElement
  let inputValue = ""

  $: if (!inputValue) {
    filteredExercices = []
    hiLiteIndex = null
  }

  const cleanInput = (text: string) => {
    return text.toLowerCase().split(" ").filter(Boolean)
  }

  const clearInput = () => {
    inputValue = ""
    searchInput.focus()
  }

  const setInputVal = (ex: string) => {
    inputValue = ex
    hiLiteIndex = null
    addExercice(ex)
    clearInput()
    const input = document.querySelector("#idInput") as HTMLInputElement
    input.focus()
    filteredExercices = []
  }

  const submitValue = () => {
    if (idExercicesDisponibles.includes(inputValue)) {
      addExercice(inputValue)
      clearInput()
    }
  }

  let hiLiteIndex: number = null
  $: filteredExercices[hiLiteIndex]

  const navigateList = (e: KeyboardEvent) => {
    // Pour naviguer dans la liste proposée avec les flèches.
    if (e.key === "ArrowDown" && hiLiteIndex <= filteredExercices.length - 1) {
      hiLiteIndex === null ? (hiLiteIndex = 0) : (hiLiteIndex += 1)
    } else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
      hiLiteIndex === 0 ? (hiLiteIndex = filteredExercices.length - 1) : (hiLiteIndex -= 1)
    } else if (e.key === "Enter") {
      if (inputValue && filteredExercices.length === 1) {
        addExercice(filteredExercices[0])
        clearInput()
      } else if (hiLiteIndex) {
        addExercice(filteredExercices[hiLiteIndex])
        clearInput()
      }
    } else {
      return
    }
  }

  function addExercice(id: string) {
    if (!refToUuid[id as keyof typeof refToUuid]) return
    const newExercise = {
      id,
      uuid: refToUuid[id as keyof typeof refToUuid],
    }
    exercicesParams.update((list) => [...list, newExercise])
  }
</script>

<svelte:window on:keydown={navigateList} />
<div class="inline-flex space-x-2">
  <form autocomplete="off" on:submit|preventDefault={submitValue}>
    <div class="autocomplete">
      <input
        id="idInput"
        type="text"
        list="autocomplete-items-list"
        class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm"
        placeholder="Identifiant d'exercice"
        bind:this={searchInput}
        bind:value={inputValue}
        on:input={filterEx}
      />
      <datalist id="autocomplete-items-list" class="fixed">
        {#each filteredExercices as ex, i}
          <option value={ex} />
        {/each}
      </datalist>
    </div>
  </form>
  <div class="flex flex-row p-0 items-center overflow-x-auto whitespace-nowrap space-x-2">
    {#each listeIdPourLesChips as id, indice (indice)}
      <Chips text={id} {indice} />
    {/each}
  </div>
</div>

<style>
  div.autocomplete {
    /*the container must be positioned relative:*/
    position: relative;
    display: inline-block;
    width: 200px;
  }
  /* input {
    border: 1px solid transparent;
    background-color: #f1f1f1;
    padding: 4px;
    font-size: 12px;
    margin: 0;
  }
  input[type="text"] {
    background-color: #f1f1f1;
    width: 100%;
  } */
  /* input[type=submit] {
  background-color: DodgerBlue;
  color: #fff;
} */
</style>
