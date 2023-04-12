<script lang="ts">
  import Exercice from "./exercice/Exercice.svelte"
  import NavBarV2 from "./header/NavBarV2.svelte"
  import Footer from "./Footer.svelte"
  import NiveauListeExos from "./sidebar/NiveauListeExos.svelte"
  import { exercicesParams, globalOptions, darkMode, isExportMenuVisible, isSettingsMenuVisible, isSideMenuVisible } from "./store"
  import codeList from "../json/codeToLevelList.json"
  import referentiel from "../json/referentiel2022.json"
  import referentielStatic from "../json/referentielStatic.json"
  import { MathaleaUpdateExercicesParamsFromUrl, MathaleaUpdateUrlFromExercicesParams } from "../lib/Mathalea"
  import { flip } from "svelte/animate"
  import { onMount } from "svelte"
  import { toMap } from "./utils/toMap"
  import { deviceType } from "./utils/measures"

  import SearchExercice from "./sidebar/SearchExercice.svelte"

  import { isRecent } from "./utils/handleDate"
  import type { InterfaceReferentiel } from "src/lib/types"
  import InteractivityIcon from "./icons/TwoStatesIcon.svelte"

  let isNavBarVisible: boolean = true
  let isExercisesListVisible: boolean = true
  let filtre: string = "all"
  let divExercices: HTMLDivElement
  let zoom: number = 1
  let setAllInteractifClicked: boolean = false

  /**
   * Pour afficher les menus de boutons lorsqu'il n'y a pas assez de place pour les afficher tous
   * La function est appelé par deux boutons correspondant aux réglages de la partie Exercices
   * et à l'exportation
   * @param menuID {"settings" | "export"} le nom du menu à afficher
   * (ni `id`, ni `name` mais une chaîne arbitraire choisie par le développeur permettant de faire un switch/case)
   * @author sylvain
   */
  function handleMenuVisibility(menuID: "settings" | "export") {
    switch (menuID) {
      case "settings":
        $isSettingsMenuVisible = !$isSettingsMenuVisible
        if ($isExportMenuVisible) {
          $isExportMenuVisible = false
        }
        break
      case "export":
        $isExportMenuVisible = !$isExportMenuVisible
        if ($isSettingsMenuVisible) {
          $isSettingsMenuVisible = false
        }
        break
    }
  }

  // Récupération des informations de l'URL
  let isInitialUrlHandled = false
  function urlToDisplay() {
    const urlOptions = MathaleaUpdateExercicesParamsFromUrl()
    globalOptions.update(() => {
      return urlOptions
    })
    isInitialUrlHandled = true
    zoom = Number(urlOptions.z)
  }

  // À la construction du component ou à la navigation dans l'historique du navigateur
  // on met à jour l'url
  onMount(urlToDisplay)
  addEventListener("popstate", urlToDisplay)

  // Mise à jour de l'URL dès que l'on change exercicesParams (sauf pour l'URL d'arrivée sur la page)
  $: {
    if (isInitialUrlHandled) MathaleaUpdateUrlFromExercicesParams($exercicesParams)
    if ($globalOptions.v === "l") {
      // $isSideMenuVisible = false
      isNavBarVisible = false
    } else if ($globalOptions.v === "l2") {
      // $isSideMenuVisible = false
      isNavBarVisible = true
    } else if ($globalOptions.v === "eleve") {
      // $isSideMenuVisible = false
      isNavBarVisible = false
    } else {
      // $isSideMenuVisible = true
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
  // @ts-ignore
  delete filteredReferentiel["Calcul mental"]
  // @ts-ignore
  filteredReferentiel["3e"]["Brevet des collèges par thèmes - APMEP"] = filteredReferentiel["static"]["Brevet des collèges par thèmes - APMEP"]
  // @ts-ignore
  filteredReferentiel["PE"]["Concours 2022"] = filteredReferentiel["static"]["CRPE (2022) par année"]
  // @ts-ignore
  filteredReferentiel["PE"]["Concours 2022 - Par thèmes"] = filteredReferentiel["static"]["CRPE (2022) par thèmes"]
  // @ts-ignore
  filteredReferentiel["PE"]["CRPE (2015-2019) par thèmes - COPIRELEM"] = filteredReferentiel["static"]["CRPE (2015-2019) par thèmes - COPIRELEM"]
  // @ts-ignore
  filteredReferentiel["PE"]["CRPE (2015-2019) par année - COPIRELEM"] = filteredReferentiel["static"]["CRPE (2015-2019) par année - COPIRELEM"]
  let referentielMap = toMap(filteredReferentiel)
  let arrayReferentielFiltre = Array.from(referentielMap, ([key, obj]) => ({ key, obj }))

  function updateReferentiel() {
    let itemsAccepted: string[]
    if (filtre === "college") {
      itemsAccepted = ["6e", "5e", "4e", "3e"]
    } else if (filtre === "lycee") {
      itemsAccepted = ["2e", "1e", "1techno", "Ex", "HP"]
    } else if (filtre === "crpe") {
      itemsAccepted = ["PE"]
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

    /**
     * Construit un object contenant les références des exercices ayant une date
     * de modification ou de publication récente (<= 1mois)
     * en parcourant récursivement l'objet passé en paramètre
     * Inspiration : {@link https://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list/53620876#53620876}
     * @param {any} obj objet à parcourir (récursivement)
     * @return {[string]} objet des exos nouveaux
     * @author sylvain
     */
    function getRecentExercises(obj: InterfaceReferentiel[]): InterfaceReferentiel[] {
      /**
       * Détecter si une valeur est un objet
       * @param val valeur à analyser
       */
      const isObject = (val: unknown) => val && typeof val === "object" && !Array.isArray(val)

      let recentExercises: InterfaceReferentiel[] = []
      /**
       * On parcourt récursivement l'objet référentiel et on en profite pour peupler
       * le tableau recentExercises avec les exercices dont les dates de publication
       * ou de modification sont récentes
       * @param obj Objet à parcourir
       */
      const traverseObject = (obj: InterfaceReferentiel[]): InterfaceReferentiel[] => {
        return Object.entries(obj).reduce((product, [key, value]) => {
          if (isObject(value as InterfaceReferentiel)) {
            if (Object.hasOwn(value, "uuid")) {
              // <-- on arrête la récursivité lorsqu'on tombe sur les données de l'exo
              if (isRecent(value.datePublication) || isRecent(value.dateModification)) {
                // @ts-ignore
                recentExercises.push({ [key]: value })
              }
              return null
            } else {
              return traverseObject(value)
            }
          }
        }, [])
      }
      traverseObject(obj)

      let recentExercisesAsObject = {}
      recentExercises.forEach((exo) => Object.assign(recentExercisesAsObject, exo))
      return recentExercisesAsObject
    }

    filteredReferentiel["Nouveautés"] = getRecentExercises(filteredReferentiel)
    const keysToBeFirst = { Nouveautés: null }
    filteredReferentiel = Object.assign(keysToBeFirst, filteredReferentiel)
    referentielMap = toMap(filteredReferentiel)
    arrayReferentielFiltre = Array.from(referentielMap, ([key, obj]) => ({ key, obj }))
  }
  updateReferentiel()

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
  // let isSideMenuVisible: boolean = false
  $: {
    nbExercisesInList = $exercicesParams.length
    if (nbExercisesInList === 0) {
      $isSideMenuVisible = true
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
    $isSideMenuVisible = event.detail.isListVisible
    if (!$isSideMenuVisible) {
      globalOptions.update((params) => {
        params.v = "l2"
        return params
      })
    } else {
      globalOptions.update((params) => {
        delete params.v
        return params
      })
    }
  }

  function quitFullScreen() {
    globalOptions.update((params) => {
      delete params.v
      return params
    })
  }

  function fullScreen() {
    globalOptions.update((params) => {
      params.v = "l"
      return params
    })
  }

  /**
   * Gestion du redimentionnement des colonnes
   */
  let expanding = null
  let sidebarWidth = 400
  function stopResizing() {
    expanding = null
  }

  function startResizing(type, event: MouseEvent) {
    expanding = type
  }

  function resizing(event: MouseEvent) {
    if (!expanding) return
    event.preventDefault()
    sidebarWidth = event.pageX
  }

  function newDataForAll() {
    const newDataForAll = new window.Event("newDataForAll", {
      bubbles: true,
    })
    document.dispatchEvent(newDataForAll)
  }

  function setAllInteractif() {
    const setAllInteractif = new window.Event("setAllInteractif", {
      bubbles: true,
    })
    setAllInteractifClicked = true
    document.dispatchEvent(setAllInteractif)
  }

  function removeAllInteractif() {
    const removeAllInteractif = new window.Event("removeAllInteractif", {
      bubbles: true,
    })
    setAllInteractifClicked = false
    document.dispatchEvent(removeAllInteractif)
  }

  function zoomMinus() {
    zoom -= 0.25
    updateSize()
  }

  function zoomPlus() {
    zoom += 0.25
    updateSize()
  }

  function updateSize() {
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
  }

  function toggleSideMenu() {
    $isSideMenuVisible = !$isSideMenuVisible
  }

  function toggleExercisesList() {
    isExercisesListVisible = !isExercisesListVisible
  }
</script>

<svelte:window on:mouseup={stopResizing} />
<div class="h-screen scrollbar-hide {$darkMode.isActive ? 'dark' : ''} bg-coopmaths-canvas dark:bg-coopmathsdark-canvas" id="startComponent">
  <!-- <Header /> -->
  {#if isNavBarVisible}
    <div class="pb-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden">
      <NavBarV2 />
    </div>
    <!-- <Header2 sideMenuVisible={isSideMenuVisible} on:sideMenuChange={handleSideMenu} /> -->
  {/if}
  <!-- Gestion du mode sombre -->
  <div class="flex flex-col justify-between min-h-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <main class="mb-auto ml-0 md:ml-4 flex flex-col md:flex-row h-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus" on:mousemove={resizing}>
      {#if deviceType() === "mobile"}
        {#if $isSideMenuVisible || nbExercisesInList === 0}
          <div class="w-full flex flex-col bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark p-4 md:h-full">
            <div class="flex flex-col">
              <div class="flex flex-row justify justify-between items-center {isExercisesListVisible ? 'mb-6' : 'mb-0'} text-coopmaths-struct dark:text-coopmathsdark-struct">
                <div class="font-bold text-xl">Choix des exercices</div>
                <button
                  type="button"
                  class="md:hidden text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                  on:click={toggleExercisesList}
                >
                  <i class="bx bxs-up-arrow {isExercisesListVisible ? 'rotate-0' : 'rotate-180'} transition-all ease-in-out duration-500" />
                </button>
              </div>
              <div class="{isExercisesListVisible ? '' : 'hidden'} h-full">
                <div class="flex flex-auto mb-2">
                  <select
                    class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light text-sm border-1 focus:border-1 border-coopmaths-action focus:border-coopmaths-action-lightest dark:border-coopmathsdark-action dark:focus:border-coopmaths-action-lightest focus:outline-0 focus:ring-0 w-full"
                    bind:value={filtre}
                    on:change={updateReferentiel}
                  >
                    <option value="all" class=" hover:bg-coopmaths-canvas-darkest">Tous les exercices</option>
                    <option value="college" class=" hover:bg-coopmaths-canvas-darkest">Collège</option>
                    <option value="lycee" class=" hover:bg-coopmaths-canvas-darkest">Lycée</option>
                    <option value="crpe" class=" hover:bg-coopmaths-canvas-darkest">CRPE</option>
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
            </div>
          </div>
          <!-- drag bar -->
          <div
            id="dragbar"
            class="hidden md:flex w-[4px] bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action hover:cursor-col-resize"
            on:mousedown={startResizing.bind(this, "moving")}
          />
        {/if}
      {:else}
        <div class="print-hidden transition-transform duration-300 {$isSideMenuVisible || nbExercisesInList === 0 ? 'translate-x-0 ' : '-translate-x-full'}">
          <div
            style="{$isSideMenuVisible || nbExercisesInList === 0
              ? `width:${sidebarWidth}px;`
              : 'width: 0px;'} transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 600ms;"
            class="flex flex-col bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark overflow-hidden md:h-full {$isSideMenuVisible || nbExercisesInList === 0 ? 'p-4' : 'p-0'}"
          >
            <div class="flex flex-col overflow-y-scroll overscroll-auto">
              <div class="flex flex-row justify justify-between items-center mb-6 text-coopmaths-struct dark:text-coopmathsdark-struct">
                <div class="font-bold text-xl">Choix des exercices</div>
                <button
                  type="button"
                  class="md:hidden text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                  on:click={toggleExercisesList}
                >
                  <i class="bx bxs-up-arrow {isExercisesListVisible ? 'rotate-0' : 'rotate-180'} transition-all ease-in-out duration-500" />
                </button>
              </div>
              <div class={isExercisesListVisible ? "" : "hidden"}>
                <div class="flex flex-auto mb-2">
                  <select
                    class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light text-sm border-1 focus:border-1 border-coopmaths-action focus:border-coopmaths-action-lightest dark:border-coopmathsdark-action dark:focus:border-coopmaths-action-lightest focus:outline-0 focus:ring-0 w-full"
                    bind:value={filtre}
                    on:change={updateReferentiel}
                  >
                    <option value="all" class=" hover:bg-coopmaths-canvas-darkest">Tous les exercices</option>
                    <option value="college" class=" hover:bg-coopmaths-canvas-darkest">Collège</option>
                    <option value="lycee" class=" hover:bg-coopmaths-canvas-darkest">Lycée</option>
                    <option value="crpe" class=" hover:bg-coopmaths-canvas-darkest">CRPE</option>
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
            </div>
          </div>
        </div>
        <!-- drag bar -->
        <div
          id="dragbar"
          class="hidden {$isSideMenuVisible || nbExercisesInList === 0
            ? 'md:flex'
            : 'md:hidden'} w-[4px] bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action hover:cursor-col-resize"
          on:mousedown={startResizing.bind(this, "moving")}
        />
      {/if}
      <!-- content -->
      {#if $exercicesParams.length !== 0}
        <div class="relative flex flex-col px-6 {deviceType() === 'mobile' ? '' : 'overflow-hidden'} w-full h-full" bind:this={divExercices}>
          <div class="print-hidden hidden md:block absolute top-0 left-0">
            <button
              type="button"
              class="{$isSideMenuVisible
                ? 'rounded-r-lg'
                : 'rounded-lg'} bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest p-2"
              on:click={toggleSideMenu}
            >
              <i class="print-hidden bx bx-md {$isSideMenuVisible ? 'bx-caret-left bx-fade-left-hover' : 'bx-sidebar  translate-y-1'}" />
            </button>
          </div>
          <!-- barre des boutons commandes (résumé) -->
          <div class="w-full flex flex-row justify-center items-center space-x-20 pt-4 md:pt-0 px-4 lg:hidden">
            <button
              type="button"
              on:click={() => {
                handleMenuVisibility("settings")
              }}
              class="{$isSettingsMenuVisible
                ? 'bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest rounded-t-lg'
                : 'bg-coopmaths-canvas dark:bg-coopmathsdark-canvas'} text-coopmaths-action dark:text-coopmathsdark-action p-2"
            >
              <i class="bx bx-slider {deviceType() === 'mobile' ? 'bx-sm' : 'bx-md'}" />
            </button>

            <button
              type="button"
              on:click={() => {
                handleMenuVisibility("export")
              }}
              class="{$isExportMenuVisible
                ? 'bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest rounded-t-lg'
                : 'bg-coopmaths-canvas dark:bg-coopmathsdark-canvas'} text-coopmaths-action dark:text-coopmathsdark-action p-2"
            >
              <i class="bx bx-export rotate-90 {deviceType() === 'mobile' ? 'bx-sm' : 'bx-md'}" />
            </button>
          </div>
          <!-- barre des boutons commandes (tous les boutons) ==> POUR LG ET + SEULEMENT -->
          <div class="w-full hidden lg:flex lg:flex-col xl:flex-row pl-4 pb-6 justify-between items-center">
            <!-- réglages pour tous les exercices de la page -->
            <div
              class="print-hidden flex flex-row justify-start items-center space-x-4 px-4 pt-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark lg:bg-coopmaths-canvas lg:dark:bg-coopmathsdark-canvas"
            >
              <button type="button" on:click={zoomMinus} class="tooltip tooltip-bottom tooltip-neutral" data-tip="Réduire la taille du texte">
                <i
                  class="bx {deviceType() === 'mobile'
                    ? 'bx-sm'
                    : 'bx-md'} px-2 bx-zoom-out hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                />
              </button>
              <button type="button" on:click={zoomPlus} class="tooltip tooltip-bottom tooltip-neutral" data-tip="Augmenter la taille du texte">
                <i
                  class="bx {deviceType() === 'mobile'
                    ? 'bx-sm'
                    : 'bx-md'} px-2 bx-zoom-in hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                />
              </button>
              <button
                type="button"
                on:click={setAllInteractifClicked ? removeAllInteractif : setAllInteractif}
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip={setAllInteractifClicked ? "Supprimer l'interactivité" : "Tous les exercices en interactif"}
              >
                <!-- <i
                  class="bx {deviceType() === 'mobile'
                    ? 'bx-sm'
                    : 'bx-md'} px-2 tooltip-bottom tooltip-neutral  hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest {setAllInteractifClicked
                    ? 'bxs-edit'
                    : 'bx-edit'}"
                /> -->
                <InteractivityIcon isOnStateActive={setAllInteractifClicked} size={8} />
              </button>
              <button type="button" on:click={newDataForAll} class="tooltip tooltip-bottom tooltip-neutral" data-tip="Nouveaux énoncés">
                <i
                  class="bx {deviceType() === 'mobile'
                    ? 'bx-sm'
                    : 'bx-md'} px-2 bx-refresh hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                />
              </button>
              <button
                type="button"
                on:click={() => {
                  $exercicesParams.length = 0
                }}
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="Supprimer tous les exercices"
              >
                <i
                  class="bx text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest px-2 bx-trash
                  {deviceType() === 'mobile' ? 'bx-sm' : 'bx-md'}"
                />
              </button>
              {#if $globalOptions.v === "l"}
                <div class="flex flex-row justify-end items-center">
                  <button type="button" on:click={quitFullScreen} class="tooltip tooltip-bottom tooltip-neutral" data-tip="Quitter le plein écran">
                    <i
                      class="bx ml-2 bx-md px-2 bx-exit-fullscreen hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                    />
                  </button>
                </div>
              {/if}
              {#if $globalOptions.v !== "l"}
                <button
                  type="button"
                  class="tooltip tooltip-bottom tooltip-neutral"
                  data-tip="Plein écran"
                  on:click={() =>
                    globalOptions.update((params) => {
                      params.v = "l"
                      return params
                    })}
                  ><i
                    class="bx {deviceType() === 'mobile'
                      ? 'bx-sm'
                      : 'bx-md'} px-2 bx-fullscreen hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                  />
                </button>
              {/if}
            </div>
            <!-- boutons d'exports -->
            <div
              class="print-hidden flex flex-row justify-start items-center space-x-4 px-4 pt-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark lg:bg-coopmaths-canvas lg:dark:bg-coopmathsdark-canvas"
            >
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="Diaporama"
                on:click={() =>
                  globalOptions.update((params) => {
                    params.v = "diaporama"
                    return params
                  })}
              >
                <i
                  class="bx bx-slideshow hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest
                      {deviceType() === 'mobile' ? 'bx-sm' : 'bx-md'} "
                />
              </button>
              <!-- <label for="modal-settings-eleve" class="tooltip tooltip-top tooltip-neutral" data-tip="Config pour élèves">
                    <i
                      class="bx bxs-graduation  hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest
                      {deviceType() === 'mobile' ? 'bx-sm' : 'bx-md'}"
                    />
                  </label>
                  <ModalSettingsVueEleve /> -->
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="Lien pour les élèves"
                on:click={() =>
                  globalOptions.update((params) => {
                    params.v = "confeleve"
                    return params
                  })}
              >
                <i
                  class="bx bxs-graduation hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest
                      {deviceType() === 'mobile' ? 'bx-sm' : 'bx-md'} "
                />
              </button>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="LaTeX"
                on:click={() => {
                  globalOptions.update((params) => {
                    params.v = "latex"
                    return params
                  })
                }}
              >
                <i>
                  <svg
                    width="32.000004"
                    height="31.999998"
                    viewBox="0 0 8.4666675 8.4666661"
                    version="1.1"
                    id="svg507"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:svg="http://www.w3.org/2000/svg"
                    class="w-6 h-6 md:w-7 md:h-7 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest"
                  >
                    <defs id="defs504" />
                    <g id="layer1">
                      <g id="g1669" transform="matrix(1.108044,0,0,1.0300717,-0.36352999,-0.1273056)">
                        <g
                          aria-label="A"
                          id="text313"
                          style="font-stretch:ultra-condensed;font-size:7.54751px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                          transform="matrix(1.2141816,0,0,1.0476377,-0.50895982,-0.00588555)"
                        >
                          <path
                            d="m 1.3966823,5.6710072 h 0.6113484 l 0.083023,-1.1321266 h 0.3471854 l 0.083023,1.1321266 H 3.1326097 L 2.634474,0.1235872 H 1.9023655 Z M 2.264646,1.4745915 2.3854062,3.6784645 H 2.1514334 Z"
                            id="path1647"
                          />
                        </g>
                        <g
                          aria-label="E"
                          id="text371"
                          style="font-stretch:ultra-condensed;font-size:9.4344px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                        >
                          <path
                            d="M 4.4998348,1.4087978 V 8.3430815 H 6.0659451 V 7.2958631 H 5.2828899 V 5.3901144 h 0.566064 V 4.2768552 H 5.2828899 V 2.4560161 H 6.0659451 V 1.4087978 Z"
                            id="path1653"
                          />
                        </g>
                        <g
                          aria-label="L"
                          id="text309"
                          style="font-stretch:ultra-condensed;font-size:9.4344px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                          transform="translate(-0.16940966)"
                        >
                          <path d="M 0.4974923,0.12358906 V 7.0578728 h 1.5944135 v -0.94344 H 1.2805475 V 0.12358906 Z" id="path1644" />
                        </g>
                        <g
                          aria-label="T"
                          id="text367"
                          style="font-stretch:ultra-condensed;font-size:9.4344px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                        >
                          <path d="M 2.8936626,1.1708074 H 3.4691609 V 7.0578728 H 4.2522161 V 1.1708074 H 4.8277145 V 0.12358906 H 2.8936626 Z" id="path1650" />
                        </g>
                        <g
                          aria-label="X"
                          id="text375"
                          style="font-stretch:ultra-condensed;font-size:9.4344px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                        >
                          <path
                            d="M 6.9125229,5.1426897 7.2049893,7.0578728 H 7.9691756 L 7.5163245,4.6049289 C 7.4408493,4.2086841 7.3748085,3.8030049 7.2993333,3.4161945 L 7.9597412,0.12358906 H 7.1861205 C 7.1012109,0.68021864 6.9974325,1.2462826 6.9125229,1.8029122 L 6.6389253,0.12358906 H 5.8653045 L 6.1955085,1.774609 c 0.094344,0.518892 0.2264256,1.1226935 0.330204,1.6415855 L 5.8558701,7.0578728 h 0.7641864 z"
                            id="path1656"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                  <!-- <svg
                    viewBox="0 0 13.811785 5.5842133"
                    version="1.1"
                    id="svg5"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:svg="http://www.w3.org/2000/svg"
                    class="w-6 h-6 md:w-8 md:h-8 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest"
                  >
                    <defs id="defs2">
                      <clipPath id="clipPath2552">
                        <path clip-rule="nonzero" d="M 20,3 H 30 V 15.46875 H 20 Z m 0,0" id="path3784" />
                      </clipPath>
                      <clipPath id="clipPath2841">
                        <path clip-rule="nonzero" d="M 28,0 H 40.273438 V 12 H 28 Z m 0,0" id="path2755" />
                      </clipPath>
                    </defs>
                    <g id="g1128">
                      <g fill-opacity="1" id="g31" transform="matrix(0.352778,0,0,0.352778,-0.308681,0.127794)">
                        <g id="use29" transform="translate(0,11.761)">
                          <path
                            d="m 9.328125,-4.359375 h -0.3125 c -0.125,1.703125 -0.359375,3.90625 -3.296875,3.90625 H 4.109375 c -0.6875,0 -0.71875,-0.078125 -0.71875,-0.671875 v -9.390625 c 0,-0.625 0.03125,-0.796875 1.34375,-0.796875 h 0.375 v -0.453125 c -0.703125,0.04687 -1.53125,0.04687 -2.234375,0.04687 -0.53125,0 -1.5,0 -2,-0.04687 v 0.453125 c 1.1875,0 1.375,0 1.375,0.78125 v 9.3125 c 0,0.765625 -0.1875,0.765625 -1.375,0.765625 V 0 h 8.046875 z m 0,0"
                            id="path57"
                          />
                        </g>
                      </g>
                      <g fill-opacity="1" id="g35" transform="matrix(0.352778,0,0,0.352778,-0.308681,0.127794)">
                        <g id="use33" transform="translate(4.2309999,8.1689997)">
                          <path
                            d="M 4.625,-8.3125 C 4.578125,-8.46875 4.546875,-8.53125 4.390625,-8.53125 c -0.171875,0 -0.1875,0.03125 -0.25,0.21875 l -2.5,7.15625 c -0.171875,0.484375 -0.5,0.796875 -1.265625,0.8125 V 0 c 0.71875,-0.03125 0.75,-0.03125 1.140625,-0.03125 0.34375,0 0.90625,0 1.21875,0.03125 V -0.34375 C 2.234375,-0.359375 1.9375,-0.609375 1.9375,-0.9375 c 0,-0.078125 0,-0.109375 0.0625,-0.25 L 2.546875,-2.78125 H 5.5625 l 0.65625,1.875 c 0.0625,0.140625 0.0625,0.171875 0.0625,0.203125 0,0.359375 -0.609375,0.359375 -0.921875,0.359375 V 0 c 0.28125,-0.03125 1.234375,-0.03125 1.5625,-0.03125 0.328125,0 1.1875,0 1.46875,0.03125 v -0.34375 c -0.78125,0 -0.984375,0 -1.15625,-0.5 z M 4.046875,-7.109375 5.4375,-3.125 H 2.671875 Z m 0,0"
                            id="path61"
                          />
                        </g>
                      </g>
                      <g fill-opacity="1" id="g39" transform="matrix(0.352778,0,0,0.352778,-0.308681,0.127794)">
                        <g id="use37" transform="translate(10.638,11.761)">
                          <path
                            d="M 10.703125,-11.703125 H 0.78125 L 0.484375,-7.90625 h 0.3125 c 0.21875,-2.859375 0.453125,-3.359375 3.109375,-3.359375 0.3125,0 0.8125,0 0.953125,0.01563 0.328125,0.0625 0.328125,0.265625 0.328125,0.65625 V -1.25 c 0,0.609375 -0.0625,0.796875 -1.484375,0.796875 H 3.21875 V 0 C 4.046875,-0.015625 4.90625,-0.03125 5.75,-0.03125 6.59375,-0.03125 7.453125,-0.015625 8.28125,0 V -0.453125 H 7.796875 C 6.375,-0.453125 6.3125,-0.640625 6.3125,-1.25 v -9.34375 c 0,-0.375 0,-0.578125 0.3125,-0.65625 0.140625,-0.01563 0.640625,-0.01563 0.953125,-0.01563 2.625,0 2.890625,0.5 3.109375,3.359375 H 11 Z m 0,0"
                            id="path65"
                          />
                        </g>
                      </g>
                      <g clip-path="url(#clipPath2552)" id="g45" transform="matrix(0.352778,0,0,0.352778,-0.308681,0.127794)">
                        <g fill-opacity="1" id="g43">
                          <g id="use41" transform="translate(19.497999,15.467)">
                            <path
                              d="m 10.453125,-4.359375 h -0.3125 c -0.375,2.53125 -0.59375,3.90625 -3.625,3.90625 h -2.40625 c -0.6875,0 -0.71875,-0.078125 -0.71875,-0.671875 v -4.75 h 1.625 c 1.609375,0 1.765625,0.59375 1.765625,2.015625 h 0.3125 v -4.46875 h -0.3125 c 0,1.421875 -0.15625,2.015625 -1.765625,2.015625 h -1.625 v -4.296875 c 0,-0.578125 0.03125,-0.671875 0.71875,-0.671875 H 6.46875 c 2.671875,0 2.984375,1.078125 3.21875,3.359375 H 10 L 9.59375,-11.71875 H 0.875 v 0.4375 c 1.1875,0 1.375,0 1.375,0.78125 v 9.28125 c 0,0.765625 -0.1875,0.765625 -1.375,0.765625 V 0 h 8.953125 z m 0,0"
                              id="path69"
                            />
                          </g>
                        </g>
                      </g>
                      <g clip-path="url(#clipPath2841)" id="g51" transform="matrix(0.352778,0,0,0.352778,-0.308681,0.127794)">
                        <g fill-opacity="1" id="g49">
                          <g id="use47" transform="translate(28.339001,11.761)">
                            <path
                              d="m 6.28125,-6.53125 2.546875,-3.65625 c 0.265625,-0.375 0.78125,-1.109375 2.1875,-1.125 v -0.453125 c -0.390625,0.04687 -1.046875,0.04687 -1.453125,0.04687 -0.578125,0 -1.28125,0 -1.703125,-0.04687 v 0.453125 c 0.546875,0.04687 0.6875,0.390625 0.6875,0.671875 0,0.203125 -0.09375,0.34375 -0.21875,0.515625 L 6.0625,-6.828125 3.515625,-10.5625 C 3.390625,-10.75 3.375,-10.796875 3.375,-10.84375 3.375,-11 3.5625,-11.296875 4.125,-11.3125 v -0.453125 c -0.546875,0.04687 -1.390625,0.04687 -1.953125,0.04687 -0.453125,0 -1.3125,0 -1.71875,-0.04687 v 0.453125 c 0.9375,0 1.25,0.03125 1.625,0.5625 l 3.328125,4.859375 -3,4.359375 c -0.734375,1.0625 -1.859375,1.078125 -2.1875,1.078125 V 0 c 0.40625,-0.03125 1.0625,-0.03125 1.46875,-0.03125 0.46875,0 1.28125,0 1.703125,0.03125 V -0.453125 C 2.859375,-0.5 2.703125,-0.84375 2.703125,-1.125 c 0,-0.21875 0.09375,-0.34375 0.171875,-0.453125 l 2.75,-4 3,4.375 c 0.140625,0.1875 0.140625,0.234375 0.140625,0.296875 0,0.125 -0.15625,0.421875 -0.765625,0.453125 V 0 c 0.5625,-0.03125 1.40625,-0.03125 1.96875,-0.03125 0.453125,0 1.3125,0 1.71875,0.03125 v -0.453125 c -1.09375,0 -1.265625,-0.078125 -1.609375,-0.5625 z m 0,0"
                              id="path73"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg> -->
                </i>
              </button>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="AMC"
                on:click={() => {
                  globalOptions.update((params) => {
                    params.v = "amc"
                    return params
                  })
                }}
              >
                <i>
                  <svg
                    viewBox="0 0 8.4759316 8.4576318"
                    version="1.1"
                    id="svg4191"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:svg="http://www.w3.org/2000/svg"
                    class="w-6 h-6 md:w-7 md:h-7 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest hover:stroke-coopmaths-action-lightest stroke-coopmaths-action dark:stroke-coopmathsdark-action dark:hover:stroke-coopmathsdark-action-lightest"
                  >
                    <defs id="defs4188" />
                    <g id="layer1" transform="translate(0.00463201,-0.00451693)">
                      <g id="g4703" transform="matrix(0.68088189,0,0,0.64722958,-14.592662,0.40513752)">
                        <path id="rect9846" style="display:inline;fill:none;stroke-width:1.08479" d="M 21.967594,0.542395 H 33.331265 V 11.906066 H 21.967594 Z" />
                        <path
                          style="display:inline;fill-opacity:1;stroke-width:0.353;stroke-dasharray:none"
                          d="m 30.187147,10.138692 c -3.21818,-4.0175496 -3.01441,-3.9353796 -5.07458,-2.0463796 -4.03864,3.7030996 -4.28539,3.6763596 -0.9908,-0.10736 1.03241,-1.18568 1.8771,-2.22601 1.8771,-2.31183 0,-0.0858 -0.79128,-0.54447 -1.7584,-1.01921 -1.93433,-0.94953 -2.0473,-1.18716 -1.13073,-2.37828 l 0.62296,-0.80956 1.45065,1.05084 c 0.79785,0.57796 1.56133,1.22995 1.69663,1.44886 0.33319,0.53911 1.85035,-1.5541 2.36047,-3.25671996 0.27287,-0.91077 0.60202,-1.32803 1.0476,-1.32803 1.07062,0 0.77611,1.39994 -0.80291,3.81656996 -1.45263,2.22318 -1.45263,2.22318 -0.75445,2.99567 1.35314,1.49715 3.64953,5.2880896 3.54188,5.8470396 -0.0716,0.3719 -0.78625,-0.27974 -2.08542,-1.90161 z"
                          id="path6447"
                        />
                      </g>
                    </g>
                  </svg>
                </i>
              </button>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="Moodle"
                on:click={() => {
                  globalOptions.update((params) => {
                    params.v = "moodle"
                    return params
                  })
                }}
              >
                <i>
                  <svg
                    viewBox="0 0 8.4666661 8.4666661"
                    version="1.1"
                    id="svg2697"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:svg="http://www.w3.org/2000/svg"
                    class="w-6 h-6 md:w-8 md:h-8 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest"
                  >
                    <defs id="defs2694" />
                    <g id="layer1">
                      <path
                        id="path5800"
                        d="M 5.6190408,1.3436103 C 3.1929106,1.6410426 2.0896442,1.8517723 -6.6666665e-8,3.0631178 L 0.01937674,3.1181452 l 0.1660648,0.00168 c -0.0151705,0.1672543 -0.0417532,0.580651 -0.00793,1.2022881 -0.2318563,0.6710048 -0.005861,1.1268667 0.20632167,1.622751 0.0336508,-0.51578 0.0301858,-1.0806985 -0.12822484,-1.6428984 -0.0331509,-0.6174618 -0.005861,-1.0234456 0.009137,-1.1813718 l 1.38524723,0.013274 a 6.3367299,6.3367299 0 0 0 0.041012,0.8119988 c 2.413e-4,7.41e-5 4.827e-4,1.465e-4 7.24e-4,2.465e-4 -0.019394,0.1136922 -0.029686,0.2337457 -0.029686,0.3610258 V 7.1230563 H 3.0168247 V 4.4640923 C 3.0166023,4.3152495 3.0333743,4.1870108 3.0661804,4.0780232 3.4148371,4.0207547 3.7437413,3.892485 4.0371069,3.6999667 4.2663963,3.8138486 4.3816797,4.0680313 4.3816797,4.4640923 v 2.658964 h 1.354546 V 4.4640923 C 5.7372083,3.9080313 5.9669011,3.6300947 6.425373,3.6302654 6.8838432,3.6304378 7.1130792,3.9083588 7.1130792,4.4640923 v 2.658964 H 8.4666667 V 4.3070919 C 8.466496,3.7267978 8.2649892,3.2877561 7.8621894,2.9899135 7.5078576,2.7238375 7.0286125,2.5907977 6.4244128,2.5907977 c -0.6608527,0 -1.1162405,0.1571004 -1.3661083,0.4713116 -0.066043,-0.071577 -0.1408956,-0.1345516 -0.2236867,-0.1898186 5e-5,-9.82e-5 1.207e-4,-1.982e-4 1.948e-4,-2.879e-4 C 4.6513449,2.6664276 4.2917878,2.3859638 4.2917878,2.3859638 L 5.636261,1.403525 Z"
                      />
                    </g>
                  </svg>
                </i>
              </button>
            </div>
          </div>

          <!-- barre des boutons commandes (tous les boutons SETTINGS) ==> POUR < LG SEULEMENT -->
          <div
            class="{$isSettingsMenuVisible
              ? 'flex lg:hidden'
              : 'hidden'} rounded-lg w-5/6 mx-auto text-3xl flex-row justify-center items-center px-4 py-3 bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest lg:bg-coopmaths-canvas lg:dark:bg-coopmathsdark-canvas"
          >
            <button
              type="button"
              on:click={() => {
                zoomMinus()
                handleMenuVisibility("settings")
              }}
              class="tooltip tooltip-top tooltip-neutral"
              data-tip="Réduire la taille du texte"
            >
              <i class="bx px-2 bx-zoom-out hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
            </button>
            <button
              type="button"
              on:click={() => {
                zoomPlus()
                handleMenuVisibility("settings")
              }}
              class="tooltip tooltip-top tooltip-neutral"
              data-tip="Augmenter la taille du texte"
            >
              <i class="bx px-2 bx-zoom-in hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
            </button>
            <button
              type="button"
              on:click={() => {
                setAllInteractifClicked ? removeAllInteractif() : setAllInteractif()
                handleMenuVisibility("settings")
              }}
              class="tooltip tooltip-top tooltip-neutral"
              data-tip={setAllInteractifClicked ? "Supprimer l'interactivité" : "Tous les exercices en interactif"}
            >
              <!-- <i
                class="bx px-2 tooltip-top tooltip-neutral hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest {setAllInteractifClicked
                  ? 'bxs-edit'
                  : 'bx-edit'}"
              /> -->
              <div class="px-2">
                <InteractivityIcon isOnStateActive={setAllInteractifClicked} size={6} />
              </div>
            </button>
            <button
              type="button"
              on:click={() => {
                newDataForAll()
                handleMenuVisibility("settings")
              }}
              class="tooltip tooltip-top tooltip-neutral"
              data-tip="Nouveaux énoncés"
            >
              <i class="bx px-2 bx-refresh hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
            </button>
            <button
              type="button"
              on:click={() => {
                $exercicesParams.length = 0
                handleMenuVisibility("settings")
              }}
              class="tooltip tooltip-top tooltip-neutral"
              data-tip="Supprimer tous les exercices"
            >
              <i class="bx text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest px-2 bx-trash" />
            </button>
            {#if $globalOptions.v === "l"}
              <div class="flex flex-row justify-end items-center">
                <button
                  type="button"
                  on:click={() => {
                    handleMenuVisibility("settings")
                    quitFullScreen()
                  }}
                  class="tooltip tooltip-top tooltip-neutral"
                  data-tip="Quitter le plein écran"
                >
                  <i
                    class="bx ml-2 bx-md px-2 bx-exit-fullscreen hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                  />
                </button>
              </div>
            {/if}
            {#if $globalOptions.v !== "l"}
              <button
                type="button"
                class="tooltip tooltip-top tooltip-neutral"
                data-tip="Plein écran"
                on:click={() => {
                  handleMenuVisibility("settings")
                  globalOptions.update((params) => {
                    params.v = "l"
                    return params
                  })
                }}
                ><i class="bx px-2 bx-fullscreen hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
              </button>
            {/if}
          </div>
          <!-- boutons d'exports SEULEMENT POUR LARGEUR < LG -->
          <div
            class="{$isExportMenuVisible
              ? 'flex lg:hidden'
              : 'hidden'} rounded-lg text-3xl flex-row w-5/6 mx-auto justify-center items-center space-x-4 px-4 py-3 bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest lg:bg-coopmaths-canvas lg:dark:bg-coopmathsdark-canvas"
          >
            <button
              type="button"
              class="tooltip tooltip-top tooltip-neutral"
              data-tip="Diaporama"
              on:click={() => {
                handleMenuVisibility("export")
                globalOptions.update((params) => {
                  params.v = "diaporama"
                  return params
                })
              }}
            >
              <i class="bx bx-slideshow hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
            </button>
            <!-- <label for="modal-settings-eleve" class="tooltip tooltip-top tooltip-neutral" data-tip="Config pour élèves">
                    <i
                      class="bx bxs-graduation  hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest
                      {deviceType() === 'mobile' ? 'bx-sm' : 'bx-md'}"
                    />
                  </label>
                  <ModalSettingsVueEleve /> -->
            <button
              type="button"
              class="tooltip tooltip-top tooltip-neutral"
              data-tip="Lien pour les élèves"
              on:click={() => {
                handleMenuVisibility("export")
                globalOptions.update((params) => {
                  params.v = "confeleve"
                  return params
                })
              }}
            >
              <i class="bx bxs-graduation hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
            </button>
            <button
              type="button"
              class="tooltip tooltip-top tooltip-neutral"
              data-tip="LaTeX"
              on:click={() => {
                handleMenuVisibility("export")
                globalOptions.update((params) => {
                  params.v = "latex"
                  return params
                })
              }}
            >
              <i>
                <svg
                  width="32.000004"
                  height="31.999998"
                  viewBox="0 0 8.4666675 8.4666661"
                  version="1.1"
                  id="svg507"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:svg="http://www.w3.org/2000/svg"
                  class="w-5 h-5 lg:w-7 lg:h-7 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest"
                >
                  <defs id="defs504" />
                  <g id="layer1">
                    <g id="g1669" transform="matrix(1.108044,0,0,1.0300717,-0.36352999,-0.1273056)">
                      <g
                        aria-label="A"
                        id="text313"
                        style="font-stretch:ultra-condensed;font-size:7.54751px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                        transform="matrix(1.2141816,0,0,1.0476377,-0.50895982,-0.00588555)"
                      >
                        <path
                          d="m 1.3966823,5.6710072 h 0.6113484 l 0.083023,-1.1321266 h 0.3471854 l 0.083023,1.1321266 H 3.1326097 L 2.634474,0.1235872 H 1.9023655 Z M 2.264646,1.4745915 2.3854062,3.6784645 H 2.1514334 Z"
                          id="path1647"
                        />
                      </g>
                      <g
                        aria-label="E"
                        id="text371"
                        style="font-stretch:ultra-condensed;font-size:9.4344px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                      >
                        <path
                          d="M 4.4998348,1.4087978 V 8.3430815 H 6.0659451 V 7.2958631 H 5.2828899 V 5.3901144 h 0.566064 V 4.2768552 H 5.2828899 V 2.4560161 H 6.0659451 V 1.4087978 Z"
                          id="path1653"
                        />
                      </g>
                      <g
                        aria-label="L"
                        id="text309"
                        style="font-stretch:ultra-condensed;font-size:9.4344px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                        transform="translate(-0.16940966)"
                      >
                        <path d="M 0.4974923,0.12358906 V 7.0578728 h 1.5944135 v -0.94344 H 1.2805475 V 0.12358906 Z" id="path1644" />
                      </g>
                      <g
                        aria-label="T"
                        id="text367"
                        style="font-stretch:ultra-condensed;font-size:9.4344px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                      >
                        <path d="M 2.8936626,1.1708074 H 3.4691609 V 7.0578728 H 4.2522161 V 1.1708074 H 4.8277145 V 0.12358906 H 2.8936626 Z" id="path1650" />
                      </g>
                      <g
                        aria-label="X"
                        id="text375"
                        style="font-stretch:ultra-condensed;font-size:9.4344px;line-height:1.25;font-family:'League Gothic';-inkscape-font-specification:'League Gothic, Ultra-Condensed';text-align:end;text-anchor:end;stroke-width:0.353789"
                      >
                        <path
                          d="M 6.9125229,5.1426897 7.2049893,7.0578728 H 7.9691756 L 7.5163245,4.6049289 C 7.4408493,4.2086841 7.3748085,3.8030049 7.2993333,3.4161945 L 7.9597412,0.12358906 H 7.1861205 C 7.1012109,0.68021864 6.9974325,1.2462826 6.9125229,1.8029122 L 6.6389253,0.12358906 H 5.8653045 L 6.1955085,1.774609 c 0.094344,0.518892 0.2264256,1.1226935 0.330204,1.6415855 L 5.8558701,7.0578728 h 0.7641864 z"
                          id="path1656"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </i>
            </button>
            <button type="button" class="tooltip tooltip-top tooltip-neutral" data-tip="AMC">
              <i>
                <svg
                  viewBox="0 0 8.4759316 8.4576318"
                  version="1.1"
                  id="svg4191"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:svg="http://www.w3.org/2000/svg"
                  class="w-5 h-5 lg:w-6 lg:h-6 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest hover:stroke-coopmaths-action-lightest stroke-coopmaths-action dark:stroke-coopmathsdark-action dark:hover:stroke-coopmathsdark-action-lightest"
                >
                  <defs id="defs4188" />
                  <g id="layer1" transform="translate(0.00463201,-0.00451693)">
                    <g id="g4703" transform="matrix(0.68088189,0,0,0.64722958,-14.592662,0.40513752)">
                      <path id="rect9846" style="display:inline;fill:none;stroke-width:1.08479" d="M 21.967594,0.542395 H 33.331265 V 11.906066 H 21.967594 Z" />
                      <path
                        style="display:inline;fill-opacity:1;stroke-width:0.353;stroke-dasharray:none"
                        d="m 30.187147,10.138692 c -3.21818,-4.0175496 -3.01441,-3.9353796 -5.07458,-2.0463796 -4.03864,3.7030996 -4.28539,3.6763596 -0.9908,-0.10736 1.03241,-1.18568 1.8771,-2.22601 1.8771,-2.31183 0,-0.0858 -0.79128,-0.54447 -1.7584,-1.01921 -1.93433,-0.94953 -2.0473,-1.18716 -1.13073,-2.37828 l 0.62296,-0.80956 1.45065,1.05084 c 0.79785,0.57796 1.56133,1.22995 1.69663,1.44886 0.33319,0.53911 1.85035,-1.5541 2.36047,-3.25671996 0.27287,-0.91077 0.60202,-1.32803 1.0476,-1.32803 1.07062,0 0.77611,1.39994 -0.80291,3.81656996 -1.45263,2.22318 -1.45263,2.22318 -0.75445,2.99567 1.35314,1.49715 3.64953,5.2880896 3.54188,5.8470396 -0.0716,0.3719 -0.78625,-0.27974 -2.08542,-1.90161 z"
                        id="path6447"
                      />
                    </g>
                  </g>
                </svg>
              </i>
            </button>
            <button
              type="button"
              class="tooltip tooltip-top tooltip-neutral"
              data-tip="Moodle"
              on:click={() => {
                globalOptions.update((params) => {
                  params.v = "moodle"
                  return params
                })
              }}
            >
              <i>
                <svg
                  viewBox="0 0 8.4666661 8.4666661"
                  version="1.1"
                  id="svg2697"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:svg="http://www.w3.org/2000/svg"
                  class="w-7 h-7 lg:w-9 lg:h-9 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest"
                >
                  <defs id="defs2694" />
                  <g id="layer1">
                    <path
                      id="path5800"
                      d="M 5.6190408,1.3436103 C 3.1929106,1.6410426 2.0896442,1.8517723 -6.6666665e-8,3.0631178 L 0.01937674,3.1181452 l 0.1660648,0.00168 c -0.0151705,0.1672543 -0.0417532,0.580651 -0.00793,1.2022881 -0.2318563,0.6710048 -0.005861,1.1268667 0.20632167,1.622751 0.0336508,-0.51578 0.0301858,-1.0806985 -0.12822484,-1.6428984 -0.0331509,-0.6174618 -0.005861,-1.0234456 0.009137,-1.1813718 l 1.38524723,0.013274 a 6.3367299,6.3367299 0 0 0 0.041012,0.8119988 c 2.413e-4,7.41e-5 4.827e-4,1.465e-4 7.24e-4,2.465e-4 -0.019394,0.1136922 -0.029686,0.2337457 -0.029686,0.3610258 V 7.1230563 H 3.0168247 V 4.4640923 C 3.0166023,4.3152495 3.0333743,4.1870108 3.0661804,4.0780232 3.4148371,4.0207547 3.7437413,3.892485 4.0371069,3.6999667 4.2663963,3.8138486 4.3816797,4.0680313 4.3816797,4.4640923 v 2.658964 h 1.354546 V 4.4640923 C 5.7372083,3.9080313 5.9669011,3.6300947 6.425373,3.6302654 6.8838432,3.6304378 7.1130792,3.9083588 7.1130792,4.4640923 v 2.658964 H 8.4666667 V 4.3070919 C 8.466496,3.7267978 8.2649892,3.2877561 7.8621894,2.9899135 7.5078576,2.7238375 7.0286125,2.5907977 6.4244128,2.5907977 c -0.6608527,0 -1.1162405,0.1571004 -1.3661083,0.4713116 -0.066043,-0.071577 -0.1408956,-0.1345516 -0.2236867,-0.1898186 5e-5,-9.82e-5 1.207e-4,-1.982e-4 1.948e-4,-2.879e-4 C 4.6513449,2.6664276 4.2917878,2.3859638 4.2917878,2.3859638 L 5.636261,1.403525 Z"
                    />
                  </g>
                </svg>
              </i>
            </button>
          </div>
          <div class="flex-1 overflow-y-scroll overscroll-auto">
            {#each $exercicesParams as paramsExercice, i (paramsExercice)}
              <div id="exo{i}" animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
                <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} />
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="flex flex-col justify-start text-coopmaths-corpus dark:text-coopmathsdark-corpus md:px-10 py-6 md:py-40">
          <div class="animate-pulse flex flex-col md:flex-row justify-start space-x-6 items-center">
            <div class="mt-[10px]"><i class="bx {deviceType() === 'mobile' ? 'bx-chevron-up' : 'bx-chevron-left'}  text-[50px]" /></div>
            <div class="font-extralight text-[50px]">Sélectionner les exercices</div>
          </div>
        </div>
      {/if}
    </main>
    <Footer />
  </div>
</div>

<style>
  ::-webkit-scrollbar {
    display: none;
  }
  #startComponent {
    scrollbar-width: none;
  }
</style>
