<script lang="ts">
  import {creerDocumentAmc} from "../lib/amc/creerDocumentAmc.js"
  import {context} from "../modules/context.js"
  import {MathaleaGetExercicesFromParams, MathaleaUpdateExercicesParamsFromUrl} from "../lib/Mathalea"
  import Footer from "./Footer.svelte"
  import {darkMode, exercicesParams} from "./store"
  import type TypeExercice from "./utils/typeExercice"
  import FormRadio from "./forms/FormRadio.svelte"
  import NavBarV2 from "./header/NavBarV2.svelte"
  import ModalActionWithDialog from "./modal/ModalActionWithDialog.svelte"
  import {showDialogForLimitedTime} from "./utils/dialogs.js"
  import {MathaleaGenerateSeed, MathaleaUpdateUrlFromExercicesParams} from "../lib/Mathalea.js"
  import seedrandom from "seedrandom"
  import Button from "./forms/Button.svelte"
  import ModalMessageBeforeAction from "./modal/ModalMessageBeforeAction.svelte"
  import {onMount} from "svelte"
  
  let exercices: TypeExercice[] = []
  let content = ""
  let entete = "AMCcodeGrid"
  let format = "A4"
  let matiere = ""
  let titre = ""
  let nbQuestionsModif: number[] = []
  
  type NbQuestionsIndexees = {
    indexExercice: number
    nombre: number
  }
  
  let nbQuestions: Array<NbQuestionsIndexees> = []
  let nbQuestionsString = "1"
  let nbExemplaires = 1
  let textForOverleaf: HTMLInputElement
  
  async function initExercices() {
    await MathaleaUpdateExercicesParamsFromUrl()
    exercices = await MathaleaGetExercicesFromParams($exercicesParams)
    for (const exercice of exercices) {
      context.isHtml = false
      context.isAmc = true
      seedrandom(exercice.seed, {global: true})
      exercice.nouvelleVersion()
    }
  }
  
  initExercices()
  
  $: {
    // ToDo vérifier la saisie utilisateur
    // Si les copies sont préremplies, c'est un seul exemplaire pour ne pas avoir plusieurs sujets avec le même nom
    if (entete === "AMCassociation") nbExemplaires = 1
    // On récupère les nombres de questions par groupe indexé sur l'index d'exercice dans exercices
    nbQuestions = nbQuestionsModif.map((elt, i) => {
      if (elt !== null) return Number(elt)
    })
    // on blinde le nbExemplaires qui ne peut être 0 ou undefined
    if (nbExemplaires == null) nbExemplaires = 1
    for (let i = 0; i < exercices.length; i++) {
      const exo = exercices[i]
      const nbQ = nbQuestions.find((elt) => elt.indexExercice === i)
      if (nbQ != null) {
        if (exo.nbQuestions < nbQ.nombre) {
          exo.nbQuestions = nbQ.nombre * nbExemplaires
          context.isHtml = false
          context.isAmc = true
          seedrandom(exo.seed, {global: true})
          exo.nouvelleVersion()
        }
      }
    }
    console.log(nbQuestions)
    content = creerDocumentAmc({
      exercices,
      typeEntete: entete,
      format,
      matiere,
      titre,
      nbQuestions,
      nbExemplaires,
    })
  }
  
  /**
   * Copier le code LaTeX dans le presse-papier
   * @param {string} dialogId id attaché au composant
   * @author sylvain
   */
  async function copyLaTeXCodeToClipBoard(dialogId: string) {
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
  
  /* =======================================================
   *
   * Mécanismes de gestion du modal d'infos sur OverLeaf
   *
   */
  let modal: HTMLElement
  let overleafForm: HTMLFormElement
  onMount(async () => {
    modal = document.getElementById("overleaf-modal")
    overleafForm = document.getElementById("overleaf-form")
  })
  // click en dehors du modal le fait disparaître
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }
  
  /**
   * Gérer le POST pour Overleaf
   */
  function handleOverLeaf() {
    textForOverleaf.value = encodeURIComponent(content)
    overleafForm.submit()
    modal.style.display = "none"
  }
  
  // =======================================================
</script>

