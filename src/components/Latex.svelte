<script lang="ts">
  import { exercicesParams, darkMode } from "./store"
  import { MathaleaGetExercicesFromParams, MathaleaUpdateExercicesParamsFromUrl, MathaleaUpdateUrlFromExercicesParams } from "../lib/Mathalea.js"
  import type TypeExercice from "./utils/typeExercice"
  import Footer from "./Footer.svelte"
  import NavBarV2 from "./header/NavBarV2.svelte"
  import Latex from "../lib/Latex"
  import Button from "./forms/Button.svelte"
  import FormRadio from "./forms/FormRadio.svelte"
  import { onMount } from "svelte"
  import { deviceType } from "./utils/measures"
  import ModalMessageBeforeAction from "./modal/ModalMessageBeforeAction.svelte"

  let nbVersions = 1
  let title = ""
  let reference = ""
  let subtitle = ""
  let style: "Coopmaths" | "Classique" | "Can" = "Coopmaths"
  let textForOverleaf: HTMLInputElement
  let dialogLua: HTMLDialogElement
  let exercices: TypeExercice[]
  let contents = { content: "", contentCorr: "" }
  let isExerciceStaticInTheList = false
  let downloadPicsModal: HTMLElement
  let picsWanted: boolean

  const latex = new Latex()
  async function initExercices() {
    MathaleaUpdateExercicesParamsFromUrl()
    exercices = await MathaleaGetExercicesFromParams($exercicesParams)
    for (const exercice of exercices) {
      if (exercice.typeExercice === "statique") {
        isExerciceStaticInTheList = true
        break
      }
    }
    latex.addExercices(exercices)
    contents = latex.getContents(style, nbVersions)
    picsWanted = doesLatexNeedsPics()
  }

  onMount(() => {
    MathaleaUpdateUrlFromExercicesParams($exercicesParams)
    downloadPicsModal = document.getElementById("downloadPicsModal")
  })

  /* ============================================================================
  *
  *                Modal pour le téléchargement des figures
  * 
  ===============================================================================*/
  // click en dehors du moda de téléchargement des figures le fait disparaître
  window.onclick = function (event) {
    if (event.target == downloadPicsModal) {
      downloadPicsModal.style.display = "none"
    }
  }
  /**
   * Gérer le téléchargement lors du clic sur le bouton du modal
   */
  function handleActionFromDownloadPicsModal() {
    console.log("figures ? : " + doesLatexNeedsPics())
    downloadPicsModal.style.display = "none"
  }

  function doesLatexNeedsPics() {
    const includegraphicsMatches = contents.content.match("includegraphics")
    return includegraphicsMatches !== null
  }
  //====================== Fin Modal figures ====================================

  initExercices()

  $: {
    contents = latex.getContents(style, nbVersions)
  }

  const copyExercices = async () => {
    try {
      const text = document.querySelector("pre").innerText
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Accès au presse-papier impossible: ", err)
    }
  }

  const copyDocument = async () => {
    try {
      const text = await latex.getFile({ title, reference, subtitle, style, nbVersions })
      await navigator.clipboard.writeText(text)
      dialogLua.showModal()
      setTimeout(() => {
        dialogLua.close()
      }, 2000)
    } catch (err) {
      console.error("Accès au presse-papier impossible: ", err)
    }
  }

  const copyDocumentToOverleaf = async () => {
    const text = await latex.getFile({ title, reference, subtitle, style, nbVersions })
    textForOverleaf.value = encodeURIComponent(text)
  }
</script>

