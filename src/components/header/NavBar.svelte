<script>
import { displayOptions } from "../store";

  import NavBarMenu from "./NavBarMenu.svelte"
  let isNavBarVisible = false
  const menus = {
    referentiels: {
      titre: "Référentiels",
      id: "referentiels",
      entrees: ["Sixième", "Cinquième", "Quatrième", "Troisième", "Seconde", "CRPE"],
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
        "Scores des éleves",
      ],
      isMenuOpen: false,
    },
    aPropos: {
      titre: "À Propos",
      id: "apropos",
      entrees: ["Objectifs généraux", "Présentation du logiciel", "Nous contacter", "Documentation pour les développeurs"],
      isMenuOpen: false,
    },
    export: {
      titre: "Export",
      id: "export",
      entrees: ["Plein écran", "Diaporama", "Lien", "LaTeX", "Moodle", "AMC"],
      actions: [() => displayOptions.update(params => {params.v = "l"; return params}),
      () => {document.location.href = urlV2('diap')},
      () => {alert("Non disponible")},
      () => {document.location.href = urlV2('latex')},
      () => {document.location.href = urlV2('moodle')},
      () => {document.location.href = urlV2('amc')},
    ],
      isMenuOpen: false,
    },
  }

  function urlV2(vue) {
    const params = new URLSearchParams(document.location.search)
    if (vue) params.set('v', vue)
    params.delete('uuid')
    return ('https://coopmaths.fr/mathalea.html?' + params.toString()).replaceAll('id=', 'ex=').replaceAll('&s', ',s').replaceAll('&n', ',n')
  }
</script>

<nav class="bg-coopmaths z-50">
  <!-- container -->
  <div class="flex flex-wrap w-full mx-auto lg:space-x-6 lg:items-center">
    <!-- bouton menu -->
    <div class="flex flex-row justify-start space-x-2">
      <button class=" lg:hidden inline-flex ml-auto items-center justify-center text-white font-bold text-xl" on:click={() => (isNavBarVisible = !isNavBarVisible)}>
        <i class="bx bx-menu" />
      </button>
      <!-- logo -->
      <a href={"#"} class="inline-flex p-2 text-2xl font-extrabold text-white uppercase tracking-wider">Coopmaths</a>
    </div>
    <!-- menu -->
    <div class="flex flex-col mt-2 lg:inline-flex lg:grow lg:flex-row lg:mt-0 {isNavBarVisible ? 'flex' : 'hidden'}">
      <ul class="flex flex-col space-y-2 lg:flex-row lg:space-y-0">
        <li>
          <NavBarMenu {...menus.referentiels} bind:isNavBarVisible />
        </li>
        <li>
          <a href={"#"} class="bg-coopmaths hover:bg-coopmaths-light text-white text-xl font-extrabold relative block py-6 px-2 lg:p-6 items-center">Calcul mental</a>
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
