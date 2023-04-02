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
<div class="w-full group inline-block relative">
  <button
    class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas  text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest {classAddendaForTitle}"
    on:click={() => {
      isMenuOpen = !isMenuOpen
    }}
  >
    <span class="mr-0">{titre}</span>
    <!-- <i class="bx bx-chevron-down" /> -->
  </button>
  <ul class="relative md:absolute md:bottom-0 md:translate-y-[100%] {isMenuOpen ? '' : 'hidden'} md:group-hover:block md:z-10 md:pt-4">
    {#each entrees as entree, i}
      <li>
        <a
          class="w-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas hover:bg-coopmaths-canvas-dark dark:hover:bg-coopmathsdark-canvas-dark text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest py-1 px-4 block whitespace-no-wrap font-base text-base cursor-pointer md:shadow-lg dark:shadow-coopmathsdark-canvas-dark"
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
