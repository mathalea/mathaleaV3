<script lang="ts">
    import Chips from "./Chips.svelte"
    import { listeExercices } from "../store"
    import ExercicesData from "./ExercicesData.svelte";
    import data from '../../exercicesList.json'
    
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
	let storageArr = []
	if (inputValue) {
		data.forEach(ex => {
			 if (cleanInput(inputValue).every(element => ex.replace('.js','').toLowerCase().includes(element))) {
				 storageArr = [...storageArr, (ex.replace('.js',''))];
			 }
		})
	}
	filteredExercices = storageArr
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
	inputValue = removeBold(ex)
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

const makeMatchBold = (str) => {
	let matched = []
	inputValue.split(' ').filter(Boolean).forEach(element => { 
	matched.push(str.substring(str.indexOf(element), str.indexOf(element) + element.length));
	}
	)
	let boldedMatch = str
	matched.forEach(element => {
		boldedMatch = boldedMatch.replace(element, `<strong>${element}</strong>`)
		}
	)
	return boldedMatch
}

const removeBold = (str) => {
	return str.replace(/<(.)*?>/g, "")
}	
	
let hiLiteIndex = null
$: filteredExercices[hiLiteIndex] 	
	
const navigateList = (e) => {
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
      let newId = inputValue.replace('.js','')
      let ex = newId.split('/')
      let newExercice = {}
      if ( ex.length == 3 ) {
        newExercice = {
        directory: ex[0]+'/'+ex[1],
        id: ex[2],
        }
      } else {
      newExercice = {
        directory: ex[0],
        id: ex[1],
      }
    }
      listeExercices.update((l) => [...l, newExercice])
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
					 on:input={filterEx}>
  </div>
  <input type="submit" on:click={handleChange2}>
	{#if filteredExercices.length > 0}
		<datalist id="autocomplete-items-list" class="fixed">
			{#each filteredExercices as ex, i}
				<option value={ex} />
			{/each}			
		</datalist>
	{/if}
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
input[type=submit] {
  background-color: DodgerBlue;
  color: #fff;
}
	
#autocomplete-items-list {
	position: relative;
	margin: 0;
	padding: 0;
	top: 0;
	width: 197px;
    height: 200px;
	border: 1px solid #ddd;
	background-color: #ddd;    
    overflow-y: scroll;
}	
</style>	