<script lang="ts">
  import { typeOf } from "mathjs"
  export let entrees: string[]
  export let actions = []
  export let isMenuOpen: boolean
  export let titre: string
  export let id: string
  export let isNavBarVisible: boolean
  export let classAddendaForTitle: string = "text-xl font-semibold relative flex lg:block py-6 px-2 lg:px-8 items-center"

  function handleClickOnEntry(i) {
    isMenuOpen = false
    isNavBarVisible = false
    if (typeOf(actions[i]) === "string") {
      window.location.href = actions[i]
    } else {
      actions[i]()
    }
  }
</script>

<!-- Source pour les menus déroulants au survol :
https://codesandbox.io/s/tailwind-dropdown-with-group-hover-gm9k9?file=/tailwind.config.js:45-74
 -->
<div class="group inline-block relative">
  <button
    class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas  text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest {classAddendaForTitle}"
  >
    <span class="mr-0">{titre}</span>
    <!-- <i class="bx bx-chevron-down" /> -->
  </button>
  <ul class="absolute bottom-0 translate-y-[100%] hidden group-hover:block z-10">
    {#each entrees as entree, i}
      <li>
        <a
          class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas-dark dark:hover:bg-coopmathsdark-canvas-darkest text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest py-1 px-4 block whitespace-no-wrap font-base text-base cursor-pointer shadow-lg"
          id={[id, "-entree-", i + 1].join("")}
          on:click={() => handleClickOnEntry(i)}
          on:keydown={() => handleClickOnEntry(i)}
        >
          {entree}
        </a>
      </li>
    {/each}
  </ul>
</div>
