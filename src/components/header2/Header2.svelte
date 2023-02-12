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

<h1 class="py-2 px-4  text-2xl font-bold  bg-coopmaths-canvas flex items-center">
  <button type="button" class="text-coopmaths-action hover:text-coopmaths-action-lightest" on:click={toggleSideList}><i class="bx bx-menu-alt-left" /></button>
  <div class="inline-flex justify-between items-center text-coopmaths-corpus-light font-normal text-xs ml-8 w-15 max-h-15 w-full">
    <SearchById />
  </div>
</h1>
