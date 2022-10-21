<script lang="ts">
  import Exercice from "./exercice/Exercice.svelte"
  import NavBar from "./header/NavBar.svelte"
  import Footer from "./Footer.svelte"
  import Header2 from "./header2/Header2.svelte"
  import NiveauListeExos from "./sidebar/NiveauListeExos.svelte"
  import { exercicesParams, displayOptions } from "./store"
  import codeList from "../json/codeToLevelList.json"
  import referentiel from "../json/referentiel2022.json"
  import referentielStatic from "../json/referentielStatic.json"
  import { Mathalea } from "../Mathalea"
  import { flip } from "svelte/animate"
  import { onMount } from "svelte"
  import { toMap } from "./utils/toMap"
  import { ElementButtonInstrumenpoche, ElementInstrumenpoche } from "../modules/ElementInstrumenpoche"

  import { context } from "../modules/context"
  import SearchExercice from "./sidebar/SearchExercice.svelte"

  context.versionMathalea = 3

  customElements.define("alea-instrumenpoche", ElementInstrumenpoche)
  customElements.define("alea-buttoninstrumenpoche", ElementButtonInstrumenpoche)

  let isNavBarVisible = true
  let filtre = "all"

  // ToFix fonction à lier avec bugsnag
  window.notify = (arg) => console.log(arg)

  // Récupération des informations de l'URL
  let isInitialUrlHandled = false
  function urlToDisplay() {
    const urlOptions = Mathalea.loadExercicesFromUrl()
    displayOptions.update(() => {
      return urlOptions
    })
    isInitialUrlHandled = true
  }
  onMount(urlToDisplay)
  addEventListener("popstate", urlToDisplay)

  // Mise à jour de l'URL dès que l'on change exercicesParams (sauf pour l'URL d'arrivée sur la page)
  $: {
    if (isInitialUrlHandled) Mathalea.updateUrl($exercicesParams)
    if ($displayOptions.v === "l") {
      isSideMenuVisible = false
      isNavBarVisible = false
    } else if ($displayOptions.v === "l2") {
      isSideMenuVisible = false
      isNavBarVisible = true
    } else if ($displayOptions.v === "eleve") {
      isSideMenuVisible = false
      isNavBarVisible = false
    } else {
      isSideMenuVisible = true
      isNavBarVisible = true
    }
    // Evènement indispensable pour pointCliquable par exemple
    const exercicesAffiches = new window.Event("exercicesAffiches", {
      bubbles: true,
    })
    document.dispatchEvent(exercicesAffiches)
  }

  // Réorganisation du référentiel
  // Suppression de la rubrique calcul mental
  // On renomme les chapitres pour la partie statique
  let filteredReferentiel = { ...referentiel, static: { ...referentielStatic } }
  delete filteredReferentiel["Calcul mental"]
  filteredReferentiel["3e"]["Brevet des collèges par thèmes - APMEP"] = filteredReferentiel["static"]["Brevet des collèges par thèmes - APMEP"]
  filteredReferentiel["CRPE"]["Concours 2022"] = filteredReferentiel["static"]["CRPE (2022) par année"]
  filteredReferentiel["CRPE"]["Concours 2022 - Par thèmes"] = filteredReferentiel["static"]["CRPE (2022) par thèmes"]
  filteredReferentiel["CRPE"]["CRPE (2015-2019) par thèmes - COPIRELEM"] = filteredReferentiel["static"]["CRPE (2015-2019) par thèmes - COPIRELEM"]
  filteredReferentiel["CRPE"]["CRPE (2015-2019) par année - COPIRELEM"] = filteredReferentiel["static"]["CRPE (2015-2019) par année - COPIRELEM"]
  let referentielMap = toMap(filteredReferentiel)
  let arrayReferentielFiltre = Array.from(referentielMap, ([key, obj]) => ({ key, obj }))

  function updateReferentiel() {
    let itemsAccepted
    if (filtre === "college") {
      itemsAccepted = ["6e", "5e", "4e", "3e", "Calcul mental"]
    } else if (filtre === "lycee") {
      itemsAccepted = ["Seconde", "Première", "Première Technologique", "Terminale exper"]
    } else if (filtre === "crpe") {
      itemsAccepted = ["CRPE"]
    }

    if (filtre === "all") {
      filteredReferentiel = { ...referentiel, static: { ...referentielStatic } }
    } else {
      filteredReferentiel = Object.keys(referentiel)
        .filter((key) => itemsAccepted.includes(key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: referentiel[key],
          }
        }, {})
    }
    referentielMap = toMap(filteredReferentiel)
    arrayReferentielFiltre = Array.from(referentielMap, ([key, obj]) => ({ key, obj }))
  }

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
    nbExercisesInList = $exercicesParams.length
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
  let searchOption = "list"
  function handleSideMenu(event: CustomEvent) {
    isSideMenuVisible = event.detail.isListVisible
    if (!isSideMenuVisible) {
      displayOptions.update((params) => {
        params.v = "l2"
        return params
      })
    } else {
      displayOptions.update((params) => {
        delete params.v
        return params
      })
    }
  }

  function quitFullScreen() {
    displayOptions.update((params) => {
      delete params.v
      return params
    })
  }

  function fullScreen() {
    displayOptions.update((params) => {
      params.v = "l"
      return params
    })
  }

  /**
   * Gestion du redimentionnement des colonnes
   */
  let expanding = null
  let sidebarWidth = 600
  function stopResizing() {
    expanding = null
  }

  function startResizing(type, event) {
    expanding = type
  }

  function resizing(event) {
    if (!expanding) return
    sidebarWidth = event.pageX
  }
