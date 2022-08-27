<script lang="ts">
  import Chips from "./Chips.svelte"
  import { listeExercices } from "../store"
  import data from '../../json/exercicesList.json'
  import { Mathalea } from '../../Mathalea'
  
  let input: HTMLInputElement
  let listeId = []
  
  const exercices = []
  $: {
    listeId = []
    for (const ex of $listeExercices) {
      listeId.push(ex.id)
    }
    listeId = listeId
  }

let filteredExercices = []; 

const filterEx = () => {
//construit la liste des codes d'exercices à proposer dans l'input de saisie.
	let storageArr = []
	if (inputValue) {
		data.forEach(ex => {
			 if (cleanInput(inputValue).every(element => ex.replace('.js','').toLowerCase().includes(element))) {
				 storageArr = [...storageArr, (ex.replace('.js',''))];
			 }
		})
	}
	filteredExercices = storageArr
  if (filteredExercices.length === 1) {
    handleChange2()
  }
}	


let searchInput
let inputValue = ''
	
$: if (!inputValue) {
	filteredExercices = []
	hiLiteIndex = null
}

const cleanInput = (str) => {
	return str.toLowerCase().split(' ').filter(Boolean)
}

const clearInput = () => {
	inputValue = ''
	searchInput.focus()
}
	
const setInputVal = (ex) => {
  Mathalea.loadFromUrlWithoutExtension(ex)
	inputValue = ex
	filteredExercices = []
	hiLiteIndex = null
	const input = document.querySelector('#idInput') as HTMLInputElement
	input.focus()
}	

const submitValue = () => {
	if (inputValue) {
		setTimeout(clearInput, 1000);
	} 
}

	
let hiLiteIndex = null
$: filteredExercices[hiLiteIndex] 	
	
const navigateList = (e) => {
// Pour naviguer dans la liste proposée avec les flèches.
	if (e.key === "ArrowDown" && hiLiteIndex <= filteredExercices.length-1) {
		hiLiteIndex === null ? hiLiteIndex = 0 : hiLiteIndex += 1
	} else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
		hiLiteIndex === 0 ? hiLiteIndex = filteredExercices.length-1 : hiLiteIndex -= 1
	} else if (e.key === "Enter") {
		setInputVal(filteredExercices[hiLiteIndex])
	} else {
		return
	}
} 
  

function handleChange2() {
  //fonction permettant la mise à jour de la liste d'exercice lorsque le code rentré dans l'input de saisie 
  // correspond à un code complet d'exercice.
  if (filterEx.length === 1 || inputValue === '') {
    return
  }
  let newId = inputValue
  Mathalea.loadFromUrlWithoutExtension(newId)
  clearInput()
}


</script>


  <svelte:window on:keydown={navigateList} />
  <div class="inline-flex space-x-2">
<form autocomplete="off" on:submit|preventDefault={submitValue}>
  <div class="autocomplete">
    <input id="idInput" 
					 type="text" 
           list="autocomplete-items-list"
					 placeholder="Identifiant d'exercice" 
					 bind:this={searchInput}
					 bind:value={inputValue} 
					 on:input={filterEx}
           on:change={handleChange2}
           >
    <datalist id="autocomplete-items-list" class="fixed">
			{#each filteredExercices as ex, i}
				<option value={ex}/>
			{/each}			
		</datalist>
  </div>

</form>
  {#each listeId as id, indice (indice)}
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
input[type=text] {
  background-color: #f1f1f1;
  width: 100%;
}
/* input[type=submit] {
  background-color: DodgerBlue;
  color: #fff;
} */
	
</style>	