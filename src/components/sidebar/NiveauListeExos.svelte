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
  const themes = toMap(themesList)
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
  - **nestedLevelCount** : compteur pour connaître le nombre d'imbrication (utilisé pour l'indentation de la ligne)
 -->
<div
  class="flex flex-row items-center justify-between {expanded
    ? 'bg-gray-300'
    : 'bg-gray-200'} font-bold text-coopmaths  hover:bg-gray-100 hover:text-coopmaths-light cursor-pointer pl-{nestedLevelCount * 2}"
  on:click={toggleContent}
>
  <div class="text-base ">{levelTitle} <span class="font-normal">{themeTitle(levelTitle)}</span></div>
  <i class=" text-xl bg-transparent bx {expanded ? 'bx-plus rotate-[225deg]' : 'bx-plus'} transition-transform duration-500 ease-in-out" />
</div>
{#if expanded}
  <ul transition:slide={{ duration: 500 }}>
    {#each Array.from(items, ([key, obj]) => ({ key, obj })) as item}
      <li>
        {#if item.obj.has('uuid')}
          <EntreeListeExos nestedLevelCount={nestedLevelCount + 1} exo={item.obj} />
        {:else}
          <svelte:self nestedLevelCount={nestedLevelCount + 1} pathToThisNode={[...pathToThisNode, item.key]} levelTitle={item.key} items={item.obj} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
