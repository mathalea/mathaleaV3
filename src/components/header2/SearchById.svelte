<script lang="ts">
  import Chips from "./Chips.svelte";
  import { listeExercices } from "../store";
  import refToUuid from "../../json/refToUuid.json";

  let input: HTMLInputElement;
  let listeIdPourLesChips = [];

  const idExercicesDisponibles = Object.keys(refToUuid);

  const exercices = [];
  $: {
    listeIdPourLesChips = [];
    for (const ex of $listeExercices) {
      listeIdPourLesChips.push(ex.id);
    }
    listeIdPourLesChips = listeIdPourLesChips;
  }

  let filteredExercices = [];

  const filterEx = () => {
    //construit la liste des codes d'exercices à proposer dans l'input de saisie.
    let storageArr = [];
    if (inputValue) {
      idExercicesDisponibles.forEach((ex) => {
        if (
          cleanInput(inputValue).every((element) =>
            ex.toLowerCase().includes(element)
          )
        ) {
          storageArr = [...storageArr, ex];
        }
      });
    }
    filteredExercices = storageArr;
    // if (filteredExercices.length === 1) {
    //   addExercice(filteredExercices[0])
    //   clearInput()
    // }
  };

  let searchInput;
  let inputValue = "";

  $: if (!inputValue) {
    filteredExercices = [];
    hiLiteIndex = null;
  }

  const cleanInput = (str) => {
    return str.toLowerCase().split(" ").filter(Boolean);
  };

  const clearInput = () => {
    inputValue = "";
    searchInput.focus();
  };

  const setInputVal = (ex) => {
    inputValue = ex;
    hiLiteIndex = null;
    addExercice(ex);
    clearInput();
    const input = document.querySelector("#idInput") as HTMLInputElement;
    input.focus();
    filteredExercices = [];
  };

  const submitValue = () => {
    if (idExercicesDisponibles.includes(inputValue)) {
      addExercice(inputValue)
      clearInput()
    } 
  };

  let hiLiteIndex = null;
  $: filteredExercices[hiLiteIndex];

  const navigateList = (e) => {
    // Pour naviguer dans la liste proposée avec les flèches.
    if (e.key === "ArrowDown" && hiLiteIndex <= filteredExercices.length - 1) {
      hiLiteIndex === null ? (hiLiteIndex = 0) : (hiLiteIndex += 1);
    } else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
      hiLiteIndex === 0
        ? (hiLiteIndex = filteredExercices.length - 1)
        : (hiLiteIndex -= 1);
    } else if (e.key === "Enter") {
      if (inputValue && filteredExercices.length === 1) {
        addExercice(filteredExercices[0]);
        clearInput();
      } else if (hiLiteIndex) {
        addExercice(filteredExercices[hiLiteIndex]);
        clearInput();
      } 
    } else {
      return;
    }
  };

  function addExercice(id) {
    if (!refToUuid[id]) return;
    const newExercise = {
      id,
      uuid: refToUuid[id],
    };
    listeExercices.update((list) => [...list, newExercise]);
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
  {#each listeIdPourLesChips as id, indice (indice)}
    <Chips text={id} {indice} />
  {/each}
</div>

<style>
  div.autocomplete {
    /*the container must be positioned relative:*/
    position: relative;
    display: inline-block;
    width: 200px;
  }
  input {
    border: 1px solid transparent;
    background-color: #f1f1f1;
    padding: 4px;
    font-size: 12px;
    margin: 0;
  }
  input[type="text"] {
    background-color: #f1f1f1;
    width: 100%;
  }
  /* input[type=submit] {
  background-color: DodgerBlue;
  color: #fff;
} */
</style>
