<script>
  import { globalOptions } from "../store"

  import NavBarMenu from "./NavBarMenu.svelte"
  let isNavBarVisible = false
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
          document.location.href = urlV2("latex")
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
</script>

<nav class="bg-coopmaths-backnav z-50">
  <!-- container -->
  <div class="flex flex-wrap w-full mx-auto lg:space-x-6 lg:items-center">
    <!-- bouton menu -->
    <div class="flex flex-row justify-start space-x-2">
      <button class=" lg:hidden inline-flex ml-auto items-center justify-center text-coopmaths-titlelight font-bold text-xl" on:click={() => (isNavBarVisible = !isNavBarVisible)}>
        <i class="bx bx-menu" />
      </button>
      <!-- logo -->
      <a href={"#"} class="inline-flex p-2 text-2xl font-logo6 text-coopmaths-titlelight uppercase tracking-wider">Coopmaths</a>
    </div>
    <!-- menu -->
    <div class="flex flex-col mt-2 lg:inline-flex lg:grow lg:flex-row lg:mt-0 {isNavBarVisible ? 'flex' : 'hidden'}">
      <ul class="flex flex-col space-y-2 lg:flex-row lg:space-y-0">
        <li>
          <NavBarMenu {...menus.referentiels} bind:isNavBarVisible />
        </li>
        <li>
          <a
            href={"https://coopmaths.fr/calculmental/"}
            class="bg-coopmaths-backnav hover:bg-coopmaths-backnavlight text-coopmaths-titlelight text-xl font-extrabold relative block py-6 px-2 lg:p-6 items-center">Calcul mental</a
          >
        </li>
        <li>
          <NavBarMenu {...menus.professeurs} bind:isNavBarVisible />
        </li>
        <li>
          <NavBarMenu {...menus.aPropos} bind:isNavBarVisible />
        </li>
      </ul>
      <div class="flex flex-1 pt-6 lg:pt-0 items-center justify-start lg:justify-end">
        <NavBarMenu {...menus.export} bind:isNavBarVisible />
      </div>
    </div>
  </div>
</nav>

<style></style>