<main class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {$darkMode.isActive ? 'dark' : ''}">
  <NavBarV2 subtitle="LaTeX" />

  <section class="px-4 py-0 md:py-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <h1 class="mb-4 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-2xl md:text-4xl font-bold">Paramétrage</h1>
    <div class="w-full flex flex-col space-x-5">
      <div class="flex flex-col mb-2 md:mb-8 md:flex-row justify-start items-start">
        <h2 class="text-xl ml-4 md:text-2xl font-bold md:mr-10 mb-2 md:mb-0 text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Mise en page</h2>
        <div class="pb-4 md:pb-0 md:pt-1">
          <FormRadio
            title="Style"
            orientation={deviceType() === "mobile" ? "col" : "row"}
            bind:valueSelected={style}
            labelsValues={[
              { label: "Coopmaths", value: "Coopmaths" },
              { label: "Classique", value: "Classique" },
              { label: "Course aux nombres", value: "Can", isDisabled: isExerciceStaticInTheList },
            ]}
          />
        </div>
      </div>

      <div class="flex flex-col lg:flex-row space-x-0 lg:space-x-4 space-y-3 lg:space-y-0">
        <h2 class="ml-0 text-xl md:text-2xl font-bold md:mr-10 mb-2 lg:mb-0 text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Éléments de titres</h2>
        <input
          type="text"
          class="border-1 disabled:opacity-20 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          placeholder={style === "Can" ? "Course aux nombres" : "Titre"}
          bind:value={title}
          disabled={style === "Can"}
        />
        <input
          type="text"
          class="border-1 disabled:opacity-20 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          placeholder={style === "Coopmaths" ? "Référence" : "Haut de page gauche"}
          bind:value={reference}
          disabled={style === "Can"}
        />
        <input
          type="text"
          class="border-1 disabled:opacity-20 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          placeholder={style === "Coopmaths" ? "Sous-titre / Chapitre" : "Pied de page droit"}
          bind:value={subtitle}
          disabled={style === "Can"}
        />
      </div>
      <div class="flex flex-col md:flex-row mt-6">
        <h2 class="text-xl md:text-2xl font-bold md:mr-10 mb-2 md:mb-0 text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Nombre de versions des exercices</h2>
        <input
          type="number"
          class="border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          name="numberOfVersions"
          maxlength="2"
          min="1"
          max="20"
          bind:value={nbVersions}
        />
      </div>
    </div>

    <h1 class="mt-12 mb-4 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-2xl md:text-4xl font-bold">Exportation</h1>
    <form class="flex flex-col md:flex-row mx-4 pb-4 md:pb-8 md:space-x-4 space-y-3" method="POST" action="https://www.overleaf.com/docs" target="_blank">
      <input type="hidden" name="encoded_snip" value="" bind:this={textForOverleaf} autocomplete="off" />
      <input type="hidden" name="snip_name" value="CoopMaths" autocomplete="off" />
      <input type="hidden" name="engine" value="lualatex" autocomplete="off" />
      <button
        id="btn_overleaf"
        type="submit"
        on:click={copyDocumentToOverleaf}
        class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
      >
        Compiler en PDF sur Overleaf.com
      </button>
      <div class="hidden md:block w-10" />
      <div class="block md:hidden h-6" />
      <Button title="Copier le code LaTeX des exercices" on:click={copyExercices} />
      <Button title="Copier le code LaTeX complet (avec préambule)" on:click={copyDocument} />
      <Button
        idLabel="downloadPicsButton"
        on:click={() => {
          downloadPicsModal.style.display = "block"
        }}
        title="Télécharger les figures"
        isDisabled={!picsWanted}
      />
      <ModalMessageBeforeAction
        modalId="downloadPicsModal"
        modalButtonId="downloadPicsModalButton"
        modalButtonTitle="Télécharger les figures"
        icon="bxs-file-png"
        on:action={handleActionFromDownloadPicsModal}
      >
        <span slot="header">Figures</span>
        <div slot="content">Blabla</div>
      </ModalMessageBeforeAction>
    </form>

    <dialog bind:this={dialogLua} class="rounded-xl bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg">
      <p>Le contenu a été copié dans le presse-papier.</p>
      <p>Il faudra utiliser <em class="text-coopmaths font-bold">LuaLaTeX</em> pour compiler le document</p>
    </dialog>

    <h1 class="mt-12 md:mt-8 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-2xl md:text-4xl font-bold">Code</h1>
    <pre class="my-10 shadow-md bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus dark:text-coopmathsdark-corpus p-4 w-full overflow-auto">
      {contents.content}

%%%%%%%%%%%%%%%%%%%%%%
%%%   CORRECTION   %%%
%%%%%%%%%%%%%%%%%%%%%%

      {contents.contentCorr}
  </pre>
  </section>
  <footer>
    <Footer />
  </footer>
</main>

<style>
  footer {
    margin-top: auto;
  }
</style>
