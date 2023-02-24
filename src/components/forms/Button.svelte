<script>
    export let title = 'Valider'
</script>
<!-- 
  @component
  Bouton 
  
  Usage:
    ```tsx
  <Button title="Titre" on:click={maFonction}/>
  ```
 -->
<button
  type="button"
  class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
  on:click
>
  {title}
</button>
