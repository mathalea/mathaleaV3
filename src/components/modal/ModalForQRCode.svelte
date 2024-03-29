<script lang="ts">
  import { urlToQRCodeOnWithinImgTag, downloadQRCodeImage, allowedImageFormats } from "../utils/qr-code.js"
  import { copyQRCodeImageToClipboard } from "../utils/clipboard"
  import FormRadio from "../forms/FormRadio.svelte"

  // définition d'un type pour le format de l'image afin de rester dans les valeurs possible de `allowedImageFormats`
  // source: https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range/70307091#70307091
  type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>
  type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
  // type FormatCodeRange = Range<0, allowedImageFormats.length>

  export let imageId: string = "QRImage"
  export let dialogId: string = "dialogQR"
  export let width: number = 100
  export let format = 0
  export let tooltipMessage: string = "My tooltip"
  export let buttonSize: string = "text-2xl"
  export let buttonIcon: string = "bx-qr"
  export let buttonSecondIcon: string = ""
  export let classForButton: string = ""
  export let urlAddendum: string = ""
  export let isShort: boolean = false
  export let isEncrypted: boolean = false

  const labelsForFormats = [
    { label: "jpeg", value: 0 },
    { label: "png", value: 1 },
    { label: "webp", value: 2 },
  ]
</script>

<!-- 
    @component
    Bouton pour afficher un modal permettant d'obtenir un QR-Code de l'URL _courante_
    via copie dans le presse-papier ou téléchargement.

    __Paramètres__ :

    * `imageId` : ID de l'image
    * `dialogId` : ID de la dialog box
    * `tooltipMessage` : message affiché au survol
    * `buttonSize` : taille du bouton
    * `buttonIcon` : icone utilisée pour le bouton
    * `buttonSecondIcon` : icone à ajouter
    * `classForButton` : pour ajouter des éléments de positionnement du bouton
    * `width`: largeur du QR-Code
    * `format`: un chiffre correspondant au format de l'image créée 
    (basé sur le tableau des formats possible `allowedImageFormats` de `qr-code.js`)
    * `urlAddendum` : chaîne à ajouter à l'URL
    * `isShorten`: l'URL attendue doit-elle être raccourcie ou non.
    * `isEncrypted`: l'URL attendue doit-elle être cryptée ou non.

    __Exemple__ :

    ```tsx
    <ModalForQrCode
        dialogId="QRCodeModal-2"
        imageId="QRCodeCanvas-2"
        tooltipMessage="QR-code du diaporama"
        width={QRCodeWidth}
        format={formatQRCodeIndex}
        buttonSize="text-[100px]"
        classForButton="mx-12 my-2"
        urlAddendum={buildUrlAddendumForEsParam()}
    />
    ```

 -->
<label for={dialogId} class="{classForButton}  hover:cursor-pointer">
  <div class="tooltip tooltip-bottom tooltip-neutral" data-tip={tooltipMessage}>
    <i
      class="relative bx {buttonSize} text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest self-center {buttonIcon}"
      on:click={() => urlToQRCodeOnWithinImgTag(imageId, width, format, urlAddendum, isShort, isEncrypted)}
      on:keydown={() => urlToQRCodeOnWithinImgTag(imageId, width, format, urlAddendum, isShort, isEncrypted)}
    />
    {#if buttonSecondIcon.length !== 0}
      <i class="absolute -bottom-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas rounded-full bx {buttonSecondIcon} text-sm -translate-x-3 text-coopmaths-warn  dark:text-coopmathsdark-warn" />
    {/if}
  </div>
</label>
<input type="checkbox" id={dialogId} class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative z-0 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark">
    <dialog class="rounded-xl z-10 bg-coopmaths-canvas text-coopmaths-corpus  dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light" id="{dialogId}-1">
      Le QR-Code est copié dans le presse-papier !
    </dialog>
    <dialog class="rounded-xl z-10 bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light" id="{dialogId}-2">
      Impossible de copier le QR-Code dans ce navigateur !<br /> Vérifier les permissions.
    </dialog>
    <label for={dialogId} class="btn absolute right-2 top-2 bg-transparent border-0 active:bg-transparent focus:bg-transparent hover:bg-transparent">
      <i
        class="bx text-3xl bx-x text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest text-opacity-60 cursor-pointer"
      />
    </label>
    <h3 class="text-lg font-bold text-coopmaths-struct dark:text-coopmathsdark-struct">QR-Code du Diaporama</h3>
    <p class="py-4 text-base font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus">Choisissez de copier l'image ou de la télécharger.</p>
    <!-- format QRCode -->
    <div class="flex flex-row items-center justify-start">
      <div class="font-semibold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Format de l'image</div>
      <FormRadio orientation="row" title="Format image" bind:valueSelected={format} labelsValues={labelsForFormats} />
    </div>
    <!-- taille QR-Code -->
    <div class="flex flex-row items-center justify-start my-4">
      <div class="text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-semibold">Taille du QR-Code</div>
      <input
        type="number"
        min="80"
        max="300"
        bind:value={width}
        class="ml-3 w-20 h-8 text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark  border-1 border-coopmaths-action dark:border-coopmathsdark-action font-light focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-30"
        on:change={() => urlToQRCodeOnWithinImgTag(imageId, width, format, urlAddendum, isShort, isEncrypted)}
      />
    </div>
    <div class="flex flex-col justify-center">
      <div class="flex flex-row justify-center p-4">
        <!-- <canvas id=id /> -->
        <img id={imageId} alt="QR-Code du diaporama" />
      </div>
      <div class="flex flex-row justify-center pb-6">
        <div class="tooltip tooltip-bottom tooltip-neutral" data-tip="Copier le QR-Code">
          <button
            type="button"
            class="mx-6 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            on:click={() => copyQRCodeImageToClipboard(imageId, dialogId)}
          >
            <i class="bx text-[30px] bx-copy-alt" />
          </button>
        </div>
        <div class="tooltip tooltip-bottom tooltip-neutral" data-tip="Télécharger le QR-Code">
          <button
            type="button"
            class="mx-6 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            on:click={() => downloadQRCodeImage(imageId, format)}
          >
            <i class="bx text-[30px] bx-download" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
