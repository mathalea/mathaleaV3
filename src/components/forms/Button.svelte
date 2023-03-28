<script lang="ts">
  import { getUniqueStringBasedOnTimeStamp } from "../utils/time"
  export let title: string = "Valider"
  export let isDisabled: boolean = false
  export let classDeclaration: string = "p-2 rounded-xl"
  export let icon: string = ""
  export let idLabel: string = getUniqueStringBasedOnTimeStamp("btn-")
</script>

<!-- 
  @component
  Bouton 

  __Paramètres__ :

  * `title` :  titre du bouton (si vide, une icône de Boxicons est affiché à la place, à reseingner dans `icon`)
  * `isDisabled`: booléen servant à désactiver le bouton
  * `classDeclaration`: chaîne contrôlant le style du bouton (hormis les propriétés _text_ et _bg_)
  * `icon` : nom de l'icône de [Boxicons](https://boxicons.com/?query=)
  * `idLabel` : id pour le bouton (si non renseigné, une ID est construite sur la base d'un time stamp)
  
  __Exemple__:

    ```tsx
  <Button 
      title="Titre" 
      on:click={maFonction} 
      isDisabled={maVariable === 0}
  />
  ```
 -->

{#if title.length === 0}
  <button
    type="button"
    id={idLabel}
    class="{classDeclaration} text-coopmaths-action  dark:text-coopmathsdark-action 
      {isDisabled ? ' text-opacity-10 dark:text-opacity-10' : 'hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'}"
    disabled={isDisabled}
    on:click
  >
    <i class="bx {icon}" />
  </button>
{:else}
  <button
    type="button"
    id={idLabel}
    class=" {classDeclaration} text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action dark:bg-coopmathsdark-action
      {isDisabled ? ' dark:bg-coopmathsdark-action bg-opacity-10 dark:bg-opacity-10' : ' hover:bg-coopmaths-action-lightest dark:hover:bg-coopmathsdark-action-lightest'}"
    disabled={isDisabled}
    on:click
  >
    {#if icon !== ""}
      <i class="bx {icon}" />
    {/if}
    {title}
  </button>
{/if}
