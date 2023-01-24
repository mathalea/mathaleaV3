<script lang="ts">
  import { exercicesParams } from "../store"
  export let text = ""
  export let indice: number

  function remove() {
    exercicesParams.update((l) => [...l.slice(0, indice), ...l.slice(indice + 1)])
  }
</script>

<div class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-backdark text-coopmaths-title text-xs px-1 py-[1px] shadow-sm">
  {text}
  <button class="ml-2 bg-transparent hover focus:outline-none cursor-pointer" on:click={remove}>
    <i class="bx bx-x font-semibold text-base" />
  </button>
</div>
