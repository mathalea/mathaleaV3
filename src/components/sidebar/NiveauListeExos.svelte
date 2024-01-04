<script lang="ts">
  import { slide } from "svelte/transition"
  import EntreeListeExos from "./EntreeListeExos.svelte"
  import { toMap } from "../utils/toMap"

  export let expanded: boolean = false
  export let levelTitle: string
  export let items: Map<string, Map<string, any>>
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
    //const item = Array.from(items, ([key, obj]) => ({ key, obj }))
    //console.log(items.size)
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
  - **nestedLevelCount** : compteur pour connaître le nombre d'imbrication (utilisé pour l'indentation de la ligne) class="pl-{nestedLevelCount * 2}"
 -->
<div
  class="flex flex-row items-center justify-between {expanded
    ? 'bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest'
    : 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'} font-bold text-coopmaths-action dark:text-coopmathsdark-action hover:bg-coopmaths-canvas-darkest dark:hover:bg-coopmathsdark-canvas-darkest cursor-pointer"
  style="padding-left: {(nestedLevelCount * 2) / 4}rem"
  on:click={toggleContent}
  on:keydown={toggleContent}
>
  <div class="text-base">{levelTitle} <span class="font-normal">{themeTitle(levelTitle)}</span></div>
  <i class=" text-xl bg-transparent bx {expanded ? 'bx-plus rotate-[225deg]' : 'bx-plus'} transition-transform duration-500 ease-in-out" />
</div>
{#if expanded}
  {#if levelTitle === "Nouveautés" && Array.from(items, ([key, obj]) => ({ key, obj })).length === 0}
    <div class="flex flex-row p-2 justify-start items-center">
      <span class="font-light italic text-sm">Pas de publication ou de modification récente.</span>
    </div>
  {/if}
  <ul transition:slide={{ duration: 500 }}>
    {#each Array.from(items, ([key, obj]) => ({ key, obj })) as item}
      <li>
        {#if item.obj.has("uuid")}
          <EntreeListeExos nestedLevelCount={nestedLevelCount + 1} exercice={item.obj} />
        {:else}
          <svelte:self nestedLevelCount={nestedLevelCount + 1} pathToThisNode={[...pathToThisNode, item.key]} expanded levelTitle={item.key} items={item.obj} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
