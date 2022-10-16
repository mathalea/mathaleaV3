<script lang="ts">
import { exercicesParams } from "../store"
    import { isRecent } from "../utils/handleDate";
  
  export let exercice
  export let nestedLevelCount: number

  /*--------------------------------------------------------------
    Gestions des exercices via la liste
   ---------------------------------------------------------------*/
  const isPresent = (code) => {
    return code === exercice.get('uuid')
  }
  const tags = exercice.get('tags')
  let selectedCount = 0
  let listeCodes = []
  // on compte réactivement le nombre d'occurences
  // de l'exercice dans la liste des sélectionnés
  $: {
    listeCodes = []
    for (const exo of $exercicesParams) {
      listeCodes.push(exo.uuid)
    }
    listeCodes = listeCodes
    selectedCount = listeCodes.filter(isPresent).length
  }
  /**
   * Ajouter l'exercice courant à la liste
   */
  function addToList() {
    const newExercise = {
      url: exercice.get('url'),
      id: exercice.get('id'),
      uuid: exercice.get('uuid')
    }
    exercicesParams.update((list) => [...list, newExercise])
    
  }
  /**
   * Retirer l'exercice de la liste (si plusieurs occurences
   * la première est retirée)
   */
  function removeFromList() {
    let matchingIndex = listeCodes.findIndex(isPresent)
    exercicesParams.update((list) => [...list.slice(0, matchingIndex), ...list.slice(matchingIndex + 1)])
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
      {#if exercice.has('lieu')}
      <span class="font-bold">{exercice.get('typeExercice').toUpperCase()} {exercice.get('annee')} - {exercice.get('lieu')} - {exercice.get('numeroInitial')}</span>
        <div>
          {#each tags as tag }
            <span class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-light text-white text-xs px-1 py-[1px] shadow-sm mr-1">{tag}</span>
          {/each}
        </div>
      {:else}
        <span class="font-bold">{exercice.get('id')} - </span>{exercice.get('titre')}
        {#if isRecent(exercice.get('datePublication'))}
        <span class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-light text-white text-xs px-1 py-[1px] shadow-sm">NEW</span>
        {/if}
        {#if isRecent(exercice.get('dateModification'))}
        <span class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-light text-white text-xs px-1 py-[1px] shadow-sm">MAJ</span>
        {/if}
      {/if}
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
