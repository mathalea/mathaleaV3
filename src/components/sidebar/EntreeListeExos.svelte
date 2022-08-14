<script lang="ts">
  import { listeExercices } from "../store"
  
  export let exo
  export let nestedLevelCount: number

  /*--------------------------------------------------------------
    Gestions des exercices via la liste
   ---------------------------------------------------------------*/
  const isPresent = (code) => {
    return code === exo.get('id')
  }
  let selectedCount = 0
  let listeCodes = []
  // on compte réactivement le nombre d'occurences
  // de l'exercice dans la liste des sélectionnés
  $: {
    listeCodes = []
    for (const exo of $listeExercices) {
      listeCodes.push(exo.id)
    }
    listeCodes = listeCodes
    selectedCount = listeCodes.filter(isPresent).length
  }
  /**
   * Ajouter l'exercice courant à la liste
   */
  function addToList() {
    const newExercise = {
      url: exo.get('url'),
      id: exo.get('id')
    }
    listeExercices.update((list) => [...list, newExercise])
    
  }
  /**
   * Retirer l'exercice de la liste (si plusieurs occurences
   * la première est retirée)
   */
  function removeFromList() {
    let matchingIndex = listeCodes.findIndex(isPresent)
    listeExercices.update((list) => [...list.slice(0, matchingIndex), ...list.slice(matchingIndex + 1)])
  }

  /*--------------------------------------------------------------
    Gestions des icônes en début de ligne
   ---------------------------------------------------------------*/
  let icon = "bxs-message-alt"
  let rotation = "-rotate-90"
  let mouseIsOut = true
  function handleMouseOver() {
    icon = "bx-trash"
    rotation = "rotate-0"
    mouseIsOut = false
  }
  function handleMouseOut() {
    icon = "bxs-message-alt"
    rotation = "-rotate-90"
    mouseIsOut = true
  }
</script>

<!-- 
  @component
  Écrit le nom d'un exercice sur le format : code + titre

  Par exemple : *5A12-1 - Primalité ou pas*

  Ajoute un tag en tête de ligne si le fichier est présent
  dans la liste des exercices sélectionnés

  Paramètres :
  - **exo** : objet de type *Exo* (`{"id": UUID de l'exo, "code": nom de l'exo (par exemple "6N12-3")}`)
  - **pathToThisNode** : chemin amenant à cet exercice (utlisé dans la recherche du titre)
  - **nestedLevelCount** : compteur pour connaître le nombre d'imbrication (utilisé pour l'indentation de la ligne)
  
 -->
<div class="relative flex flex-row items-center text-sm text-gray-600 bg-gray-400 ml-{nestedLevelCount * 2}">
  <div class="flex-1 hover:bg-coopmaths-lightest cursor-pointer" on:click={addToList}>
    <div class="ml-[3px] pl-2 bg-gray-200 hover:bg-gray-100 flex-1">
      <span class="font-bold">{exo.get('id')} - </span>{exo.get('titre')}
    </div>
  </div>
  {#if selectedCount >= 1}
    <button type="button" class="absolute -left-4" on:mouseover={handleMouseOver} on:mouseout={handleMouseOut} on:click={removeFromList}
      ><i class="text-coopmaths-lightest text-base bx {icon} {rotation}" /></button
    >
  {/if}
  {#if (selectedCount >= 2) && mouseIsOut}
    <div class="absolute -left-[12.5px] text-[0.6rem] font-bold text-white">{selectedCount}</div>
  {/if}
</div>