</script>

<svelte:window on:mouseup={stopResizing} />
<div class="h-screen  scrollbar-hide">
  <!-- <Header /> -->
  {#if isNavBarVisible}
    <NavBar />
    <Header2 sideMenuVisible={isSideMenuVisible} on:sideMenuChange={handleSideMenu} />
  {/if}
  <!-- Gestion du mode sombre -->
  <main class="flex h-full dark:bg-white dark:text-slate-800" on:mousemove={resizing}>
    <!-- side menu -->
    {#if isSideMenuVisible || nbExercisesInList === 0}
      <aside style="width:{sidebarWidth}px" class="flex flex-col bg-gray-200  p-4  overflow-hidden h-full transition-width transition-slowest ease duration-500">
        <div class="flex-none block overflow-y-scroll overscroll-auto h-full">
          <h2 class="inline-flex items-center font-bold text-xl mb-6">
            <span>Choix des exercices</span>
          </h2>
          <div class="flex flex-auto mb-2 mx-2">
            <select class="bg-gray-100 border-2 border-transparent focus:border-2 focus:border-coopmaths focus:outline-0 focus:ring-0 w-full" bind:value={filtre} on:change={updateReferentiel}>
              <option value="all">Tous les exercices</option>
              <option value="college">Collège</option>
              <option value="lycee">Lycée</option>
              <option value="crpe">CRPE</option>
            </select>
          </div>
          <SearchExercice referentiel={filteredReferentiel} />
          <ul>
            {#each arrayReferentielFiltre as item}
              <li>
                <NiveauListeExos nestedLevelCount={1} pathToThisNode={[item.key]} levelTitle={codeToLevelTitle(item.key)} items={item.obj} />
              </li>
            {/each}
          </ul>
        </div>
      </aside>
      <!-- drag bar -->
      <div id="dragbar" class="flex w-[4px] bg-coopmaths-light hover:bg-coopmaths-lightest hover:cursor-col-resize" on:mousedown={startResizing.bind(this, "moving")} />
    {/if}
    <!-- content -->
    {#if $exercicesParams.length !== 0}
      <div class="flex-1 flex flex-col p-6 overflow-hidden h-full">
        {#if $displayOptions.v === "l"}
          <div class="flex flex-row justify-end items-center">
            <button type="button" on:click={quitFullScreen}><i class="bx ml-2 bx-sm bx-exit-fullscreen" /></button>
          </div>
        {/if}
        {#if $displayOptions.v !== "l"}
          <div class="flex flex-row justify-end items-center space-x-2 text-slate-500">
            <button type="button" class="hover:text-coopmaths-dark"><i class="bx bx-sm bx-refresh" /></button>
            <button type="button" class="hover:text-coopmaths-dark"><i class="bx bx-sm bx-code-curly" /></button>
            <button
              type="button"
              class="hover:text-coopmaths-dark"
              on:click={() =>
                displayOptions.update((params) => {
                  params.v = "diaporama"
                  return params
                })}><i class="bx bx-sm bx-slideshow" /></button
            >
            <button
              type="button"
              class="hover:text-coopmaths-dark"
              on:click={() =>
                displayOptions.update((params) => {
                  params.v = "l"
                  return params
                })}><i class="bx bx-sm bx-fullscreen" /></button
            >
          </div>
        {/if}
        <div class="flex-1 overflow-y-scroll overscroll-auto">
          {#each $exercicesParams as paramsExercice, i (paramsExercice)}
            <div animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
              <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} />
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="flex flex-col justify-start text-slate-400 px-10 py-40">
        <div class="animate-pulse flex flex-row justify-start space-x-6 items-center">
          <div class="mt-[10px]"><i class="bx bx-chevron-left text-[50px]" /></div>
          <div class="font-extralight text-[50px]">Sélectionner les exercices</div>
        </div>
      </div>
    {/if}
  </main>
  <!-- Modals ne sont pas utilisés pour le moment
  <Modals>
    <div slot="backdrop" class="backdrop" on:click={closeModal} />
  </Modals> -->
  <Footer />
</div>

<style>
</style>
