<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let message: string = "Default message"
  export let dialogId: string = "dialogbox"
  export let tooltipMessage: string = ""
  export let buttonSize: string = "text-2xl"
  export let buttonIcon: string = "bx-link"
  export let classForButton: string = ""

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
    * `classForButton` : pour ajouter des éléments de positionnement du bouton

    __Exemple__ :

    ```tsx
    <ModalActionWithDialog
        on:display={() => copyLinkToClipboard("linkCopiedDialog-2")}
        message="Le lien est copié dans le presse-papier !"
        dialogId="linkCopiedDialog-2"
        tooltipMessage="Lien du Diaporama"
        buttonSize="text-[100px]"
        buttonIcon="bx-link"
        classForButton = "mr-4 my-2"
    />
    ```
 -->

<div class="tooltip tooltip-bottom tooltip-neutral" data-tip={tooltipMessage}>
  <button
    type="button"
    class="{classForButton} text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
    on:click={fireMessage}
  >
    <i class="bx {buttonIcon} {buttonSize}" />
  </button>
  <dialog class="rounded-xl bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg" id={dialogId}>
    {message}
  </dialog>
</div>
