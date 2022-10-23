<script lang="ts">
import { typeOf } from "mathjs";


  export let entrees: string[]
  export let actions = []
  export let isMenuOpen: boolean
  export let titre: string
  export let id: string
  export let isNavBarVisible: boolean

  /** Dispatch event on click outside of node
   * Référence : https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
   */
  function clickOutside(node) {
    const handleClick = (event) => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(new CustomEvent("click_outside", node))
      }
    }

    document.addEventListener("click", handleClick, true)

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true)
      },
    }
  }
  function closeMenu(i) {
    isMenuOpen = false
    isNavBarVisible = false
    if(typeOf (actions[i]) === 'string') {
      window.location.href = actions[i]
    } else {
      actions[i]()
    }
  }
  function handleClickOutside() {
    isMenuOpen = false
  }
</script>

<div class="group inline-block relative" use:clickOutside on:click_outside={handleClickOutside}>
  <button class="bg-coopmaths hover:bg-coopmaths-light  text-white text-xl font-extrabold relative flex lg:block py-6 px-2 lg:px-8 items-center" {id} on:click={() => (isMenuOpen = !isMenuOpen)} on:keydown={() => (isMenuOpen = !isMenuOpen)}>
    <span>{titre}<i class="ml-2 bx {isMenuOpen ? 'bx-caret-down lg:hidden' : 'bx-caret-right lg:hidden'}" /></span>
  </button>
  <ul class="lg:absolute right-0 {isMenuOpen ? 'block' : 'hidden'} text-white w-56 filter drop-shadow-xl z-50">
    {#each entrees as entree, i}
      <li>
        <a class="bg-coopmaths hover:bg-coopmaths-light py-2 px-4 block whitespace-no-wrap" id={[id, "-entree-", i + 1].join("")} on:click={() => closeMenu(i)} on:keydown={() => closeMenu(i)}>{entree}</a>
      </li>
    {/each}
  </ul>
</div>
