<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import Button from "../forms/Button.svelte"

  export let modalId: string = "my-modal"
  export let buttonId: string = "ok-btn"
  export let buttonTitle: string = "OK"
  export let icon: string = "bx-error"

  // Au clic sur le bouton, on diffuse _action_
  const dispatch = createEventDispatcher()

  function triggerAction() {
    dispatch("action", {
      msg: "Action triggered !",
    })
  }
</script>

<div class="fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id={modalId}>
  <!-- 
  <slot name="header" />
  <slot name="content" /> -->
  <!--modal content-->
  <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-coopmaths-canvas">
    <div class="mt-3 text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-coopmaths-warn-100">
        <div class="h-6 w-6 text-coopmaths-warn-darkest"><i class="bx bx-sm {icon}" /></div>
      </div>
      <div class="text-3xl pt-4 leading-6 font-medium text-coopmaths-warn-dark">
        <slot name="header">
          <span>Successful!</span>
        </slot>
      </div>
      <div class="mt-2 px-7 py-3">
        <div class="text-sm text-coopmaths-corpus-light">
          <slot name="content">
            <span>Account has been successfully registered!</span>
          </slot>
        </div>
      </div>
      <div class="items-center px-4 py-3">
        <Button title={buttonTitle} idLabel={buttonId} on:click={triggerAction} />
      </div>
    </div>
  </div>
</div>
