<script lang="ts">
  import SearchById from "./SearchById.svelte"
  import { globalOptions, exercicesParams } from "../store"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
  export let sideMenuVisible: boolean
  let isListVisible: boolean
  function toggleSideList() {
    if ($exercicesParams.length > 0) {
      isListVisible = !sideMenuVisible
      dispatch("sideMenuChange", {
        isListVisible,
      })
    }
  }

  function fullScreen() {
    globalOptions.update((params) => {
      params.v = "l"
      return params
    })
  }
</script>

<h1 class="py-2 px-4 text-coopmaths-titlelight text-2xl font-bold  bg-coopmaths-backnavlight flex items-center">
  <button type="button" on:click={toggleSideList}><i class="bx bx-menu-alt-left" /></button>
  <div class="inline-flex justify-between items-center text-coopmaths-title font-normal text-xs ml-8 w-15 max-h-15 w-full">
    <SearchById />
    <button
      type="button"
      on:click={() => {
        $exercicesParams.length = 0
      }}><i class="bx text-coopmaths-titlelight bx-sm bx-trash" /></button
    >
  </div>
</h1>
