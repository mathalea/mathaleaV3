<script lang="ts">
  import Button from "../forms/Button.svelte"
  import ButtonToggle from "../forms/ButtonToggle.svelte"
  import FormRadio from "../forms/FormRadio.svelte"
  import { globalOptions } from "../store"
  import ModalActionWithDialog from "../modal/ModalActionWithDialog.svelte"
  import ModalForQrCode from "../modal/ModalForQRCode.svelte"
  import { copyLinkToClipboard } from "../utils/clipboard"
  import { buildUrlAddendumForEsParam, getShortenedCurrentUrl } from "../utils/urls"

  let formatQRCodeIndex: number = 0
  let QRCodeWidth = 100

  function handleEleveVueSetUp() {
    let url = document.URL + "&v=eleve"
    url += "&title=" + $globalOptions.title
    url += "&es=" + buildUrlAddendumForEsParam()
    window.open(url, "_blank").focus()
    // globalOptions.update((params) => {
    //   params.v = "eleve"
    //   return params
    // })
  }
</script>

<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal" id="reglages-vue-eleve">
  <div class="modal-box relative bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <label
      for="my-modal"
      class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer absolute right-6 top-6"
    >
      <i class="bx bx-sm bx-x" />
    </label>
    <div class="flex flex-row justify-start p-6">
      <h3 class="font-bold text-lg text-coopmaths-struct dark:text-coopmathsdark-struct">Réglages de la feuille Élève</h3>
    </div>
    <div class="py-4 pl-2 grid grid-cols-2 gap-4">
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light  dark:text-coopmathsdark-struct-light">Titre</div>
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
          bind:valueSelected={$globalOptions.presMode}
          labelsValues={[
            { label: "Une page unique", value: "page" },
            { label: "Une page par exercice", value: "exos" },
            { label: "Toutes les questions sur une page", value: "liste" },
            { label: "Une page par question", value: "question" },
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
          <ButtonToggle titles={["Accès aux corrections", "Pas de corrections"]} bind:value={$globalOptions.isSolutionAccessible} />
        </div>
      </div>
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Liens</div>
        <div class="flex flex-row px-4 -mt-2 justify-start">
          <div class="mr-4 my-2">
            <ModalActionWithDialog
              on:display={() => copyLinkToClipboard("linkCopiedDialog-1", buildUrlAddendumForEsParam())}
              message="Le lien de la fiche élève est copié dans le presse-papier !"
              messageError="Impossible de créer le lien dans le presse-papier !"
              dialogId="linkCopiedDialog-1"
              tooltipMessage="Lien en clair"
              buttonSecondIcon="bx-glasses-alt"
            />
          </div>
          <div class="mr-4 my-2">
            <ModalActionWithDialog
              on:display={() => copyLinkToClipboard("linkCopiedDialog-2", buildUrlAddendumForEsParam(), true)}
              message="Le lien de la fiche élève est copié dans le presse-papier !"
              messageError="Impossible de créer le lien dans le presse-papier !"
              dialogId="linkCopiedDialog-2"
              tooltipMessage="Lien raccourci"
              buttonSecondIcon="bx-move-horizontal"
            />
          </div>
          <div class="mr-4 my-2">
            <ModalActionWithDialog
              on:display={() => copyLinkToClipboard("linkCopiedDialog-3", buildUrlAddendumForEsParam(), false, true)}
              message="Le lien de la fiche élève est copié dans le presse-papier !"
              messageError="Impossible de créer le lien dans le presse-papier !"
              dialogId="linkCopiedDialog-3"
              tooltipMessage="Lien crypté"
              buttonSecondIcon="bx-lock"
            />
          </div>
          <div class="mr-4 my-2">
            <ModalForQrCode dialogId="QRCodeModal-1" imageId="QRCodeCanvas-1" tooltipMessage="QR-code" width={QRCodeWidth} format={formatQRCodeIndex} urlAddendum={buildUrlAddendumForEsParam()} />
          </div>
        </div>
      </div>
    </div>

    <div class="modal-action">
      <Button on:click={handleEleveVueSetUp} title="Visualiser" />
    </div>
  </div>
</div>
