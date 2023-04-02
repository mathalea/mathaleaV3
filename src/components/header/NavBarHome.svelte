<script lang="ts">
  import { MathaleaHandleComponentChange } from "/src/lib/Mathalea"
  import { globalOptions, darkMode } from "../store"
  import NavBarMenuV2 from "./NavBarMenuV2.svelte"

  let isNavMenuVisible: boolean = false
  let y: number
  const menus = {
    statiques: {
      titre: "Statiques",
      id: "statiques",
      entrees: ["Sixième", "Cinquième", "Quatrième", "Troisième", "Seconde", "CRPE", "Calcul Mental"],
      actions: [
        "https://coopmaths.fr/6e",
        "https://coopmaths.fr/5e",
        "https://coopmaths.fr/4e",
        "https://coopmaths.fr/3e",
        "https://coopmaths.fr/2e",
        "https://coopmaths.fr/crpe",
        "https://coopmaths.fr/calculmental/",
      ],
      isMenuOpen: false,
    },
    documentations: {
      titre: "Documentations",
      id: "documentations",
      entrees: ["Utiliser MathALÉA", "Programmer des figures géométriques", "Animations avec des instruments de géométrie", "Documentation pour les développeurs"],
      actions: ["https://coopmaths.fr/mathalea_tuto/", "https://coopmaths.fr/docMathalea2d/presentation/", "https://coopmaths.fr/docMathalea2d/InstrumEnPoche/", "https://coopmaths.fr/documentation"],
      isMenuOpen: false,
    },
    outils: {
      titre: "Outils",
      id: "outils",
      entrees: ["Programmation de figures géométriques", "Animations avec des instruments de géométrie", "Divers"],
      actions: ["https://coopmaths.fr/mathalea2d.html", "https://coopmaths.fr/mathalea2iep.html", "https://coopmaths.fr/mathalea.html?filtre=outils"],
      isMenuOpen: false,
    },
    aPropos: {
      titre: "À Propos",
      id: "apropos",
      entrees: ["Objectifs généraux", "Présentation du logiciel", "Nous contacter"],
      actions: ["https://coopmaths.fr/a_propos", "https://coopmaths.fr/mathalea_a_propos/", "mailto:contact@coopmaths.fr"],
      isMenuOpen: false,
    },
  }

  function goToMathalea() {
    MathaleaHandleComponentChange("home", "")
  }
</script>

<svelte:window bind:scrollY={y} />
<header class="fixed w-full flex items-center px-4 md:px-12 {y < 370 ? 'h-32' : 'h-24'} transition-all duration-300 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
  <div class="flex w-full flex-row justify-between items-center md:flex-col md:justify-start md:items-start xl:flex-row xl:justify-between">
    <!-- logo -->
    <div
      class="block p-2 text-5xl md:text-6xl xl:text-7xl font-logo13Condensed font-black text-coopmaths-struct dark:text-coopmathsdark-struct {y > 370 || isNavMenuVisible
        ? 'opacity-100'
        : 'opacity-0'} transition-all duration-300"
    >
      Coopmaths
    </div>
    <!-- navbar -->
    <nav>
      <div class="flex flex-row md:flex-row-reverse justify-end md:items-center xl:mt-8 space-x-2">
        <button
          class="md:hidden text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest font-bold"
          on:click={() => {
            isNavMenuVisible = !isNavMenuVisible
          }}
        >
          <i class="bx bx-md bx-menu" />
        </button>
        <ul
          class="
        fixed left-0 right-0 min-h-screen p-6  space-y-4
        bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-coopmaths-struct dark:border-coopmathsdark-struct
        transform {isNavMenuVisible ? 'translate-x-0' : 'translate-x-full'} translate-y-16 transition duration-300
        md:relative md:flex md:min-h-0 md:space-y-0 md:space-x-8 md:p-0 md:translate-x-0 md:pr-8 md:pt-4 xl:pt-0 xl:border-r-[1px] xl:border-coopmaths-struct md:translate-y-0"
        >
          <li>
            <div
              class="block text-xl xl:text-2xl font-semibold bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer"
              on:click={goToMathalea}
              on:keydown={goToMathalea}
            >
              MathALÉA
            </div>
          </li>
          <li>
            <NavBarMenuV2 {...menus.statiques} classAddendaForTitle="text-xl xl:text-2xl font-semibold" />
          </li>
          <!-- <li>
            <a
              href={"https://coopmaths.fr/calculmental/"}
              class=" block text-xl xl:text-2xl font-semibold bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
              >Calcul mental</a
            >
          </li> -->
          <li>
            <NavBarMenuV2 {...menus.outils} classAddendaForTitle="text-xl xl:text-2xl font-semibold" />
          </li>
          <li>
            <NavBarMenuV2 {...menus.documentations} classAddendaForTitle="text-xl xl:text-2xl font-semibold" />
          </li>
          <!-- <li>
            <NavBarMenuV2 {...menus.aPropos} classAddendaForTitle="text-xl xl:text-2xl font-semibold" />
          </li> -->
        </ul>
      </div>
    </nav>
  </div>

  <label class="swap swap-rotate md:pl-6 md:pt-4 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest">
    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" class="invisible" bind:checked={$darkMode.isActive} />
    <!-- sun icon -->
    <div class="swap-on"><i class="bx bx-md bx-sun" /></div>
    <!-- moon icon -->
    <div class="swap-off"><i class="bx bx-md bx-moon" /></div>
  </label>
</header>

<style></style>
