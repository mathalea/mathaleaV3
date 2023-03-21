<script lang="ts">
  import { creerDocumentAmc, exportQcmAmc } from "../modules/creerDocumentAmc.js"
  import { context } from "../modules/context.js"
  import Mathalea from "../lib/Mathalea"
  import Footer from "./Footer.svelte"
  import { exercicesParams } from "./store"
  import type TypeExercice from "./utils/typeExercice"
  import FormRadio from "./forms/FormRadio.svelte"
  import { darkMode } from "./store"
  import NavBar from "./header/NavBar.svelte"
  import Button from "./forms/Button.svelte"
  import ModalActionWithDialog from "./modal/ModalActionWithDialog.svelte"
  import { showDialogForLimitedTime } from "./utils/dialogs.js"

  let exercices: TypeExercice[] = []
  let content = ""
  let entete = "AMCcodeGrid"
  let format = "A4"
  let matiere = ""
  let titre = ""
  let nbQuestions: number[] = []
  let nbQuestionsString = ""
  let textForOverleaf: HTMLInputElement

  async function initExercices() {
    Mathalea.updateExercicesParamsFromUrl()
    exercices = await Mathalea.getExercicesFromParams($exercicesParams)
    for (const exercice of exercices) {
      context.isHtml = false
      context.isAmc = true
      exercice.nouvelleVersion()
      nbQuestions.push(exercice.nbQuestions)
    }
  }

  initExercices()

  $: {
    // ToDo vérifier la saisie utilisateur
    nbQuestions = nbQuestionsString.split(",").map((e) => parseInt(e))
    content = creerDocumentAmc({ questions: exercices, typeEntete: entete, format, matiere, titre, nbQuestions })

  }

  /**
   * Copier le code LaTeX dans le presse-papier
   * @param {string} dialogId id attaché au composant
   * @author sylvain
   */
  async function copyLaTeXCodeToClipBoard(dialogId) {
    navigator.clipboard.writeText(content).then(
      () => {
        showDialogForLimitedTime(dialogId + "-1", 1000)
      },
      (err) => {
        console.error("Async: Could not copy text: ", err)
        showDialogForLimitedTime(dialogId + "-2", 1000)
      }
    )
  }

  function exportToOverLeaf(): void {
    // à faire !   const text = await latex.getFile({ title, reference, subtitle, style, nbVersions })
    textForOverleaf.value = encodeURIComponent(content)
  }
</script>

<main class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {$darkMode.isActive ? 'dark' : ''}">
  <NavBarV2 subtitle="AMC" />

  <section class="px-10 py-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <div class="flex flex-col md:flex-row justify-start items-start my-4 space-y-5 md:space-y-0 md:space-x-10">
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Type d'entête</div>
        <FormRadio
          title="entete"
          bind:valueSelected={entete}
          labelsValues={[
            { label: "Grille de codage", value: "AMCcodeGrid" },
            { label: "Copies pré-remplies", value: "AMCassociation" },
            { label: "Noms et prénoms manuscrits", value: "manuscrits" },
          ]}
        />
      </div>
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Format</div>
        <FormRadio
          title="format"
          bind:valueSelected={format}
          labelsValues={[
            { label: "Format A4 portrait", value: "A4" },
            { label: "Format A3 paysage 2 colonnes", value: "A3" },
          ]}
        />
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-start items-start my-4 space-y-5 md:space-y-0 md:space-x-10">
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Matière</div>
        <input
          type="text"
          class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          bind:value={matiere}
        />
      </div>
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Titre</div>
        <input
          type="text"
          class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          bind:value={titre}
        />
      </div>
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Nombre de questions</div>
        <input
          type="text"
          class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          bind:value={nbQuestionsString}
        />
      </div>
    </div>

      <form class="my-5 flex-auto w-full" method="POST" action="https://www.overleaf.com/docs" target="_blank">
        <input type="hidden" name="encoded_snip" value="" bind:this={textForOverleaf} autocomplete="off" />
        <input type="hidden" name="snip_name" value="CoopMaths" autocomplete="off" />
        <input type="hidden" name="engine" value="lualatex" autocomplete="off" />
        <button
                id="btn_overleaf"
                type="submit"
                on:click={exportToOverLeaf}
                class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
        >
          Compiler en PDF sur Overleaf.com
        </button>
        <div class="flex flex-col md:flex-row justify-start items-start my-4 space-y-5 md:space-y-0 md:space-x-10 mt-8">
          <ModalActionWithDialog
                  dialogId="latexCopy"
                  title="Copier le code LaTeX"
                  message="Le code LaTeX a été copier dans le presse papier"
                  messageError="Impossible de copier le code dans le presse-papier !"
                  on:display={() => {
          copyLaTeXCodeToClipBoard("latexCopy")
        }}
          />
      </form>
    <pre class="my-10 shadow-md bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus dark:text-coopmathsdark-corpus p-4 w-full overflow-auto">
      {content}
    </pre>
  </section>
  <Footer />
</main>
