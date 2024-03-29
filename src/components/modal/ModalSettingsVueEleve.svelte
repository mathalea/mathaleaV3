<script lang="ts">
  import Button from "../forms/Button.svelte"
  import ButtonToggle from "../forms/ButtonToggle.svelte"
  import FormRadio from "../forms/FormRadio.svelte"
  import { globalOptions } from "../store"
  import ModalActionWithDialog from "../modal/ModalActionWithDialog.svelte"
  import ModalForQRCode from "../modal/ModalForQRCode.svelte"
  import { copyLinkToClipboard, copyEmbeddedCodeToClipboard } from "../utils/clipboard"
  import { buildUrlAddendumForEsParam, getShortenedCurrentUrl } from "../utils/urls"

  let formatQRCodeIndex: number = 0
  let QRCodeWidth = 100

  const availableLinkFormats = {
    clear: {
      toolTipsMessage: "En clair",
      icon: "bx-glasses-alt",
      isShort: false,
      isEncrypted: false,
    },
    short: {
      toolTipsMessage: "Raccourci",
      icon: "bx-move-horizontal",
      isShort: true,
      isEncrypted: false,
    },
    crypt: {
      toolTipsMessage: "Crypté",
      icon: "bx-lock",
      isShort: false,
      isEncrypted: true,
    },
  }

  type LinkFormat = "clear" | "short" | "crypt"
  let currentLinkFormat: LinkFormat = "clear"

  function handleEleveVueSetUp() {
    let url = document.URL + "&v=eleve"
    url += "&title=" + $globalOptions.title
    url += "&es=" + buildUrlAddendumForEsParam()
    window.open(url, "_blank").focus()
  }

  $: {
    if ($globalOptions.setInteractive !== "0") {
      globalOptions.update((l) => {
        l.isSolutionAccessible = true
        return l
      })
    }
  }
</script>

<input type="checkbox" id="modal-settings-eleve" class="modal-toggle" />
<div class="modal" id="reglages-vue-eleve">
  <div class="modal-box relative bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <label
      for="modal-settings-eleve"
      class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer absolute right-6 top-6"
    >
      <i class="bx bx-sm bx-x" />
    </label>
    <div class="flex flex-row justify-start px-4 py-2">
      <h3 class="font-bold text-lg text-coopmaths-struct dark:text-coopmathsdark-struct">Réglages de la feuille Élève</h3>
    </div>
    <div class="pt-2 pl-2 grid grid-cols-2 gap-4">
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Titre</div>
        <div class="pl-4">
          <input
            type="text"
            class="text-sm bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus border-1 border-coopmaths-action dark:border-coopmathsdark-action font-light focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0"
            bind:value={$globalOptions.title}
          />
        </div>
      </div>
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Présentation</div>
        <FormRadio
          title="présentation"
          bind:valueSelected={$globalOptions.presMode}
          labelsValues={[
            { label: "Une page unique", value: "liste_exos" },
            { label: "Une page par exercice", value: "un_exos_par_page" },
            { label: "Toutes les questions sur une page", value: "liste_questions" },
            { label: "Une page par question", value: "une_question_par_page" },
          ]}
        />
      </div>
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Interactivité</div>
        <FormRadio
          title="Interactif"
          bind:valueSelected={$globalOptions.setInteractive}
          labelsValues={[
            { label: "Laisser tel quel", value: "2" },
            { label: "Tout interactif", value: "1" },
            { label: "Pas d'interactivité", value: "0" },
          ]}
        />

        <div class="pl-2 pt-2">
          <ButtonToggle
            isDisabled={$globalOptions.setInteractive === "0"}
            titles={["Les élèves peuvent modifier l'interactivité", "Les élèves ne peuvent pas modifier l'interactivité"]}
            bind:value={$globalOptions.isInteractiveFree}
          />
        </div>
      </div>
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Correction</div>
        <div class="flex flex-row justify-start items-center px-4">
          <ButtonToggle titles={["Accès aux corrections", "Pas de corrections"]} isDisabled={$globalOptions.setInteractive !== "0"} bind:value={$globalOptions.isSolutionAccessible} />
        </div>
      </div>
    </div>
    <div class="modal-action">
      <Button on:click={handleEleveVueSetUp} title="Visualiser" />
    </div>
    <div class="flex flex-row justify-start px-4 py-2">
      <h3 class="font-bold text-lg text-coopmaths-struct dark:text-coopmathsdark-struct">Utilisation</h3>
    </div>
    <div class="flex flex-row justify-between items-center px-4">
      <div class="text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-semibold">Format de l'URL</div>
      <div class="flex">
        <FormRadio
          title="linkFormat"
          bind:valueSelected={currentLinkFormat}
          labelsValues={[
            { label: "En clair", value: "clear" },
            { label: "Racourci", value: "short", isDisabled: true },
            { label: "Crypté", value: "crypt", isDisabled: true },
          ]}
          orientation="row"
        />
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4 pt-3 pl-4">
      <div class="flex flex-col justify-center items-center px-2">
        <div class="text-coopmaths-struct-lightest dark:text-coopmathsdark-struct-light font-semibold">Lien</div>
        <div class="my-1">
          <ModalActionWithDialog
            on:display={() =>
              copyLinkToClipboard("linkCopiedDialog", buildUrlAddendumForEsParam(), availableLinkFormats[currentLinkFormat].isShort, availableLinkFormats[currentLinkFormat].isEncrypted)}
            message="Le lien de la fiche élève est copié dans le presse-papier !"
            messageError="Impossible de créer le lien dans le presse-papier !"
            dialogId="linkCopiedDialog"
            tooltipMessage={"Lien " + availableLinkFormats[currentLinkFormat].toolTipsMessage}
            buttonSecondIcon={availableLinkFormats[currentLinkFormat].icon}
          />
        </div>
      </div>
      <div class="flex flex-col justify-center items-center px-2">
        <div class="text-coopmaths-struct-lightest dark:text-coopmathsdark-struct-lightest font-semibold">QR-Code</div>
        <div class="my-1">
          <ModalForQRCode
            tooltipMessage={"QR-code (lien " + availableLinkFormats[currentLinkFormat].toolTipsMessage + ")"}
            width={QRCodeWidth}
            format={formatQRCodeIndex}
            isEncrypted={availableLinkFormats[currentLinkFormat].isEncrypted}
            isShort={availableLinkFormats[currentLinkFormat].isShort}
            urlAddendum={buildUrlAddendumForEsParam()}
            buttonSecondIcon={availableLinkFormats[currentLinkFormat].icon}
          />
        </div>
      </div>
      <div class="flex flex-col justify-center items-center px-2">
        <div class="text-coopmaths-struct-lightest dark:text-coopmathsdark-struct-light font-semibold">Embarqué</div>
        <div class="my-1">
          <ModalActionWithDialog
            on:display={() =>
              copyEmbeddedCodeToClipboard(
                "embeddedCodeCopiedDialog",
                buildUrlAddendumForEsParam(),
                availableLinkFormats[currentLinkFormat].isShort,
                availableLinkFormats[currentLinkFormat].isEncrypted
              )}
            message="Le code de la fiche élève est copié dans le presse-papier !"
            messageError="Impossible de créer le code dans le presse-papier !"
            dialogId="embeddedCodeCopiedDialog"
            tooltipMessage={"Code (lien " + availableLinkFormats[currentLinkFormat].toolTipsMessage + ")"}
            buttonIcon={"bx-code-alt"}
            buttonSecondIcon={availableLinkFormats[currentLinkFormat].icon}
          />
        </div>
      </div>
    </div>
  </div>
</div>
