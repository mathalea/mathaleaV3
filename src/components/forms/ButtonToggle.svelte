<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let titles = ['', '']
  export let value = true

  function toggle() {
    value = !value
  }

  const dispatch = createEventDispatcher();
  $: dispatch("click", { value });
</script>
<!-- 
  @component
  Bouton toogle avec deux états
  
  Usage:
    ```tsx
  <ButtonToggle titles={['Titre pour true', 'Titre pour false']} bind:value={maVariable} on:click={maFonction}/>
  ```
 -->
<button type="button" on:click={toggle}>
  <i
    class="mt-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm {value
      ? 'bx-toggle-right'
      : 'bx-toggle-left'}"
  />
</button>
<div class="inline-flex pl-2">{value ? titles[0] : titles[1]}</div>
