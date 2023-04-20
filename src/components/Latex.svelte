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
  import ModalActionWithDialog from "./modal/ModalActionWithDialog.svelte"
  import { showDialogForLimitedTime } from "./utils/dialogs.js"
  import { downloadFileFromURL } from "./utils/urls"
  import JSZip from "jszip"
  import JSZipUtils from "jszip-utils"
  import { saveAs } from "file-saver"

  let nbVersions = 1
  let title = ""
  let reference = ""
  let subtitle = ""
  let style: "Coopmaths" | "Classique" | "Can" = "Coopmaths"
  let textForOverleafInput: HTMLInputElement
  let dialogLua: HTMLDialogElement
  let exercices: TypeExercice[]
  let contents = { content: "", contentCorr: "" }
  let isExerciceStaticInTheList = false
  let downloadPicsModal: HTMLElement
  let picsWanted: boolean
  let messageForCopyPasteModal: string
  let picsNames: string[][] = []
  let exosContentList: string[] = []
  let linkForOverleaf: HTMLLinkElement
  let imagesList: any[] = []

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
    messageForCopyPasteModal = buildMessageForCopyPaste()
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
   * Construire la liste des URLs pour les fichiers des images nécessaires
   * ### Remarques :
   * * Chaque URL est construite à partir de l'adresse du site Coopmaths
   * * Elle a __toujours__ pour forme `https://coopmaths.fr/alea/static/<serie>/<annee>/tex/<format>/<nom_image>.<format>`
   * * Elle présuppose donc que les images sont toutes au format `eps` et qu'elles ne sont pas stockées ailleurs.
   * @author sylvain
   */
  function buildImagesUrlsList() {
    let imagesFilesUrls = []
    getImagesInCode()
    exosContentList.forEach((exo, i) => {
      const year = exo.groups.year
      const month = exo.groups.month
      const area = exo.groups.zone.replace(/ /g, "_")
      const serie = exo.groups.serie.toLowerCase()
      for (const file of picsNames[i]) {
        // imagesFilesUrls.push({ url: `https://raw.githubusercontent.com/mathalea/dnb/master/${year}/tex/eps/${fileName}.eps`, fileName: `${fileName}.eps` })
        // https://coopmaths.fr/alea/static/dnb/2022/tex/eps/arbresCP.eps
        // https://coopmaths.fr/alea/static/crpe/2022/images/2022-g1-ex1-img1.png
        if (serie === "crpe") {
          imagesFilesUrls.push({ url: `https://coopmaths.fr/alea/static/${serie}/${year}/images/${file.name}.${file.format}`, fileName: `${file.name}.${file.format}` })
        } else {
          imagesFilesUrls.push({ url: `https://coopmaths.fr/alea/static/${serie}/${year}/tex/${file.format}/${file.name}.${file.format}`, fileName: `${file.name}.${file.format}` })
        }
      }
    })
    return imagesFilesUrls
  }

  /**
   * Gérer le téléchargement des images dans une archive `images.zip` lors du clic sur le bouton du modal
   * @author sylvain
   */
  function handleActionFromDownloadPicsModal() {
    // construire la liste des URLs avec les noms de fichiers correspondants
    const imagesFilesUrls = buildImagesUrlsList()
    // construire l'archive
    let zip = new JSZip()
    const zipFileName = "images.zip"
    let count = 0
    imagesFilesUrls.forEach((image) => {
      JSZipUtils.getBinaryContent(image.url, (err, data) => {
        if (err) {
          throw err
        }
        zip.file(image.fileName, data, { binary: true })
        count++
        if (count === imagesFilesUrls.length) {
          zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, zipFileName)
          })
        }
      })
    })
    downloadPicsModal.style.display = "none"
  }

  /**
   * Constituer la liste des noms des images présentes dans le code de la feuille d'exercices.
   * ### Principe :
   * * Les deux variables globales `exosContentList` et `picsNames` servent à stocker le contenu de chaque
   * exercice et le nom de chaque images.
   * * Découpe le contenu du code LaTeX pour identifier les exercices en détectant
   * le texte entre les deux chaînes `\begin{EXO}` ... `\end{EXO}` (hormi les corrections où `\begin{EXO}`
   * est systématiquement suivi de `{}` vides)
   * * Dans le code de chaque exercice, on repère la commande `\includegraphics` dans les lignes non précédées d'un signe `%`
   * et on récupère le nom du fichier sans l'extension.
   * ### Remarques :
   * * `picsNames` est une tableau de tableaux au cas où des exercices contiendraient plusieurs figures
   * * les figures dans les corrections ne sont pas concernées.
   * * cette fonction est aussi responsable de l'assignation de la variable `exosContentList`
   * @author sylvain
   */
  function getImagesInCode() {
    let picsList: string[][] = []
    picsNames = []
    exosContentList = []
    const regExpExo = /(?:\\begin\{EXO\}\{(?<title>(?<serie>[A-Z\d]{3,4})(?:\s*)(?<month>.*?)(?:\s*)(?<year>\d{4})(?:\s*)(?<zone>.*?)(?:\s*))\})((.|\n)*?)(?:\\end\{EXO\})/gm
    const regExpImage = /^(?:(?!%))(?:.*?)\\includegraphics(?:\[.*?\])?\{(?<fullName>.*?)\}/gm
    const regExImageName = /(?<name>.*?)\.(?<format>.*)$/gm
    const latexCode = contents.content
    exosContentList = [...latexCode.matchAll(regExpExo)]
    for (const exo of exosContentList) {
      const pics = [...exo[0].matchAll(regExpImage)]
      picsList.push(pics)
    }
    picsList.forEach((list, index) => {
      picsNames.push([])
      for (const item of list) {
        const imgFile = [...item[1].matchAll(regExImageName)]
        console.log("image : " + item[1])
        // picsNames[index] = [...picsNames[index], item[1].replace(/\.(?:jpg|gif|png|eps|pdf)$/g, "")]
        imgFile.forEach((element) => {
          console.log("name : " + element.groups.name)
          picsNames[index] = [...picsNames[index], { name: element.groups.name, format: element.groups.format }]
        })
      }
    })
  }

  /**
   * Gérer l'affichage du modal : on donne la liste des images par exercice
   */
  function handleDownloadPicsModalDisplay() {
    getImagesInCode()
    downloadPicsModal.style.display = "block"
  }

  /**
   * Détecter si le code LaTeX contient des images
   */
  function doesLatexNeedsPics() {
    const includegraphicsMatches = contents.content.match("includegraphics")
    return includegraphicsMatches !== null
  }

  /**
   * Construction d'un message contextualisé indiquant le besoin de télécharger les images si besoin
   */
  function buildMessageForCopyPaste() {
    if (picsWanted) {
      return `<p>Le code LaTeX a été copié dans le presse-papier.</p>
        <p class="font-bold text-coopmaths-warn-darkest">Ne pas oublier de télécharger les figures !</p>`
    } else {
      return "Le code LaTeX a été copié dans le presse-papier."
    }
  }
  //====================== Fin Modal figures ====================================

  initExercices()

  $: {
    contents = latex.getContents(style, nbVersions)
  }

  /**
   * Récupérer le contenu du code LaTeX des exercices (sans préambule) dans la page HTML
   * et le copier dans le presse-papier.
   */
  const copyExercices = async () => {
    try {
      const text = document.querySelector("pre").innerText
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Accès au presse-papier impossible: ", err)
    }
  }

  /**
   * Copier le code LaTeX dans le presse-papier
   * @param {string} dialogId id attaché au composant
   * @author sylvain
   */
  async function copyLaTeXCodeToClipBoard(dialogId: string) {
    const text = document.querySelector("pre").innerText
    navigator.clipboard.writeText(text).then(
      () => {
        showDialogForLimitedTime(dialogId + "-1", 2000)
      },
      (err) => {
        console.error("Async: Could not copy text: ", err)
        showDialogForLimitedTime(dialogId + "-2", 1000)
      }
    )
  }

  const copyDocument = async () => {
    try {
      const text = await latex.getFile({ title, reference, subtitle, style, nbVersions })
      await navigator.clipboard.writeText(text)
      dialogLua.showModal()
      setTimeout(() => {
        dialogLua.close()
      }, 3000)
    } catch (err) {
      console.error("Accès au presse-papier impossible: ", err)
    }
  }

  /**
   * Construit l'archive ZIP contenant le code LaTeX et tous les fichiers images nécessaires pour la compilation du code LaTeX
   * @param {string} archiveName nom donné pour l'archive
   * @author sylvain
   */
  async function buildZipFileForOverleaf(archiveName: string = "coopmaths") {
    const zip = new JSZip()
    const text = await latex.getFile({ title, reference, subtitle, style, nbVersions })
    zip.file("main.tex", text)
    if (picsWanted) {
      const urls = buildImagesUrlsList()
      console.log("URLs:" + urls.length)
      const imagesFolder = zip.folder("images")
      let count = 0
      urls.forEach((image) => {
        console.log(image.fileName + " / " + image.url)
        JSZipUtils.getBinaryContent(image.url, (err, data) => {
          if (err) {
            throw err
          }
          imagesFolder.file(image.fileName, data, { binary: true })
          count++
          if (count === urls.length) {
            zip.generateAsync({ type: "blob" }).then((content) => {
              // saveAs(content, [archiveName.replace(/\.(?:.*)$/g, ""), "zip"].join("."))
              saveAs(content, [archiveName, "zip"].join("."))
            })
          }
        })
      })
    }
  }

  /**
   * Construction du matériel nécessaire au téléversement vers Overleaf :
   * -- constitution des URLs pour le téléchargement des images (elles doivent pointer vers un serveur)
   * -- encodage du contenu du code LaTeX de la feuille d'exercices
   */
  const copyDocumentToOverleaf = async () => {
    imagesList = buildImagesUrlsList()
    const text = await latex.getFile({ title, reference, subtitle, style, nbVersions })
    textForOverleafInput.value = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(text)))
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
    <div class="flex flex-col md:flex-row mx-4 pb-4 md:pb-8 md:space-x-4 space-y-3 justify-center md:justify-start items-center">
      <form method="POST" action="https://www.overleaf.com/docs" target="_blank">
        {#each imagesList as image}
          <input type="hidden" name="snip_uri[]" value={image.url} autocomplete="off" />
          <input type="hidden" name="snip_name[]" value={image.fileName} autocomplete="off" />
        {/each}
        <input type="hidden" name="snip_uri[]" bind:this={textForOverleafInput} autocomplete="off" />
        <input type="hidden" name="snip_name[]" value="coopmath.tex" autocomplete="off" />
        <input type="hidden" name="engine" value="lualatex" autocomplete="off" />
        <button
          id="btn_overleaf"
          type="submit"
          on:click={copyDocumentToOverleaf}
          class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
        >
          Compiler en PDF sur Overleaf.com
        </button>
        <!-- <Button title="Copier le code LaTeX des exercices" on:click={copyExercices} /> -->
        <div class="flex flex-col md:flex-row justify-start space-x-0 space-y-2 mt-6 md:space-x-4 md:space-y-0">
          <ModalActionWithDialog
            on:display={() => {
              copyLaTeXCodeToClipBoard("copyPasteModal")
            }}
            message={messageForCopyPasteModal}
            messageError="Impossible de copier le code LaTeX dans le presse-papier"
            tooltipMessage="Code LaTeX dans presse-papier"
            dialogId="copyPasteModal"
            title="Copier le code LaTeX des exercices"
          />
          <Button title="Copier le code LaTeX complet (avec préambule)" on:click={copyDocument} />
          <Button idLabel="downloadPicsButton" on:click={handleDownloadPicsModalDisplay} title="Télécharger uniquement les figures" isDisabled={!picsWanted} />
          <Button idLabel="downloadFullArchive" on:click={buildZipFileForOverleaf} title="Téléchager l'archive complète" />
        </div>
      </form>
    </div>
    <ModalMessageBeforeAction
      modalId="downloadPicsModal"
      modalButtonId="downloadPicsModalButton"
      modalButtonTitle="Télécharger les figures"
      icon="bxs-file-png"
      on:action={handleActionFromDownloadPicsModal}
    >
      <span slot="header">Figures</span>
      <div slot="content" class="flex flex-col justify-start items-start">
        Voici ce dont vous aurez besoin :
        {#each exosContentList as exo, i (exo)}
          <ul class="flex flex-col justify-start items-start list-disc pl-6">
            <li class={picsNames[i].length > 0 ? "container" : "hidden"}>Exercice {i + 1} (<span class="text-italic">{exo.groups.title}</span>) :</li>
            <ul class="flex flex-col justify-start items-start list-none pl-4">
              {#each picsNames[i] as img}
                <li class="font-mono text-sm">{img.name}</li>
              {/each}
            </ul>
          </ul>
        {/each}
      </div>
    </ModalMessageBeforeAction>

    <dialog bind:this={dialogLua} class="rounded-xl bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light font-light shadow-lg">
      {@html messageForCopyPasteModal}
      <p class="mt-4">Il faudra utiliser <em class="text-coopmaths-warn-darkest dark:text-coopmathsdark-warn-darkest font-bold">LuaLaTeX</em> pour compiler le document</p>
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