<main class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {$darkMode.isActive ? 'dark' : ''}">
  <NavBarV2 subtitle="AMC"/>
  
  <section class="px-10 py-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <div class="flex flex-col md:flex-row justify-start items-start my-4 space-y-5 md:space-y-0 md:space-x-10">
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Type d'entête</div>
        <FormRadio
          bind:valueSelected={entete}
          labelsValues={[
            { label: "Grille de codage", value: "AMCcodeGrid" },
            { label: "Copies pré-remplies", value: "AMCassociation" },
            { label: "Noms et prénoms manuscrits", value: "manuscrits" },
          ]}
          title="entete"
        />
      </div>
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Format</div>
        <FormRadio
          bind:valueSelected={format}
          labelsValues={[
            { label: "Format A4 portrait", value: "A4" },
            { label: "Format A3 paysage 2 colonnes", value: "A3" },
          ]}
          title="format"
        />
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-start items-start my-4 space-y-5 md:space-y-0 md:space-x-10">
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Matière</div>
        <input
          bind:value={matiere}
          class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          type="text"
        />
      </div>
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Titre</div>
        <input
          bind:value={titre}
          class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          type="text"
        />
      </div>
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Nombre de questions
          par groupe (séparés par des virgules)
        </div>
        {#each exercices as exercice, i}
          <div>
            {exercice.id}{exercice.sup ? `-S:${exercice.sup}` : ""}{exercice.sup2 ? `-S2:${exercice.sup2}` : ""}{exercice.sup3 ? `-S3:${exercice.sup3}` : ""}
            <input
              type="text"
              class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
              placeholder={exercice.nbQuestions.toString()}
              bind:value={nbQuestionsModif[i]}
            />
            <button
              class="mx-2 tooltip tooltip-left"
              data-tip="Nouvel énoncé"
              type="button"
              on:click={() => {
                exercice.seed = MathaleaGenerateSeed()
                seedrandom(exercice.seed, { global: true })
                exercice.nouvelleVersion()
                $exercicesParams[i].alea = exercice.seed
                MathaleaUpdateUrlFromExercicesParams()
              }}><i
              class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-refresh"/>
            </button
            >
          </div>
        {/each}
      </div>
      <div>
        <div class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Nombre
          d'exemplaires distincts
        </div>
        <input
          bind:value={nbExemplaires}
          class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          min="1"
          type="number"
        />
      </div>
    </div>
    
    <div class="flex flex-col md:flex-row justify-start items-start my-4 space-y-5 md:space-y-0 md:space-x-10 mt-8">
      <ModalActionWithDialog
        dialogId="latexCopy"
        message="Le code LaTeX a été copier dans le presse papier"
        messageError="Impossible de copier le code dans le presse-papier !"
        on:display={() => {
          copyLaTeXCodeToClipBoard("latexCopy")
        }}
        title="Copier le code LaTeX"
      />
      <Button
        idLabel="open-btn"
        on:click={() => {
          modal.style.display = "block"
        }}
        title="Compiler sur OverLeaf"
      />
    </div>
    <pre
      class="my-10 shadow-md bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus dark:text-coopmathsdark-corpus p-4 w-full overflow-auto">
      {content}
    </pre>
  </section>
  <!-- Message avant envoi sur Overleaf -->
  <ModalMessageBeforeAction buttonTitle="Continuer" icon="bxs-error" modalId="overleaf-modal"
                            on:action={handleOverLeaf}>
    <span slot="header">Attention !</span>
    <ul class="list-inside list-disc text-left text-base" slot="content">
      <li>Il faudra uploader sur Overleaf le package <span class="font-mono bg-coopmaths-warn-100">automultiplechoice.sty</span>
        pour compiler.
      </li>
      <li>Le fichier sortit d’Overleaf ne constitue qu’un aperçu.</li>
      <li>Le fichier doit être compilé sous AMC impérativement pour que le fichier soit fonctionnel.</li>
    </ul>
  </ModalMessageBeforeAction>
  <!-- Formulaire pour Overleaf -->
  <form action="https://www.overleaf.com/docs" id="overleaf-form" method="POST" target="_blank">
    <input autocomplete="off" bind:this={textForOverleaf} name="encoded_snip" type="hidden" value=""/>
    <input autocomplete="off" name="snip_name" type="hidden" value="CoopMaths"/>
    <input autocomplete="off" name="engine" type="hidden" value="lualatex"/>
  </form>
  <Footer/>
</main>
