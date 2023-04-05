<script lang="ts">
  import { exercicesParams } from "../store"
  import { isRecent } from "../utils/handleDate"

  export let exercice

  /*--------------------------------------------------------------
    Gestions des exercices via la liste
   ---------------------------------------------------------------*/
  const isPresent = (code) => {
    return code === exercice.uuid
  }
  const tags = exercice.tags
  let selectedCount = 0
  let listeCodes = []
  // on compte réactivement le nombre d'occurences
  // de l'exercice dans la liste des sélectionnés
  $: {
    selectedCount = 0
    listeCodes = []
    for (const exo of $exercicesParams) {
      listeCodes.push(exo.uuid)
    }
    listeCodes = listeCodes
    for (const e of listeCodes) {
      if (exercice.uuid === e) {
        selectedCount += 1
      }
    }
    // selectedCount = listeCodes.filter(isPresent).length
    selectedCount = selectedCount
    console.log("liste: " + listeCodes + " / selectedCount = " + selectedCount)
  }
  /**
   * Ajouter l'exercice courant à la liste
   */
  function addToList(exercice: InterfaceReferentiel) {
    const newExercise = {
      url: exercice.url,
      id: exercice.id,
      uuid: exercice.uuid,
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

<!-- <div>{Object.keys(exercice)} : {exercice.dateDeModifImportante}</div> -->
<div class="relative flex flex-row items-center text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas ml-4">
  <div
    class="flex-1 hover:bg-coopmaths-action-light dark:hover:bg-coopmathsdark-action-light dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest cursor-pointer"
    on:click={() => {
      addToList(exercice)
    }}
    on:keydown={() => {
      addToList(exercice)
    }}
  >
    <div class="ml-[3px] pl-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest flex-1">
      <div class="text-coopmaths-corpus dark:text-coopmathsdark-corpus">
        <span class="font-bold">{exercice.id} - </span>{exercice.titre}
      </div>
      {#if isRecent(exercice.dateDePublication)}
        <span class="badge badge-secondary dark:badge-info badge-xs text-[8px] font-bold ">NEW</span>
      {/if}
      {#if isRecent(exercice.dateDeModifImportante)}
        <span class="badge badge-secondary dark:badge-info badge-xs text-[8px] font-bold">MAJ</span>
      {/if}
    </div>
  </div>
  <!-- {#if selectedCount >= 1} -->
  <button
    type="button"
    class="absolute {selectedCount >= 1 ? 'block' : 'hidden'} -left-4"
    on:mouseover={handleMouseOver}
    on:focus={handleMouseOver}
    on:mouseout={handleMouseOut}
    on:blur={handleMouseOut}
    on:click={removeFromList}
    on:keydown={removeFromList}><i class="text-coopmaths-action-light dark:text-coopmathsdark-action-light text-base bx {icon} {rotation}" /></button
  >
  <!-- {/if} -->
  {#if selectedCount >= 2 && mouseIsOut}
    <div class="absolute -left-[12.5px] text-[0.6rem] font-bold text-coopmaths-canvas dark:text-coopmathsdark-canvas-dark">{selectedCount}</div>
  {/if}
</div>
