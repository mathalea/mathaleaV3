<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let message: string = "Default message"
  export let messageError: string = "Default error message"
  export let dialogId: string = "dialogbox"
  export let tooltipMessage: string = ""
  export let buttonSize: string = "text-2xl"
  export let buttonIcon: string = "bx-link"
  export let buttonSecondIcon: string = ""
  export let classForButton: string = ""
  export let title: string = ""

  const dispatch = createEventDispatcher()

  function fireMessage() {
    dispatch("display")
  }
</script>

<!-- 
    @component
    Bouton pour lancer une action et afficher un message informatif dans un modal

    __Action__ :

    Déclanchée lors du clic sur le bouton et appelée par `on:display={monAction}`

    ⚠ La fonction `monAction` est responsable de l'affichage du modal... ⚠

    __Paramètres__ :

    * `message` : message à afficher
    * `dialogId` : ID de la dialog box
    * `tooltipMessage` : message affiché au survol
    * `buttonSize` : taille du bouton
    * `buttonIcon` : icone utilisée pour le bouton
    * `buttonSecondIcon` : icone à ajouter
    * `classForButton` : pour ajouter des éléments de positionnement du bouton
    * `title` : titre pour un bouton (remplace l'icone)

    __Exemple__ :

    ```tsx
    <ModalActionWithDialog
        on:display={() => copyLinkToClipboard("linkCopiedDialog-2")}
        message="Le lien est copié dans le presse-papier !"
        messageError="Impossible de copier le lien dans le presse-papier"
        dialogId="linkCopiedDialog-2"
        tooltipMessage="Lien du Diaporama"
        buttonSize="text-[100px]"
        buttonIcon="bx-link"
        buttonSecondIcon=""
        classForButton = "mr-4 my-2"
        title = ""
    />
    ```
 -->

<div class="tooltip tooltip-bottom tooltip-neutral" data-tip={tooltipMessage}>
  <button
    type="button"
    class="{classForButton} {title.length === 0
      ? 'text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest'
      : 'text-coopmaths-canvas  dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest p-2 rounded-xl'}"
    on:click={fireMessage}
  >
    {#if title.length === 0}
      <i class="relative bx {buttonIcon} {buttonSize}" />
      {#if buttonSecondIcon.length !== 0}
        <i class="absolute -bottom-1 bx {buttonSecondIcon} text-sm -translate-x-3 text-coopmaths-warn dark:text-coopmathsdark-warn" />
      {/if}
    {:else}
      {title}
    {/if}
  </button>
  <dialog class="rounded-xl bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg" id={dialogId + "-1"}>
    {message}
  </dialog>
  <dialog class="rounded-xl bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg" id={dialogId + "-2"}>
    {messageError}
  </dialog>
</div>
