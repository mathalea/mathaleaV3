<script lang="ts">
  export let titles: string[] = ['', '']
  export let value: boolean = true
  export let isDisabled: boolean = false

  function toggle() {
    value = !value
  }

</script>

<!-- 
  @component
  Bouton toogle avec deux états

  __Paramètres__ :

  * `titles` : tableau pour le titre du boutons (un pour `true`, un pour `false`)
  * `value`: booléen lié au bouton
  * `isDisabled`: booléen servant à désactiver le bouton
  
  Usage:
    ```tsx
  <ButtonToggle 
      titles={['Titre pour true', 'Titre pour false']} 
      bind:value={maVariable} 
      isDisabled={variable2 === 0} 
      on:click={maFonction}
  />
  ```
 -->
<div class="flex flex-row justify-start items-center">
  <button type="button" on:click={toggle} disabled={isDisabled}>
    <i
      class="mt-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm {value
        ? 'bx-toggle-right'
        : 'bx-toggle-left'}
        {isDisabled ? 'text-opacity-10' : ''}"
        on:click
        on:keydown
    />
  </button>
  <div
    class="pl-2 inline-block text-sm font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus {isDisabled
      ? 'text-opacity-10'
      : 'text-opacity-70'}"
  >
    {value ? titles[0] : titles[1]}
  </div>
</div>
