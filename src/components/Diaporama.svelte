<script lang="ts">
  import { onMount, tick } from "svelte"
  import { Mathalea } from "../Mathalea"
  import { exercicesParams, globalOptions } from "./store"
  import type { Exercice } from "./utils/typeExercice"
  import seedrandom from "seedrandom"
  import { tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"
  import QRCode from "qrcode"
  import { getBlobFromImageElement, copyBlobToClipboard, canCopyImagesToClipboard } from "copy-image-clipboard"
  import { context } from "../modules/context.js"

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
  let durationGlobal: number = $globalOptions.durationGlobal
  let previousDurationGlobal = 10 // Utile si on décoche puis recoche "Même durée pour toutes les questions"
  let ratioTime = 0 // Pourcentage du temps écoulé (entre 1 et 100)
  let progress = tweened(0, {
    duration: durationGlobal ?? durations[currentQuestion] ?? 10,
    easing: cubicOut,
  })
  let myInterval: number
  let currentDuration: number
  let totalDuration: number = null
  let nbOfVues = $globalOptions.nbVues || 1
  let formatQRCodeIndex: number = 0
  const allowedImageFormats: string[] = ["image/jpeg", "image/png", "image/webp"]
  let QRCodeWidth = 100
  let stringDureeTotale = "0"
  let isTransitionActive: boolean = true

  if ($globalOptions && $globalOptions.durationGlobal) {
    isSameDurationForAll = true
  }

  onMount(async () => {
    context.vue = "diap"
    Mathalea.updateUrl($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
      const exercice: Exercice = await Mathalea.load(paramsExercice.uuid)
      if (exercice === undefined) return
      exercice.uuid = paramsExercice.uuid
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
      if (exercice.seed === undefined)
        exercice.seed = Mathalea.generateSeed({
          includeUpperCase: true,
          includeNumbers: true,
          length: 4,
          startsWithLowerCase: false,
        })
      exercices.push(exercice)
    }
    exercices = exercices
    updateExercices()
    await tick()
    if (divTableDurationsQuestions) Mathalea.renderDiv(divTableDurationsQuestions)
  })

  function updateExercices() {
    Mathalea.updateUrl($exercicesParams)
    questions = [[], [], [], []]
    corrections = [[], [], [], []]
    consignes = []
    sizes = []
    durations = []
    for (let idVue = 0; idVue < nbOfVues; idVue++) {
      questions[idVue] = []
      corrections[idVue] = []
      for (const exercice of exercices) {
        if (idVue > 0) {
          exercice.seed = exercice.seed.substring(0, 4) + idVue
        } else {
          exercice.seed = exercice.seed.substring(0, 4)
        }
        if (exercice.typeExercice === "simple") Mathalea.handleExerciceSimple(exercice, false)
        seedrandom(exercice.seed, { global: true })
        exercice.nouvelleVersion()
        questions[idVue] = [...questions[idVue], ...exercice.listeQuestions]
        corrections[idVue] = [...corrections[idVue], ...exercice.listeCorrections]
        questions[idVue] = questions[idVue].map(Mathalea.formatExercice)
        corrections[idVue] = corrections[idVue].map(Mathalea.formatExercice)
      }
    }
    let newParams = []
    for (const exercice of exercices) {
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        sizes.push(exercice.tailleDiaporama)
        if (exercice.introduction) {
          consignes.push(exercice.consigne + "\n" + exercice.introduction)
        } else {
          consignes.push(exercice.consigne)
        }
        durations.push(exercice.duration)
      }
      newParams.push({
        uuid: exercice.uuid,
        id: exercice.id,
        alea: exercice.seed.substring(0, 4),
        nbQuestions: exercice.nbQuestions,
        duration: exercice.duration,
      })
    }
    globalOptions.update((l) => {
      l.nbVues = nbOfVues
      return l
    })
    exercicesParams.update((l) => newParams)
    Mathalea.updateUrl(newParams)
    totalDuration = getTotalDuration()
    stringDureeTotale = formattedTimeStamp(getTotalDuration())
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

    if (!isPause) {
      if (isTransitionActive) {
        showDialogForLimitedTime("transition", 1000).then(() => {
          timer(durationGlobal ?? durations[currentQuestion] ?? 10)
        })
      } else {
        timer(durationGlobal ?? durations[currentQuestion] ?? 10)
      }
    }
    currentDuration = durationGlobal ?? durations[currentQuestion] ?? 10
  }

  /**
   * Afficher un écran (élément <dialog>) pendant un nombre de millisecondes
   * @param {string} dialogId id de l'élément <dialog> à activer
   * @param {number} nbOfMilliseconds durée de l'affichage en ms
   */
  async function showDialogForLimitedTime(dialogId: string, nbOfMilliseconds: number) {
    console.log("Entering showDialogForLImitedTime")
    const dialog = document.getElementById(dialogId)
    if (dialog) {
      dialog.showModal()
      await sleep(nbOfMilliseconds)
      dialog.close()
    }
    console.log("Exiting showDialogForLImitedTime")
  }

  /**
   * Faire une pause pendant l'exécution d'un programme
   * {@link https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep?page=1&tab=scoredesc#tab-top | Source}
   * @param ms nb de millisecondes de la pause
   */
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  async function setSize() {
    const size = currentZoom * sizes[currentQuestion]
    divQuestion.style.lineHeight = `1.2`
    divQuestion.style.fontSize = `${size}rem`
    Mathalea.renderDiv(divQuestion, size)
    if (divQuestion.offsetHeight + 180 > window.innerHeight && currentZoom > 0) {
      currentZoom -= 0.25
      setSize()
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

  function handleChangeDurationGlobal() {
    globalOptions.update((l) => {
      l.durationGlobal = durationGlobal
      return l
    })
    updateExercices()
  }

  function handleCheckSameDurationForAll() {
    globalOptions.update((l) => {
      l.durationGlobal = null
      return l
    })
    handleChangeDurationGlobal()
    updateExercices()
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

  $: {
    if (divTableDurationsQuestions) Mathalea.renderDiv(divTableDurationsQuestions)
    if (durationGlobal) previousDurationGlobal = durationGlobal
    if (isSameDurationForAll && previousDurationGlobal) durationGlobal = previousDurationGlobal

    if (isSameDurationForAll && durationGlobal === null) {
      durationGlobal = 10
    } else if (!isSameDurationForAll) {
      durationGlobal = null
    }
    let steps: NodeListOf<HTMLLIElement>
    if (stepsUl) steps = stepsUl.querySelectorAll("li")
    if (steps) {
      if (steps[currentQuestion]) steps[currentQuestion].scrollIntoView()
      if (steps[currentQuestion + 5]) steps[currentQuestion + 5].scrollIntoView()
      if (steps[currentQuestion - 5] && !isInViewport(steps[currentQuestion - 5])) steps[currentQuestion - 5].scrollIntoView()
    }
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
  function getTotalDuration() {
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

  /**
   * Copy current URL to clipboard
   * @param dialogId id of dialog widget where the info is displayed
   * @author sylvain
   */
  function copyLinkToClipboard(dialogId) {
    const url = document.URL
    navigator.clipboard.writeText(url).then(
      () => {
        showDialogForLimitedTime(dialogId, 1000)
      },
      (err) => {
        console.error("Async: Could not copy text: ", err)
      }
    )
  }

  /**
   * Generate QR-Code from current URL and display it in designated image
   * (format is decided by global variable <i>formatQRCodeIndex</i>)
   * @param imageId id of the image
   * @author sylvain
   */
  function urlToQRCodeOnWithinImgTag(imageId) {
    const diapoURL = document.URL
    const options = {
      errorCorrectionLevel: "H",
      type: allowedImageFormats[formatQRCodeIndex],
      quality: 0.9,
      margin: 1,
      scale: 2,
      width: QRCodeWidth,
      color: {
        dark: "#000",
        light: "#fff",
      },
    }
    QRCode.toDataURL(diapoURL, options, (err, url) => {
      if (err) throw err
      let img = document.getElementById(imageId)
      img.src = url
    })
  }

  /**
   * Copy image of QR-Code contained in designated img tag
   * and displayed that the image has been copied in designated dialog widget
   * @param imageId id of the canvas
   * @param dialogId id of dialog widget where the info is displayed
   * @author sylvain
   */
  function copyQRCodeImageToClipboard(imageId, dialogId) {
    if (canCopyImagesToClipboard()) {
      const imageElement = document.getElementById(imageId)
      getBlobFromImageElement(imageElement)
        .then((blob) => {
          return copyBlobToClipboard(blob)
        })
        .then(() => {
          showDialogForLimitedTime(dialogId + "-1", 1000)
        })
        .catch((e) => {
          console.log("Error: ", e.message)
        })
    } else {
      showDialogForLimitedTime(dialogId + "-2", 2000)
    }
  }

  /**
   * Download image of QR-Code contained within designated img tag
   * (timestamp is added to the file name)
   * @param imageId ID of the image to download
   * @author sylvain
   */
  function downloadQRCodeImage(imageId) {
    // creating a timestamp for file name
    let date = new Date()
    const year = date.getFullYear()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    const timestamp = `${year}${month}${day}`

    const imageSrc = document.getElementById(imageId).getAttribute("src")
    fetch(imageSrc)
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        // creating virtual link for download
        const downloadLink = document.createElement("a")
        downloadLink.style.display = "none"
        downloadLink.href = url
        downloadLink.download = "qrcode_diapo_coopmaths" + timestamp + "." + allowedImageFormats[formatQRCodeIndex].slice(6)
        document.body.appendChild(downloadLink)
        downloadLink.click()
        window.URL.revokeObjectURL(url)
      })
      .catch(() => "Erreur avec le téléchargement de l'image du QR-Code")
  }

  function isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect()
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
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
        <div class="flex text-lg font-bold mb-2">Transitions</div>
        <div class="flex flex-row justify-start items-center px-4 pb-8">
          <button type="button" on:click={() => (isTransitionActive = !isTransitionActive)}><i class="text-coopmaths bx bx-sm {isTransitionActive ? 'bx-toggle-right' : 'bx-toggle-left'}" /></button>
          <div class="inline-flex pl-2">{isTransitionActive ? "Carton entre questions" : "Pas de carton entre questions"}</div>
        </div>
        <div class="flex text-lg font-bold mb-2">Multivue</div>
        <div class="flex px-4 pb-8">
          <div>
            <div class="form-check flex flex-row justify-start items-center">
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
            <div class="form-check flex flex-row justify-start items-center">
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
            <div class="form-check flex flex-row justify-start items-center">
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
            <div class="form-check flex flex-row justify-start items-center">
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
        <div class="flex flex-row px-4 -mt-2 justify-start">
          <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Lien du diaporama">
            <button type="button" class="mr-4 my-2 text-coopmaths" on:click={() => copyLinkToClipboard("linkCopiedDialog-1")}>
              <i class="bx text-2xl bx-link" />
            </button>
            <dialog class="rounded-xl" id="linkCopiedDialog-1">Le lien est copié dans le presse-papier !</dialog>
          </div>
          <label for="QRCodeModal-1" class="btn bg-transparent border-0 active:bg-transparent focus:bg-transparent hover:bg-transparent">
            <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="QR-code du diaporama">
              <i class="bx text-2xl text-coopmaths bx-qr" on:click={() => urlToQRCodeOnWithinImgTag("QRCodeCanvas-1")} />
            </div>
          </label>
          <input type="checkbox" id="QRCodeModal-1" class="modal-toggle" />
          <div class="modal">
            <div class="modal-box relative z-0">
              <dialog class="rounded-xl z-10 bg-coopmaths text-white" id="QRCodeDialog-1-1">Le QR-Code est copié dans le presse-papier !</dialog>
              <dialog class="rounded-xl z-10 bg-coopmaths text-white" id="QRCodeDialog-1-2">
                Impossible de copier le QR-Code dans ce navigateur !<br /> Vérifier les permissions.
              </dialog>
              <label for="QRCodeModal-1" class="btn absolute right-2 top-2 bg-transparent border-0 active:bg-transparent focus:bg-transparent hover:bg-transparent">
                <i class="bx text-3xl bx-x text-gray-800" />
              </label>
              <h3 class="text-lg font-bold">QR-Code du Diaporama</h3>
              <p class="py-4">Choisissez de copier l'image ou de la télécharger.</p>
              <!-- format QRCode -->
              <div class="flex flex-row items-center justify-start">
                <div class="font-bold text-coopmaths">Formats de l'image :</div>
                <div class="flex flex-row justify-start items-center">
                  <div class="form-check flex flex-row ml-4 items-center">
                    <input
                      class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                      type="radio"
                      name="formatQRCode"
                      id="formatQRCodeRadio1"
                      bind:group={formatQRCodeIndex}
                      on:change={() => {
                        urlToQRCodeOnWithinImgTag("QRCodeCanvas-1")
                      }}
                      value={0}
                    />
                    <label class="form-check-label inline-block text-gray-800" for="formatQRCodeRadio1"> jpeg </label>
                  </div>
                  <div class="form-check flex flex-row ml-4 items-center">
                    <input
                      class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                      type="radio"
                      name="formatQRCode"
                      id="formatQRCodeRadio2"
                      bind:group={formatQRCodeIndex}
                      on:change={() => {
                        urlToQRCodeOnWithinImgTag("QRCodeCanvas-1")
                      }}
                      value={1}
                    />
                    <label class=" form-check-label inline-block text-gray-800" for="formatQRCodeRadio2"> png </label>
                  </div>
                  <div class="form-check flex flex-row ml-4 items-center">
                    <input
                      class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                      type="radio"
                      name="formatQRCode"
                      id="formatQRCodeRadio3"
                      bind:group={formatQRCodeIndex}
                      on:change={() => {
                        urlToQRCodeOnWithinImgTag("QRCodeCanvas-1")
                      }}
                      value={2}
                    />
                    <label class="form-check-label inline-block text-gray-800" for="formatQRCodeRadio3"> webp </label>
                  </div>
                </div>
              </div>
              <!-- taille QR-Code -->
              <div class="flex flex-row items-center justify-start my-4">
                <div class="font-bold text-coopmaths">Taille du QR-Code</div>
                <input
                  type="number"
                  min="80"
                  max="300"
                  bind:value={QRCodeWidth}
                  class="ml-3 w-20 h-8 bg-gray-100 border-2 border-transparent focus:border-2 focus:border-coopmaths focus:outline-0 focus:ring-0 disabled:opacity-30"
                  on:change={() => urlToQRCodeOnWithinImgTag("QRCodeCanvas-1")}
                />
              </div>
              <div class="flex flex-col justify-center">
                <div class="flex flex-row justify-center p-4">
                  <!-- <canvas id="QRCodeCanvas-1" /> -->
                  <img id="QRCodeCanvas-1" />
                </div>
                <div class="flex flex-row justify-center pb-6">
                  <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Copier le QR-Code">
                    <button type="button" class="mx-6 my-2 text-coopmaths" on:click={() => copyQRCodeImageToClipboard("QRCodeCanvas-1", "QRCodeDialog-1")}>
                      <i class="bx text-[30px] bx-copy-alt" />
                    </button>
                  </div>
                  <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Télécharger le QR-Code">
                    <button type="button" class="mx-6 my-2 text-coopmaths" on:click={() => downloadQRCodeImage("QRCodeCanvas-1")}>
                      <i class="bx text-[30px] bx-download" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex text-lg font-bold mb-2">Aperçu</div>
        <div class="flex flex-row px-4 justify-start">
          <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Aperçu des questions/réponses">
            <button
              type="button"
              class="mr-4 text-coopmaths"
              on:click={() => {
                document.location.href = document.location.href.replace("&v=diaporama", "&v=can")
              }}
            >
              <i class="bx text-2xl bx-detail" />
            </button>
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
              on:change={handleCheckSameDurationForAll}
              disabled={exercices.length == 1}
            />
            <label for="checkbox-1" class="ml-3 font-medium {exercices.length == 1 ? 'text-gray-300' : 'text-gray-900'} "
              >Même durée pour toutes les questions <input
                type="number"
                min="1"
                on:change={handleChangeDurationGlobal}
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
                  <div class="text-coopmaths text-xs">
                    Durée diapo :<span class="font-bold ml-1">{stringDureeTotale}</span>
                  </div>
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
            <div class="font-light mb-8">{@html consignes[currentQuestion]}</div>
            {#if nbOfVues > 1}
              <div class="absolute bg-coopmaths text-white font-black -top-1 -left-1 rounded-tl-2xl w-1/12 h-1/12">{i + 1}</div>
            {/if}
            <div>{@html isCorrectionVisible ? corrections[i][currentQuestion] : questions[i][currentQuestion]}</div>
          </div>
        {/each}
      </div>
      <dialog class=" bg-coopmaths text-white text-[150px] font-extralight min-w-full min-h-full" id="transition">
        <div class="flex flex-row w-full min-h-full justify-center items-center">
          <div class="radial-progress" style="--value:{((currentQuestion + 1) / questions[0].length) * 100}; --size:500px; --thickness: 20px;">{currentQuestion + 1} / {questions[0].length}</div>
        </div>
      </dialog>
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
              <div class="absolute -bottom-[12px] left-1/2 -translate-x-1/2 text-sm font-sans text-coopmaths">
                {displayCurrentDuration()}
              </div></i
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
        <button type="button" class="mx-12 my-2 text-coopmaths" on:click={() => copyLinkToClipboard("linkCopiedDialog-2")}>
          <i class="bx text-[100px] bx-link" />
        </button>
        <dialog class="rounded-xl" id="linkCopiedDialog-2">Le lien est copié dans le presse-papier !</dialog>
      </div>
      <label for="QRCodeModal-2" class="mx-12 my-2 hover:cursor-pointer">
        <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="QR-code du diaporama">
          <i class="bx text-[100px] text-coopmaths bx-qr self-center" on:click={() => urlToQRCodeOnWithinImgTag("QRCodeCanvas-2")} />
        </div>
      </label>
      <input type="checkbox" id="QRCodeModal-2" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative  text-gray-900">
          <dialog class="rounded-xl" id="QRCodeDialog-2-1">Le QR-Code est copié dans le presse-papier !</dialog>
          <dialog class="rounded-xl" id="QRCodeDialog-2-2">
            Impossible de copier le QR-Code dans ce navigateur !<br /> Vérifier les permissions.
          </dialog>
          <label for="QRCodeModal-2" class="absolute right-2 top-2 bg-transparent border-0 active:bg-transparent focus:bg-transparent hover:bg-transparent">
            <i class="bx text-3xl bx-x text-gray-800" />
          </label>
          <h3 class="text-lg font-bold">QR-Code du Diaporama</h3>
          <p class="py-4">Choisissez de copier l'image ou de la télécharger.</p>
          <!-- format QRCode -->
          <div class="flex flex-row items-center justify-start">
            <div class="font-bold text-coopmaths">Formats de l'image :</div>
            <div class="flex flex-row justify-start items-center">
              <div class="form-check flex flex-row ml-4 items-center">
                <input
                  class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                  type="radio"
                  name="formatQRCode"
                  id="formatQRCodeRadio1"
                  bind:group={formatQRCodeIndex}
                  on:change={() => {
                    urlToQRCodeOnWithinImgTag("QRCodeCanvas-2")
                  }}
                  value={0}
                />
                <label class="form-check-label inline-block text-gray-800" for="formatQRCodeRadio1"> jpeg </label>
              </div>
              <div class="form-check flex flex-row ml-4 items-center">
                <input
                  class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                  type="radio"
                  name="formatQRCode"
                  id="formatQRCodeRadio2"
                  bind:group={formatQRCodeIndex}
                  on:change={() => {
                    urlToQRCodeOnWithinImgTag("QRCodeCanvas-2")
                  }}
                  value={1}
                />
                <label class=" form-check-label inline-block text-gray-800" for="formatQRCodeRadio2"> png </label>
              </div>
              <div class="form-check flex flex-row ml-4 items-center">
                <input
                  class="form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white text-coopmaths checked:bg-coopmaths checked:border-coopmaths active:border-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 transition duration-200 mt-1 mr-2 cursor-pointer"
                  type="radio"
                  name="formatQRCode"
                  id="formatQRCodeRadio3"
                  bind:group={formatQRCodeIndex}
                  on:change={() => {
                    urlToQRCodeOnWithinImgTag("QRCodeCanvas-2")
                  }}
                  value={2}
                />
                <label class="form-check-label inline-block text-gray-800" for="formatQRCodeRadio3"> webp </label>
              </div>
            </div>
          </div>
          <!-- taille du QR-Code -->
          <!-- taille QR-Code -->
          <div class="flex flex-row items-center justify-start my-4">
            <div class="font-bold text-coopmaths">Taille du QR-Code</div>
            <input
              type="number"
              min="80"
              max="300"
              bind:value={QRCodeWidth}
              class="ml-3 w-20 h-8 bg-gray-100 border-2 border-transparent focus:border-2 focus:border-coopmaths focus:outline-0 focus:ring-0 disabled:opacity-30"
              on:change={() => urlToQRCodeOnWithinImgTag("QRCodeCanvas-2")}
            />
          </div>
          <div class="flex flex-col justify-center">
            <div class="flex flex-row justify-center p-4">
              <img id="QRCodeCanvas-2" />
            </div>
            <div class="flex flex-row justify-center pb-6">
              <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Copier le QR-Code">
                <button type="button" class="mx-6 my-2 text-coopmaths" on:click={() => copyQRCodeImageToClipboard("QRCodeCanvas-2", "QRCodeDialog-2")}>
                  <i class="bx text-[30px] bx-copy-alt" />
                </button>
              </div>
              <div class="tooltip tooltip-bottom tooltip-primary text-white" data-tip="Télécharger le QR-Code">
                <button type="button" class="mx-6 my-2 text-coopmaths" on:click={() => downloadQRCodeImage("QRCodeCanvas-2")}>
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
