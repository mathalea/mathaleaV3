<script lang="ts">
  export let title: string = "Valider"
  export let isDisabled: boolean = false
  export let classDeclaration: string = "p-2 rounded-xl"
  export let icon: string = ""
</script>

<!-- 
  @component
  Bouton 

  __Paramètres__ :

  * `title` :  titre du bouton
  * `isDisabled`: booléen servant à désactiver le bouton
  * `classDeclaration`: chaîne contrôlant le style du bouton (hormis les propriétés _text_ et _bg_)
  
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
