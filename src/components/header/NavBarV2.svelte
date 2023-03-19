<script>
  import { globalOptions, darkMode } from "../store"
  import { handleComponentChange } from "../utils/navigation"

  import NavBarMenuV2 from "./NavBarMenuV2.svelte"
  let isNavBarVisible = false
  export let title = "MathALÉA"
  export let subtitle = ""
  const menus = {
    referentiels: {
      titre: "Classes",
      id: "classes",
      entrees: ["Sixième", "Cinquième", "Quatrième", "Troisième", "Seconde", "CRPE"],
      actions: ["https://coopmaths.fr/6e", "https://coopmaths.fr/5e", "https://coopmaths.fr/4e", "https://coopmaths.fr/3e", "https://coopmaths.fr/2e", "https://coopmaths.fr/crpe"],
      isMenuOpen: false,
    },
    professeurs: {
      titre: "Professeurs",
      id: "professeurs",
      entrees: [
        "Exercices en ligne",
        "Comment utiliser MathALEA",
        "Générateur LaTeX/PDF",
        "Export vers Moodle",
        "Programmation de figures géométriques",
        "Animations avec des instruments de géométrie",
        "Outils",
      ],
      actions: [
        "/",
        "https://coopmaths.fr/mathalea_tuto/",
        () => {
          document.location.href = urlV2("latex")
        },
        () => {
          document.location.href = urlV2("moodle")
        },
        "https://coopmaths.fr/mathalea2d.html",
        "https://coopmaths.fr/mathalea2iep.html",
        "https://coopmaths.fr/mathalea.html?filtre=outils",
      ],
      isMenuOpen: false,
    },
    aPropos: {
      titre: "À Propos",
      id: "apropos",
      entrees: ["Objectifs généraux", "Présentation du logiciel", "Nous contacter", "Documentation pour les développeurs"],
      actions: ["https://coopmaths.fr/a_propos", "https://coopmaths.fr/mathalea_a_propos/", "mailto:contact@coopmaths.fr", "https://coopmaths.fr/documentation"],
      isMenuOpen: false,
    },
    export: {
      titre: "Export",
      id: "export",
      entrees: ["Plein écran", "Plein écran élève", "Diaporama", "Lien", "LaTeX", "Moodle", "AMC"],
      actions: [
        () =>
          globalOptions.update((params) => {
            params.v = "l"
            return params
          }),
        () =>
          globalOptions.update((params) => {
            params.v = "eleve"
            return params
          }),
        () =>
          globalOptions.update((params) => {
            params.v = "diaporama"
            return params
          }), // () => {document.location.href = urlV2('diap')},
        () => {
          alert("Non disponible")
        },
        () => {
          globalOptions.update((params) => {
            params.v = "latex"
            return params
          })
        },
        () => {
          document.location.href = urlV2("moodle")
        },
        () => {
          document.location.href = urlV2("amc")
        },
      ],
      isMenuOpen: false,
    },
  }

  function urlV2(vue) {
    const params = new URLSearchParams(document.location.search)
    if (vue) params.set("v", vue)
    params.delete("uuid")
    return ("https://coopmaths.fr/mathalea.html?" + params.toString()).replaceAll("id=", "ex=").replaceAll("&s", ",s").replaceAll("&n", ",n")
  }

  function goToMathalea() {
    handleComponentChange("latex", "")
  }
</script>

<nav class="p-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas z-50">
  <!-- container -->
  <div class="flex flex-row justify-between w-full mx-auto lg:space-x-6 lg:items-center">
    <!-- bouton menu -->
    <div class="flex flex-row justify-start space-x-2">
      <!-- logo -->
      <div class="relative">
        <div
          on:click={goToMathalea}
          on:keydown={goToMathalea}
          class="inline-flex cursor-pointer text-6xl font-logo13Condensed font-black text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
        >
          {title}
        </div>
        <div class="absolute -bottom-4 right-0 font-logo13Condensed font-normal text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus">
          par <a
            href="https://coopmaths.fr"
            target="_blank"
            rel="noreferrer"
            class="font-extrabold text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest">CoopMaths</a
          >
        </div>
      </div>
      {#if subtitle}
        <div class="inline-flex text-6xl font-logo13Condensed">
          <div class="px-4 font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"><i class="bx bx-export bx-rotate-90" /></div>
          <div class=" font-black text-coopmaths-struct dark:text-coopmathsdark-struct">{subtitle}</div>
        </div>
      {/if}
    </div>
    <div class="flex px-4">
      <label class="swap swap-rotate text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest">
        <!-- this hidden checkbox controls the state -->
        <input type="checkbox" class="invisible" bind:checked={$darkMode.isActive} />
        <!-- sun icon -->
        <div class="swap-on"><i class="bx bx-sm bx-sun" /></div>
        <!-- moon icon -->
        <div class="swap-off"><i class="bx bx-sm bx-moon" /></div>
      </label>
    </div>
  </div>
</nav>

<style></style>
