<script lang="ts">
  import { onMount, tick } from "svelte"
  import { Mathalea } from "../Mathalea"
  import { exercicesParams } from "./store"
  import type { Exercice } from "./utils/typeExercice"
  import seedrandom from "seedrandom"
  import { tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"
  import QRCode from "qrcode"

  let divQuestion: HTMLElement
  let divTableDurationsQuestions: HTMLElement
  let stepsUl: HTMLUListElement
  let currentQuestion = -1 // -1 pour l'intro et questions[0].length pour l'outro
  let isFullScreen = false
  let isPause = false
  let isCorrectionVisible = false
  let isSameDurationForAll = false
  let userZoom = 3
  let currentZoom = userZoom
  let exercices: Exercice[] = []
  let questions: [string[], string[], string[], string[]] = [[], [], [], []] // Concaténation de toutes les questions des exercices de exercicesParams, vue par vue
  let corrections: [string[], string[], string[], string[]] = [[], [], [], []]
  let sizes: number[] = []
  let consignes: string[] = []
  let durations: number[] = []
  let durationGlobal: number = null
  let ratioTime = 0 // Pourcentage du temps écoulé (entre 1 et 100)
  let progress = tweened(0, {
    duration: durationGlobal ?? durations[currentQuestion] ?? 10,
    easing: cubicOut,
  })
  let myInterval: number
  let currentDuration: number
  let totalDuration: number = null
  let nbOfVues = 1

  onMount(async () => {
    Mathalea.updateUrl($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
      const exercice: Exercice = await Mathalea.load(paramsExercice.uuid)
      if (exercice === undefined) return
      if (paramsExercice.nbQuestions) exercice.nbQuestions = paramsExercice.nbQuestions
      exercice.duration = paramsExercice.duration ?? 10
      if (paramsExercice.titre) exercice.titre = paramsExercice.titre
      if (paramsExercice.id) exercice.id = paramsExercice.id
      if (paramsExercice.sup) exercice.sup = paramsExercice.sup
      if (paramsExercice.sup2) exercice.sup2 = paramsExercice.sup2
      if (paramsExercice.sup3) exercice.sup3 = paramsExercice.sup3
      if (paramsExercice.sup4) exercice.sup4 = paramsExercice.sup4
      if (paramsExercice.interactif) exercice.interactif = paramsExercice.interactif
      if (paramsExercice.alea) exercice.seed = paramsExercice.alea
      if (paramsExercice.cd !== undefined) exercice.correctionDetaillee = paramsExercice.cd === "1"
      exercices.push(exercice)
    }
    exercices = exercices
    updateExercices()
    await tick()
    if (divTableDurationsQuestions) Mathalea.renderDiv(divTableDurationsQuestions)
  })

  function updateExercices() {
    questions = [[], [], [], []]
    corrections = [[], [], [], []]
    consignes = []
    sizes = []
    durations = []
    for (let idVue = 0; idVue < nbOfVues; idVue++) {
      questions[idVue] = []
      corrections[idVue] = []
      for (const exercice of exercices) {
        if (idVue > 0) exercice.seed = exercice.seed + idVue
        if (exercice.typeExercice === "simple") Mathalea.handleExerciceSimple(exercice, false)
        seedrandom(idVue, { global: true })
        exercice.nouvelleVersion()
        questions[idVue] = [...questions[idVue], ...exercice.listeQuestions]
        corrections[idVue] = [...corrections[idVue], ...exercice.listeCorrections]
        questions[idVue] = questions[idVue].map(Mathalea.formatExercice)
        corrections[idVue] = corrections[idVue].map(Mathalea.formatExercice)
      }
    }
    for (const exercice of exercices) {
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        sizes.push(exercice.tailleDiaporama)
        consignes.push(exercice.consigne)
        durations.push(exercice.duration)
      }
    }
    totalDuration = getTotalDuration()
    if (divTableDurationsQuestions) Mathalea.renderDiv(divTableDurationsQuestions)
  }
  function prevQuestion() {
    if (currentQuestion > -1) goToQuestion(currentQuestion - 1)
  }

  function nextQuestion() {
    if (currentQuestion < questions[0].length) goToQuestion(currentQuestion + 1)
  }

  async function goToQuestion(i: number) {
    if (i >= -1 && i <= questions[0].length) currentQuestion = i
    if (i === -1 || i === questions[0].length) pause()
    await tick()
    if (divQuestion) {
      currentZoom = userZoom
      setSize()
    }
    if (!isPause) timer(durationGlobal ?? durations[currentQuestion] ?? 10)
    currentDuration = durationGlobal ?? durations[currentQuestion] ?? 10
  }

  function setSize() {
    if (sizes[currentQuestion]) {
      const size = currentZoom * sizes[currentQuestion]
      divQuestion.style.lineHeight = `${size * 1.2}rem`
      divQuestion.style.fontSize = `${size}rem`
      const qcms = document.querySelectorAll(".monQcm")
      for (const qcm of qcms) {
        ;(qcm as HTMLDivElement).style.fontSize = `${size}px`
      }
      const tables = document.querySelectorAll("#affichage_exercices label") // Pour les propositions des QCM
      for (const table of tables) {
        ;(table as HTMLDivElement).style.fontSize = `${size}px`
      }
      const figures = document.querySelectorAll(".mathalea2d")
      for (const figureElement of figures) {
        const figure = figureElement as SVGElement
        if (!figure.dataset.widthInitiale) figure.dataset.widthInitiale = figure.getAttribute("width")
        if (!figure.dataset.heightInitiale) figure.dataset.heightInitiale = figure.getAttribute("height")
        figure.setAttribute("height", (Number(figure.dataset.heightInitiale) * currentZoom).toString())
        figure.setAttribute("width", (Number(figure.dataset.widthInitiale) * currentZoom).toString())
      }
      Mathalea.renderDiv(divQuestion)
      if (divQuestion.offsetHeight + 180 > window.innerHeight && currentZoom > 0) {
        currentZoom -= 0.25
        setSize()
      }
    }
  }

  function zoomPlus() {
    userZoom += 0.25
    currentZoom = userZoom
    setSize()
  }

  function zoomMoins() {
    if (userZoom > 1) userZoom -= 0.25
    else if (userZoom > 0.2) userZoom -= 0.1
    currentZoom = userZoom
    setSize()
  }

  function switchFullScreen() {
    isFullScreen = !isFullScreen
    if (isFullScreen) {
      const app = document.querySelector("#diap")
      app.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  async function switchCorrectionVisible() {
    isCorrectionVisible = !isCorrectionVisible
    await tick()
    Mathalea.renderDiv(divQuestion)
  }

  function switchPause() {
    if (!isPause) {
      pause()
    } else timer(durationGlobal ?? durations[currentQuestion] ?? 10, false)
  }

  function pause() {
    clearInterval(myInterval)
    isPause = true
  }

  function timer(timeQuestion = 5, reset = true) {
    // timeQuestion est le temps de la question exprimé en secondes
    if (timeQuestion === 0) {
      pause()
      ratioTime = 0
    } else {
      if (reset) ratioTime = 0
      isPause = false
      clearInterval(myInterval)
      myInterval = window.setInterval(() => {
        ratioTime = ratioTime + 1 // ratioTime est le pourcentage du temps écoulé
        if (ratioTime >= 100) {
          clearInterval(myInterval)
          nextQuestion()
        }
      }, timeQuestion * 10)
    }
  }

  function handleShortcut(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      prevQuestion()
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      nextQuestion()
    }
    if (e.key === " ") {
      e.preventDefault()
      if (durationGlobal !== 0) switchPause()
    }
  }

  let valueCursorTime = 10
  /**
   * Gère la récupération de la valeur du curseur de temps
   */
  function handleTimerChange(event) {
    durationGlobal = parseInt(event.target.value)
    isSameDurationForAll = true
    goToQuestion(currentQuestion)
  }
  /**
   * Gestion du message dans le modal de réglage de la durée de projection
   * @param duree valeur de la durée en secondes retournée par le curseur
   */
  function setPhraseDuree(duree) {
    if (duree >= 2) return duree + " secondes"
    else if (duree === 0) return "Défilement manuel"
    else return duree + " seconde"
  }
  $: messageDuree = setPhraseDuree(valueCursorTime)

  $: displayCurrentDuration = () => {
    return currentDuration === 0 ? "Manuel" : currentDuration + "s"
  }

  /**
   * Pour le bouton de retour de la page de fin
   */
  function returnToStart() {
    durationGlobal = 0
    pause()
    goToQuestion(0)
  }

  /**
   * Gestion du clic sur l'étape dans la progression
   * @param {number} index index de l'étape
   */
  function clickOnStep(index) {
    goToQuestion(index)
  }

  /**
   * Calcule la durée totale du diaporama
   * (durée par question x nombre de questions)
   */
  $: getTotalDuration = () => {
    let sum = 0
    for (let exercice of exercices) {
      sum += (isSameDurationForAll ? durationGlobal : exercice.duration) * exercice.nbQuestions
    }
    return sum
  }

  /**
   * Calcule le nombre total de questions
   */
  $: getTotalNbOfQuestions = () => {
    let sum = 0
    for (let exercice of exercices) {
      sum += exercice.nbQuestions
    }
    return sum
  }

  $: {
    if (divTableDurationsQuestions) Mathalea.renderDiv(divTableDurationsQuestions)
  }

  /**
   * Retourne une chaîne formattée pour afficher une durée en (XXh XXmin XXs)
   * @param {number} nbOfSeconds durée en secondes
   * @return {string} durée en h min s
   */
  function formattedTimeStamp(nbOfSeconds) {
    const nbOfHours = Math.floor(nbOfSeconds / 3600)
    const nbOfMinutes = Math.floor((nbOfSeconds - nbOfHours * 3600) / 60)
    const nbOfSecondsLeft = nbOfSeconds - nbOfHours * 3600 - nbOfMinutes * 60
    if (nbOfHours > 0) {
      return `${nbOfHours}h ${nbOfMinutes}min ${nbOfSecondsLeft}s`
    } else {
      if (nbOfMinutes > 0) {
        if (nbOfSecondsLeft === 0) {
          return `${nbOfMinutes}min`
        } else {
          return `${nbOfMinutes}min ${nbOfSecondsLeft}s`
        }
      } else {
        return `${nbOfSecondsLeft}s`
      }
    }
  }

  $: {
    if (isSameDurationForAll && durationGlobal === null) {
      durationGlobal = 10
    } else if (!isSameDurationForAll) {
      durationGlobal = null
    }
    let steps: NodeListOf<HTMLLIElement>
    if (stepsUl) steps = stepsUl.querySelectorAll("li")
    if (steps && steps[currentQuestion + 5]) steps[currentQuestion + 5].scrollIntoView()
  }

  /**
   * Copy text pass as parameter to clipboard
   * @param text text to be copied
   * @author sylvain
   */
  function copyLinkToClipboard() {
    const url = document.URL
    navigator.clipboard.writeText(url).then(
      () => {
        const dialog = document.getElementById("linkCopiedDialog-1") ?? document.getElementById("linkCopiedDialog-2")
        dialog.showModal()
        setTimeout(() => {
          dialog.close()
        }, 1000)
      },
      (err) => {
        console.error("Async: Could not copy text: ", err)
      }
    )
  }

  /**
   * Generate QR-Code from current URL and display it in canvas as png image
   * @author sylvain
   */
  function urlToQRCodeDisplay() {
    const diapoURL = document.URL
    const canvas = document.getElementById("QRCodeCanvas-1") ?? document.getElementById("QRCodeCanvas-2")
    const options = {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#000",
        light: "#fff",
      },
    }
    QRCode.toDataURL(canvas, diapoURL, options)
  }

  /**
   * Copy image of QR-Code contained in approriate canvas to clipboard as png image
   * and displayed that the image has been copied
   * @author sylvain
   */
  function copyCanvasImageToClipboard() {
    const canvas = document.getElementById("QRCodeCanvas-1") ?? document.getElementById("QRCodeCanvas-2")
    canvas.toBlob(function (blob) {
      const item = new ClipboardItem({ "image/png": blob })
      navigator.clipboard.write([item]).then(
        () => {
          const dialog = document.getElementById("QRCodeDialog-1") ?? document.getElementById("QRCodeDialog-2")
          dialog.showModal()
          setTimeout(() => {
            dialog.close()
          }, 1500)
        },
        (err) => {
          console.error("Async: Could not copy image: ", err)
        }
      )
    })
  }

  /**
   * Download image of QR-Code contained in approriate canvas to clipboard as png image
   * (timestamp is added to the file name)
   * @author sylvain
   */
  function downloadCanvasImage() {
    let downloadLink = document.createElement("a")
    let date = new Date()
    const year = date.getFullYear()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    const timestamp = `${year}${month}${day}`
    downloadLink.setAttribute("download", "qrcode_diaporama_" + timestamp + ".png")
    const canvas = document.getElementById("QRCodeCanvas-1") ?? document.getElementById("QRCodeCanvas-2")
    canvas.toBlob(function (blob) {
      let url = URL.createObjectURL(blob)
      downloadLink.setAttribute("href", url)
      downloadLink.click()
    })
  }
