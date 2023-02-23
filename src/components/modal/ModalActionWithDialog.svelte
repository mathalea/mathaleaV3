<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let message: string = ""
  export let id = "dialogbox"
  const dispatch = createEventDispatcher()

  function fireMessage() {
    dispatch("display")
  }
</script>

<div class="tooltip tooltip-bottom tooltip-neutral" data-tip="Lien du diaporama">
  <button
    type="button"
    class="mr-4 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
    on:click={fireMessage}
  >
    <i class="bx text-2xl bx-link" />
  </button>
  <dialog class="rounded-xl bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light" {id}>
    {message}
  </dialog>
</div>
