<script lang="ts">
  import Exercice from "./exercice/Exercice.svelte"
  import NavBar from "./header/NavBar.svelte"
  import Footer from "./Footer.svelte"
  import Header2 from "./header2/Header2.svelte"
  import NiveauListeExos from "./sidebar/NiveauListeExos.svelte"
  import { listeExercices, displayOptions } from "./store"
  import codeList from "../json/codeToLevelList.json"
  import referentiel from "../json/referentiel2022.json"
  import { Mathalea } from "../Mathalea"
  import { flip } from "svelte/animate"
  import { onMount } from "svelte"
  import { toMap } from "./utils/toMap"
  import { ElementButtonInstrumenpoche, ElementInstrumenpoche } from '../modules/ElementInstrumenpoche'

  import { context } from '../modules/context'
  import SearchExercice from "./sidebar/SearchExercice.svelte"

  context.versionMathalea = 3

  customElements.define('alea-instrumenpoche', ElementInstrumenpoche)
  customElements.define('alea-buttoninstrumenpoche', ElementButtonInstrumenpoche)

  let isNavBarVisible = true

  // ToFix fonction à lier avec bugsnag
  window.notify = (arg) => console.log(arg)

  // Récupération des informations de l'URL
  let isInitialUrlHandled = false
  onMount(() => {
    const urlOptions = Mathalea.loadExercicesFromUrl()
    displayOptions.update( () => { return urlOptions })
    isInitialUrlHandled = true
  })

  // Mise à jour de l'URL dès que l'on change listeExercices (sauf pour l'URL d'arrivée sur la page)
  $: {
    if (isInitialUrlHandled) Mathalea.updateUrl($listeExercices)
    if ($displayOptions.v === 'l') {
      isSideMenuVisible = false
      isNavBarVisible = false
    } else if ($displayOptions.v === 'l2') {
      isSideMenuVisible = false
      isNavBarVisible = true
    } else {
      isSideMenuVisible = true
      isNavBarVisible = true
    }
  }

  let refTree: Map = toMap(referentiel)
  
  /**
   * Retrouve le titre d'un niveau basé sur son
   * @param levelId
   */
  function codeToLevelTitle(code: string) {
    if (codeList[code]) {
      return codeList[code]
    } else {
      return code
    }
  }

  /*---------------------------------------------------------------------
    Gestion du menu de recherche des exercices
  ---------------------------------------------------------------------*/
  let nbExercisesInList: number
  let isSideMenuVisible: boolean = false
  $: {
    nbExercisesInList = $listeExercices.length
    if (nbExercisesInList === 0) {
      isSideMenuVisible = true
      isNavBarVisible = true
    }
  }
  const searchOptions = [
    {
      value: "list",
      label: "Liste",
    },
    {
      value: "theme",
      label: "Themes",
    },
  ]
  let searchOption = 'list'
  function handleSideMenu(event: CustomEvent) {
    isSideMenuVisible = event.detail.isListVisible
    if (!isSideMenuVisible) {
      displayOptions.update((params) => {
              params.v = "l2";
              return params;
          })
    } else {
      displayOptions.update((params) => {
              delete params.v;
              return params;
          })
    }
  }
  function toggleSearchType(e) {
  }

  function quitFullScreen() {
      displayOptions.update(params => {
        delete params.v
        return params})
  }
</script>

<div class="h-screen  scrollbar-hide">
  <!-- <Header /> -->
  {#if isNavBarVisible}
  <NavBar />
  <Header2 sideMenuVisible={isSideMenuVisible} on:sideMenuChange={handleSideMenu} />
  {/if}
  <!-- Gestion du mode sombre -->
  <main class="flex h-full dark:bg-white dark:text-slate-800">
    <!-- side menu -->
    {#if isSideMenuVisible || nbExercisesInList === 0}
      <aside class="flex flex-col bg-gray-200 w-1/3 p-4  overflow-hidden h-full transition-width transition-slowest ease duration-500">
        <div class="flex-none block overflow-y-scroll overscroll-auto h-full">
          <h2 class="inline-flex items-center font-bold text-xl mb-6">
            <span>Choix des exercices</span>
          </h2>
          <SearchExercice />
            <ul>
              {#each Array.from(refTree, ([key, obj]) => ({ key, obj })) as item}
                <li>
                  <NiveauListeExos nestedLevelCount={1} pathToThisNode={[item.key]} levelTitle={codeToLevelTitle(item.key)} items={item.obj} />
                </li>
              {/each}
            </ul>
        </div>
      </aside>
      <!-- split line -->
      <div class="flex w-1 bg-coopmaths-light hover:bg-coopmaths-lightest" />
    {/if}
    <!-- content -->
    {#if $displayOptions.v === 'l'}
    <div class="absolute right-10 my-10">
      <button type="button" on:click={quitFullScreen}><i class="bx ml-2 bx-sm bx-exit-fullscreen" /></button>
    </div>
    {/if}
    <div class="flex-1 flex flex-col p-6 overflow-hidden h-full mt-10">
      <div class="flex-1 overflow-y-scroll overscroll-auto">
        {#each $listeExercices as paramsExercice, i (paramsExercice)}
          <div animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
            <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$listeExercices.length} />
          </div>
        {/each}
      </div>
    </div>
  </main>
  <!-- Modals ne sont pas utilisés pour le moment
  <Modals>
    <div slot="backdrop" class="backdrop" on:click={closeModal} />
  </Modals> -->
  <Footer />
</div>

<style>
</style>
