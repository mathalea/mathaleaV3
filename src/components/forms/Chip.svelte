<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let text = ""
  export let bgColor:
    | "canvas"
    | "canvas-light"
    | "canvas`lightest"
    | "warn"
    | "warn-light"
    | "warn-lightest"
    | "corpus"
    | "corpus-light"
    | "corpus-lightest"
    | "struct"
    | "struct-ligh"
    | "struct-lightest" = "warn"
  export let textColor:
    | "canvas"
    | "canvas-light"
    | "canvas`lightest"
    | "warn"
    | "warn-light"
    | "warn-lightest"
    | "corpus"
    | "corpus-light"
    | "corpus-lightest"
    | "struct"
    | "struct-ligh"
    | "struct-lightest" = "corpus"
  export let isVisible: boolean = true

  // Au clic sur le bouton, on diffuse _action_
  const dispatch = createEventDispatcher()

  function triggerAction() {
    dispatch("action", {
      msg: "Action triggered !",
    })
  }
</script>

<div
  class="{isVisible
    ? 'inline-flex'
    : 'hidden'} flex-wrap scale-75 ml-1 items-center justify-center rounded-full bg-coopmaths-{bgColor} dark:bg-coopmathsdark-{bgColor} text-coopmaths-{textColor} dark:text-coopmathsdark-{textColor} text-xs px-2 py-[1px] shadow-sm"
>
  {text}
  <button class="ml-1 bg-transparent hover focus:outline-none cursor-pointer" on:click={triggerAction}>
    <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-x font-semibold text-base" />
  </button>
</div>