</script>

<svelte:window on:keyup={handleShortcut} />
<!-- Page d'accueil du diapo -->
{#if currentQuestion === -1}
  <div id="start" class="flex flex-col h-screen scrollbar-hide" data-theme="daisytheme">
    <div class="flex flex-row justify-end p-6">
      <button type="button"
        ><i
          class="relative bx ml-2 bx-lg bx-x hover:text-coopmaths"
          on:click={() => {
            document.location.href = document.location.href.replace("&v=diaporama", "")
          }}
          on:keydown={() => {
            document.location.href = document.location.href.replace("&v=diaporama", "")
          }}
        /></button
      >
    </div>
    <div class="flex flex-row items-center justify-center w-full mb-24 mt-12">
      <button
        type="button"
        class="inline-flex items-center justify-center shadow-2xl w-1/3 bg-coopmaths hover:bg-coopmaths-dark text-[100px] font-extrabold text-white py-6 px-12 rounded-lg"
        on:click={() => {
          goToQuestion(0)
          timer(durationGlobal ?? durations[currentQuestion] ?? 10)
        }}
        on:keydown={() => {
          goToQuestion(0)
          timer(durationGlobal ?? durations[currentQuestion] ?? 10)
        }}
      >
        Play <i class="bx text-[100px] text-white bx-play" />
      </button>
    </div>
    <div class="flex flex-row w-full justify-center items-start mx-20">
      <!-- Multivue + Liens -->
      <div class="flex flex-col w-1/6 justify-start">
        <div class="flex text-lg font-bold mb-6">Multivue</div>
        <div class="flex px-4 pb-8">
          <div>
            <div class="form-check">
              <input
                class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                type="radio"
                name="multivue"
                id="multivueRadio1"
                bind:group={nbOfVues}
                on:change={updateExercices}
                value={1}
              />
              <label class="form-check-label inline-block text-gray-800" for="multivueRadio1"> Pas de multivue </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                type="radio"
                name="multivue"
                id="multivueRadio2"
                bind:group={nbOfVues}
                on:change={updateExercices}
                value={2}
              />
              <label class=" form-check-label inline-block text-gray-800" for="multivueRadio2"> Deux vues </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                type="radio"
                name="multivue"
                id="multivueRadio3"
                bind:group={nbOfVues}
                on:change={updateExercices}
                value={3}
              />
              <label class="form-check-label inline-block text-gray-800" for="multivueRadio3"> Trois vues </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                type="radio"
                name="multivue"
                id="multivueRadio4"
                bind:group={nbOfVues}
                on:change={updateExercices}
                value={4}
              />
              <label class="form-check-label inline-block text-gray-800" for="multivueRadio4"> Quatre vues </label>
            </div>
          </div>
        </div>
        <div class="flex text-lg font-bold mb-2">Liens</div>
        <div class="flex flex-row px-4 justify-start">
          <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Lien du diaporama">
            <button type="button" class="mr-4 my-2 text-coopmaths" on:click={copyLinkToClipboard}>
              <i class="bx text-2xl bx-link" />
            </button>
            <dialog class="rounded-xl" id="linkCopiedDialog-1">Le lien est copié dans le presse-papier !</dialog>
          </div>
          <label for="QRCodeModal-1" class="btn bg-transparent border-0 active:bg-transparent focus:bg-transparent hover:bg-transparent">
            <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="QR-code du diaporama">
              <i class="bx text-2xl text-coopmaths bx-qr" on:click={urlToQRCodeDisplay} />
            </div>
          </label>
          <input type="checkbox" id="QRCodeModal-1" class="modal-toggle" />
          <div class="modal">
            <div class="modal-box relative">
              <dialog class="rounded-xl" id="QRCodeDialog-1">Le QR-Code est copié dans le presse-papier !</dialog>
              <label for="QRCodeModal-1" class="btn absolute right-2 top-2 bg-transparent border-0 active:bg-transparent focus:bg-transparent hover:bg-transparent">
                <i class="bx text-3xl bx-x text-gray-800" />
              </label>
              <h3 class="text-lg font-bold">QR-Code du Diaporama</h3>
              <p class="py-4">Choisissez de copier l'image ou de la télécharger.</p>
              <div class="flex flex-col justify-center">
                <div class="flex flex-row justify-center p-4">
                  <canvas id="QRCodeCanvas-1" />
                </div>
                <div class="flex flex-row justify-center pb-6">
                  <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Copier le QR-Code">
                    <button type="button" class="mx-6 my-2 text-coopmaths" on:click={copyCanvasImageToClipboard}>
                      <i class="bx text-[30px] bx-copy-alt" />
                    </button>
                  </div>
                  <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Télécharger le QR-Code">
                    <button type="button" class="mx-6 my-2 text-coopmaths" on:click={downloadCanvasImage}>
                      <i class="bx text-[30px] bx-download" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Tableau réglages -->
      <div class="flex flex-col w-4/6 justify-start">
        <div class="flex flex-col lg:flex-row px-4 pb-4 w-full justify-start lg:justify-between lg:items-center">
          <div class="flex text-lg font-bold">Durées et nombres de questions</div>
          <div class="flex items-center">
            <input
              id="checkbox-1"
              aria-describedby="checkbox-1"
              type="checkbox"
              class="bg-gray-50 border-gray-300 text-coopmaths focus:ring-3 focus:ring-coopmaths h-4 w-4 rounded"
              bind:checked={isSameDurationForAll}
              disabled={exercices.length == 1}
            />
            <label for="checkbox-1" class="ml-3 font-medium {exercices.length == 1 ? 'text-gray-300' : 'text-gray-900'} "
              >Même durée pour toutes les questions <input
                type="number"
                min="1"
                bind:value={durationGlobal}
                class="ml-3 w-20 h-8 bg-gray-100 border-2 border-transparent focus:border-2 focus:border-coopmaths focus:outline-0 focus:ring-0 disabled:opacity-30"
                disabled={!isSameDurationForAll}
              /></label
            >
          </div>
        </div>

        <div class="flex flex-col min-w-full px-4 align-middle" bind:this={divTableDurationsQuestions}>
          <div class="table-wrp block max-h-[300px] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="table-fixed min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-100 sticky top-0">
                <th scope="col" class="py-3.5 pl-4 pr-3 w-4/6 text-left text-sm font-semibold text-gray-900 sm:pl">Exercices</th>
                <th scope="col" class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-gray-900">
                  <div>Durées par question (s)</div>
                  <div class="text-coopmaths text-xs">Durée diapo :<span class="font-bold ml-1">{formattedTimeStamp(getTotalDuration())}</span></div>
                </th>
                <th scope="col" class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-gray-900">
                  <div>Nombres de questions</div>
                  <div class="text-coopmaths text-xs">Total :<span class="font-bold ml-1">{getTotalNbOfQuestions()}</span></div>
                </th>
              </thead>
              <tbody class="max-h-[300px] overflow-y-auto">
                {#each exercices as exercice}
                  <tr>
                    <td class="whitespace-normal px-3 py-4 text-sm">{exercice.id} - {exercice.titre}</td>
                    <td class="whitespace-normal px-3 py-4 text-sm"
                      ><span class="flex justify-center"
                        ><input
                          type="number"
                          min="1"
                          on:change={updateExercices}
                          bind:value={exercice.duration}
                          class="ml-3 w-16 h-8 bg-gray-100 border-2 border-transparent focus:border-2 focus:border-coopmaths focus:outline-0 focus:ring-0 disabled:opacity-30"
                          disabled={isSameDurationForAll}
                        /></span
                      ></td
                    >
                    <td class="whitespace-normal px-3 py-4 text-sm"
                      ><span class="flex justify-center"
                        ><input
                          type="number"
                          min="1"
                          bind:value={exercice.nbQuestions}
                          on:change={updateExercices}
                          class="ml-3 w-16 h-8 bg-gray-100 border-2 border-transparent focus:border-2 focus:border-coopmaths focus:outline-0 focus:ring-0"
                        /></span
                      ></td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
<!-- Diaporama lui-même -->
{#if currentQuestion > -1 && currentQuestion < questions[0].length}
  <div id="diap" class="flex flex-col h-screen scrollbar-hide" data-theme="daisytheme">
    <!-- Steps -->
    <header class="flex flex-col h-20 dark:bg-white pb-1">
      <div class:invisible={durationGlobal === 0} class="flex flex-row h-6 border border-coopmaths">
        <div class="bg-coopmaths" style="width: {ratioTime}%;" />
      </div>
      <div class="flex flex-row h-full mt-6 w-full justify-center">
        <ul class="steps w-11/12" bind:this={stepsUl}>
          {#each questions[0] as question, i}
            <li class="step {currentQuestion >= i ? 'step-primary' : ''} cursor-pointer" on:click={() => clickOnStep(i)} on:keydown={() => clickOnStep(i)} />
          {/each}
        </ul>
      </div>
    </header>
    <!-- Question -->
    <main class="flex grow max-h-full dark:bg-white dark:text-slate-800 p-10">
      <div bind:this={divQuestion} class="{nbOfVues > 1 ? 'grid grid-cols-2 gap-4' : ''} place-content-stretch justify-items-center w-full">
        {#each Array(nbOfVues) as _, i}
          <div class="relative flex flex-col justify-center justify-self-stretch p-8 {nbOfVues > 1 ? 'bg-gray-300' : ''} text-center">
            <div class="font-light mb-8">{consignes[currentQuestion]}</div>
            {#if nbOfVues > 1}
              <div class="absolute bg-coopmaths text-white font-black -top-1 -left-1 rounded-tl-2xl w-1/12 h-1/12">{i + 1}</div>
            {/if}
            <div>{@html isCorrectionVisible ? corrections[i][currentQuestion] : questions[i][currentQuestion]}</div>
          </div>
        {/each}
      </div>
    </main>
    <!-- Boutons de réglages -->
    <footer class="w-full h-20 py-1 sticky bottom-0 opacity-100 dark:bg-white">
      <div class="flex flex-row justify-between w-full text-coopmaths">
        <!-- boutons réglagles zoom -->
        <div class="flex flex-row justify-start ml-10 w-[33%] items-center">
          <button type="button" on:click={switchFullScreen}><i class="bx ml-2 bx-lg {isFullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}" /></button>
          <button type="button" on:click={zoomPlus}><i class="bx ml-2 bx-lg bx-plus" /></button>
          <button type="button" on:click={zoomMoins}><i class="bx ml-2 bx-lg bx-minus" /></button>
        </div>
        <!-- boutons contrôle défilement -->
        <div class="flex flex-row justify-center w-[33%] items-center">
          <button type="button" on:click={prevQuestion}><i class="bx ml-2 bx-lg bx-skip-previous" /></button>
          <button type="button" on:click={switchPause} class:invisible={durationGlobal === 0}><i class="bx ml-2 bx-lg {isPause ? 'bx-play' : 'bx-pause'}" /></button>
          <button type="button" on:click={nextQuestion}><i class="bx ml-2 bx-lg bx-skip-next" /></button>
        </div>
        <!-- boutons timers correction quitter -->
        <div class="flex flex-row justify-end mr-10 w-[33%] items-center">
          <label for="timerSettings" class="modal-button"
            ><i class="relative bx ml-2 bx-lg bx-stopwatch" on:click={pause} on:keydown={pause}>
              <div class="absolute -bottom-[12px] left-1/2 -translate-x-1/2 text-sm font-sans text-coopmaths">{displayCurrentDuration()}</div></i
            ></label
          >
          <input type="checkbox" id="timerSettings" class="modal-toggle" />
          <div class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
              <h3 class="font-bold text-lg">Temps par question</h3>
              <p class="py-4 text-black">Régler la durée de projection en secondes</p>
              <div class="flew-row space-x-2">
                <div class="flex flex-row justify-start items-center space-x-2">
                  <input
                    class="w-1/4 h-2 bg-transparent text-coopmaths cursor-pointer"
                    type="range"
                    max="30"
                    min="0"
                    name="duration"
                    id="duration"
                    bind:value={valueCursorTime}
                    on:change={handleTimerChange}
                  />
                  <label class="w-3/4 text-sm text-black" for="duration">{messageDuree}</label>
                </div>
              </div>
              <div class="modal-action">
                <label for="timerSettings" class="btn btn-coopmaths" on:click={switchPause} on:keydown={switchPause}>Fermer</label>
              </div>
            </div>
          </div>
          <button type="button" on:click={switchCorrectionVisible}><i class="bx ml-2 bx-lg {isCorrectionVisible ? 'bx-hide' : 'bx-show'}" /></button>
          <button
            type="button"
            on:click={() => {
              document.location.href = document.location.href.replace("&v=diaporama", "")
            }}
            on:keydown={() => {
              document.location.href = document.location.href.replace("&v=diaporama", "")
            }}><i class="bx ml-2 bx-lg bx-power-off" /></button
          >
        </div>
      </div>
    </footer>
  </div>
{/if}
<!-- Fin du diaporama -->
{#if currentQuestion === questions[0].length}
  <div id="end" class="flex flex-col h-screen scrollbar-hide justify-center text-coopmaths" data-theme="daisytheme">
    <div class="flex flex-row items-center justify-center w-full text-[300px] font-extrabold m-10">Fin !</div>
    <div class="flex flex-row items-center justify-center w-full mx-10 my-4">
      <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Début du diaporama">
        <button type="button" class="mx-12 my-2 text-coopmaths" on:click={returnToStart} on:keydown={returnToStart}><i class="bx text-[100px] bx-arrow-back" /></button>
      </div>
      <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Questions + Réponses">
        <button
          type="button"
          class="mx-12 my-2 text-coopmaths"
          on:click={() => {
            document.location.href = document.location.href.replace("&v=diaporama", "&v=can")
          }}><i class="bx text-[100px] bx-detail" /></button
        >
      </div>
      <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Lien du diaporama">
        <button type="button" class="mx-12 my-2 text-coopmaths" on:click={copyLinkToClipboard}>
          <i class="bx text-[100px] bx-link" />
        </button>
        <dialog class="rounded-xl" id="linkCopiedDialog-2">Le lien est copié dans le presse-papier !</dialog>
      </div>
      <label for="QRCodeModal-2" class="mx-12 my-2 hover:cursor-pointer">
        <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="QR-code du diaporama">
          <i class="bx text-[100px] text-coopmaths bx-qr self-center" on:click={urlToQRCodeDisplay} />
        </div>
      </label>
      <input type="checkbox" id="QRCodeModal-2" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative text-gray-900">
          <dialog class="rounded-xl" id="QRCodeDialog-2">Le QR-Code est copié dans le presse-papier !</dialog>
          <label for="QRCodeModal-2" class="btn absolute right-2 top-2 bg-transparent border-0 active:bg-transparent focus:bg-transparent hover:bg-transparent">
            <i class="bx text-3xl bx-x text-gray-800" />
          </label>
          <h3 class="text-lg font-bold">QR-Code du Diaporama</h3>
          <p class="py-4">Choisissez de copier l'image ou de la télécharger.</p>
          <div class="flex flex-col justify-center">
            <div class="flex flex-row justify-center p-4">
              <canvas id="QRCodeCanvas-2" />
            </div>
            <div class="flex flex-row justify-center pb-6">
              <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Copier le QR-Code">
                <button type="button" class="mx-6 my-2 text-coopmaths" on:click={copyCanvasImageToClipboard}>
                  <i class="bx text-[30px] bx-copy-alt" />
                </button>
              </div>
              <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Télécharger le QR-Code">
                <button type="button" class="mx-6 my-2 text-coopmaths" on:click={downloadCanvasImage}>
                  <i class="bx text-[30px] bx-download" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Sortir du diaporama">
        <button
          type="button"
          class="mx-12 my-2 text-coopmaths"
          on:click={() => {
            document.location.href = document.location.href.replace("&v=diaporama", "")
          }}
        >
          <i class="bx text-[100px] bx-home-alt-2" />
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .table-wrp {
    max-height: 300px;
    overflow-y: auto;
    display: block;
  }
  thead {
    position: sticky;
    top: 0;
  }
  dialog::backdrop {
    backdrop-filter: blur(4px);
  }
</style>
