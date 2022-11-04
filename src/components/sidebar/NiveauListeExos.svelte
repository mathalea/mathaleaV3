<script lang="ts">
  import { slide } from "svelte/transition"
  import EntreeListeExos from "./EntreeListeExos.svelte"
  import { toMap } from "../utils/toMap"

  export let expanded: boolean = false
  export let levelTitle: string
  export let items: any
  export let pathToThisNode: string[]
  export let nestedLevelCount: number
  import themesList from "../../json/levelsThemesList.json"
  import { Mathalea } from "../../Mathalea"

  const themes = toMap(themesList)
  let listeExercices: HTMLUListElement
  /**
   * Recherche dans la liste des thèmes si le thème est référencé
   * et si oui, renvoie son intitulé
   * @param {string} themeCode code du thème
   * @return {string} intitulédu thème
   * @author Sylvain Chambon & Rémi Angot
   */
  function themeTitle(themeCode: string) {
    if (themes.has(themeCode)) {
      return [" : ", themes.get(themeCode).get("titre")].join("")
    } else {
      return ""
    }
  }

  /**
   * Basculer le flag pour l'affichage du contenu
   */
  function toggleContent() {
    const item = Array.from(items, ([key, obj]) => ({ key, obj }))
    expanded = !expanded
  }

  $: {
    if (listeExercices) Mathalea.renderDiv(listeExercices)
  } 
</script>

<!-- 
  @component
  Écrire la liste des exercices disponibles 
  à partir des entrées de l'arbre du référentiel 
  convertion du fichier `referentiel2022.json`.

  Paramètres :
  - **expanded** : booléen indiquant si le contenu du niveau est affiché ou pas
  - **levelTitle** : titre du niveau
  - **items** : entrées du contenu du niveau
  - **pathToThisNode** : chemin amenant à ce niveau
  - **nestedLevelCount** : compteur pour connaître le nombre d'imbrication (utilisé pour l'indentation de la ligne) class="pl-{nestedLevelCount * 2}"
 -->
<div
  class="flex flex-row items-center justify-between {expanded ? 'bg-gray-300' : 'bg-gray-200'} font-bold text-coopmaths  hover:bg-gray-100 hover:text-coopmaths-light cursor-pointer"
  style="padding-left: {(nestedLevelCount * 2) / 4}rem"
  on:click={toggleContent} on:keydown={toggleContent}
>
  <div class="text-base">{levelTitle} <span class="font-normal">{themeTitle(levelTitle)}</span></div>
  <i class=" text-xl bg-transparent bx {expanded ? 'bx-plus rotate-[225deg]' : 'bx-plus'} transition-transform duration-500 ease-in-out" />
</div>
{#if expanded}
  <ul transition:slide={{ duration: 500 }} bind:this={listeExercices}>
    {#each Array.from(items, ([key, obj]) => ({ key, obj })) as item}
      <li>
        {#if item.obj.has("uuid")}
          <EntreeListeExos nestedLevelCount={nestedLevelCount + 1} exercice={item.obj} />
        {:else}
          <svelte:self nestedLevelCount={nestedLevelCount + 1} pathToThisNode={[...pathToThisNode, item.key]} levelTitle={item.key} items={item.obj} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
