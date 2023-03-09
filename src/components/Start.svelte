<script lang="ts">
  import Exercice from "./exercice/Exercice.svelte"
  import NavBar from "./header/NavBar.svelte"
  import Footer from "./Footer.svelte"
  import Header2 from "./header2/Header2.svelte"
  import NiveauListeExos from "./sidebar/NiveauListeExos.svelte"
  import ModalSettingsVueEleve from "./modal/ModalSettingsVueEleve.svelte"
  import { exercicesParams, globalOptions, darkMode } from "./store"
  import codeList from "../json/codeToLevelList.json"
  import referentiel from "../json/referentiel2022.json"
  import referentielStatic from "../json/referentielStatic.json"
  import { Mathalea } from "../Mathalea"
  import { flip } from "svelte/animate"
  import { onMount } from "svelte"
  import { toMap } from "./utils/toMap"

  import SearchExercice from "./sidebar/SearchExercice.svelte"

  import { isRecent } from "./utils/handleDate"

  let isNavBarVisible = true
  let filtre = "all"
  let divExercices: HTMLDivElement
  let zoom = 1
  let setAllInteractifClicked = false

  // Récupération des informations de l'URL
  let isInitialUrlHandled = false
  function urlToDisplay() {
    const urlOptions = Mathalea.loadExercicesFromUrl()
    globalOptions.update(() => {
      return urlOptions
    })
    isInitialUrlHandled = true
    zoom = Number(urlOptions.z)
  }
  onMount(urlToDisplay)
  addEventListener("popstate", urlToDisplay)

  // Mise à jour de l'URL dès que l'on change exercicesParams (sauf pour l'URL d'arrivée sur la page)
  $: {
    if (isInitialUrlHandled) Mathalea.updateUrl($exercicesParams)
    if ($globalOptions.v === "l") {
      isSideMenuVisible = false
      isNavBarVisible = false
    } else if ($globalOptions.v === "l2") {
      isSideMenuVisible = false
      isNavBarVisible = true
    } else if ($globalOptions.v === "eleve") {
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
  delete filteredReferentiel['Calcul mental']
  filteredReferentiel['3e']['Brevet des collèges par thèmes - APMEP'] =
    filteredReferentiel['static']['Brevet des collèges par thèmes - APMEP']
  filteredReferentiel['PE']['Concours 2022'] = filteredReferentiel['static']['CRPE (2022) par année']
  filteredReferentiel['PE']['Concours 2022 - Par thèmes'] = filteredReferentiel['static']['CRPE (2022) par thèmes']
  filteredReferentiel['PE']['CRPE (2015-2019) par thèmes - COPIRELEM'] =
    filteredReferentiel['static']['CRPE (2015-2019) par thèmes - COPIRELEM']
  filteredReferentiel['PE']['CRPE (2015-2019) par année - COPIRELEM'] =
    filteredReferentiel['static']['CRPE (2015-2019) par année - COPIRELEM']
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

    /**
     * Construit un object contenant les références des exercices ayant une date
     * de modification ou de publication récente (<= 1mois)
     * en parcourant récursivement l'objet passé en paramètre
     * Inspiration : {@link https://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list/53620876#53620876}
     * @param {any} obj objet à parcourir (récursivement)
     * @return {[string]} objet des exos nouveaux
     * @author sylvain
     */
    function getRecentExercises(obj) {
      /**
       * Détecter si une valeur est un objet
       * @param val valeur à analyser
       */
      const isObject = (val) => val && typeof val === "object" && !Array.isArray(val)

      let recentExercises = []
      /**
       * On parcourt récursivement l'objet référentiel et on en profite pour peupler
       * le tableau recentExercises avec les exercices dont les dates de publication
       * ou de modification sont récentes
       * @param obj Objet à parcourir
       */
      const traverseObject = (obj = {}) => {
        return Object.entries(obj).reduce((product, [key, value]) => {
          if (isObject(value)) {
            if (Object.hasOwn(value, "uuid")) {
              // <-- on arrête la récursivité lorsqu'on tombe sur les données de l'exo
              if (isRecent(value.datePublication) || isRecent(value.dateModification)) {
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

  function startResizing(type, event) {
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
</script>

<svelte:window on:mouseup={stopResizing} />
<div class="h-screen  scrollbar-hide {$darkMode.isActive ? 'dark' : ''}">
  <!-- <Header /> -->
  {#if isNavBarVisible}
    <NavBar />
    <Header2 sideMenuVisible={isSideMenuVisible} on:sideMenuChange={handleSideMenu} />
  {/if}
  <!-- Gestion du mode sombre -->
  <main class="flex h-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus" on:mousemove={resizing}>
    <!-- side menu -->
    {#if isSideMenuVisible || nbExercisesInList === 0}
      <aside style="width:{sidebarWidth}px" class="flex flex-col bg-coopmaths-canvas-dark  dark:bg-coopmathsdark-canvas-dark p-4 overflow-hidden h-full">
        <div class="flex flex-col overflow-y-scroll overscroll-auto">
          <h2 class="inline-flex items-center font-bold text-xl mb-6 text-coopmaths-struct dark:text-coopmathsdark-struct">
            <span>Choix des exercices</span>
          </h2>
          <div class="flex flex-auto mb-2">
            <select
              class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light text-sm border-1  focus:border-1 border-coopmaths-action focus:border-coopmaths-action-lightest dark:border-coopmathsdark-action dark:focus:border-coopmaths-action-lightest focus:outline-0 focus:ring-0 w-full"
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
      </aside>
      <!-- drag bar -->
      <div
        id="dragbar"
        class="flex w-[4px] bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark  hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action hover:cursor-col-resize"
        on:mousedown={startResizing.bind(this, "moving")}
      />
    {/if}
    <!-- content -->
    {#if $exercicesParams.length !== 0}
      <div class="flex-1 flex flex-col px-6 overflow-hidden h-full" bind:this={divExercices}>
        <!-- barre des boutons de réglages pour tous les exercices de la page -->
        <div class="flex flex-row justify-center items-center p-2">
          <button type="button" on:click={zoomMinus} class="tooltip tooltip-left tooltip-neutral" data-tip="Réduire la taille du texte"
            ><i class="bx bx-md px-2 bx-zoom-out hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" /></button
          >
          <button type="button" on:click={zoomPlus} class="tooltip tooltip-left tooltip-neutral" data-tip="Augmenter la taille du texte"
            ><i class="bx bx-md px-2 bx-zoom-in hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" /></button
          >
          <button
            type="button"
            on:click={setAllInteractifClicked ? removeAllInteractif : setAllInteractif}
            class="tooltip tooltip-left tooltip-neutral"
            data-tip={setAllInteractifClicked ? "Supprimer l'interactivité" : "Tous les exercices en interactif"}
            ><i
              class="bx bx-md px-2 tooltip-left tooltip-neutral  hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest {setAllInteractifClicked
                ? 'bxs-edit'
                : 'bx-edit'}"
            /></button
          >
          <button type="button" on:click={newDataForAll} class="tooltip tooltip-left tooltip-neutral" data-tip="Nouveaux énoncés">
            <i class="bx bx-md px-2 bx-refresh  hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
          </button>
          <button
            type="button"
            on:click={() => {
              $exercicesParams.length = 0
            }}
            class="tooltip tooltip-left tooltip-neutral"
            data-tip="Supprimer tous les exercices"
          >
            <i class="bx text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx-md px-2 bx-trash" />
          </button>

          {#if $globalOptions.v === "l"}
            <div class="flex flex-row justify-end items-center">
              <button type="button" on:click={quitFullScreen} class="tooltip tooltip-left tooltip-neutral" data-tip="Quitter le plein écran">
                <i
                  class="bx ml-2 bx-md px-2 bx-exit-fullscreen  hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                />
              </button>
            </div>
          {/if}
          {#if $globalOptions.v !== "l"}
            <button
              type="button"
              class="tooltip tooltip-left tooltip-neutral"
              data-tip="Plein écran"
              on:click={() =>
                globalOptions.update((params) => {
                  params.v = "l"
                  return params
                })}
              ><i class="bx bx-md px-2 bx-fullscreen  hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
            </button>
          {/if}

          <button
            type="button"
            class="tooltip tooltip-left tooltip-neutral ml-24 "
            data-tip="Diaporama"
            on:click={() =>
              globalOptions.update((params) => {
                params.v = "diaporama"
                return params
              })}
          >
            <i class="bx bx-md px-2 bx-slideshow  hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
          </button>
          <label for="my-modal" class="tooltip tooltip-left tooltip-neutral" data-tip="Lien pour les élèves">
            <i
              class="bx bx-md px-2 bxs-graduation cursor-pointer hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            />
          </label>
          <ModalSettingsVueEleve />
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
      <div class="flex flex-col justify-start text-coopmaths-corpus dark:text-coopmathsdark-corpus  px-10 py-40">
        <div class="animate-pulse flex flex-row justify-start space-x-6 items-center">
          <div class="mt-[10px]"><i class="bx bx-chevron-left text-[50px]" /></div>
          <div class="font-extralight text-[50px]">Sélectionner les exercices</div>
        </div>
      </div>
    {/if}
  </main>
  <Footer />
</div>
