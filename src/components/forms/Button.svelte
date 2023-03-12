<script lang="ts">
  export let title: string = "Valider"
  export let isDisabled: boolean = false
  export let classDeclaration: string = "p-2 rounded-xl"
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
<button
  type="button"
  class=" {classDeclaration} {isDisabled
    ? 'text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action dark:bg-coopmathsdark-action bg-opacity-10 dark:bg-opacity-10'
    : 'text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest'}"
  disabled={isDisabled}
  on:click
>
  {title}
</button>
