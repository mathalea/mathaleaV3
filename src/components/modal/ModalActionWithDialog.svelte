<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { component_subscribe } from "svelte/internal"
  export let message: string = "Default message"
  export let id = "dialogbox"
  export let tooltipMessage = ""
  export let buttonSize = "text-2xl"
  export let buttonIcon = "bx-link"

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

    __Paramètres__ :

    * `message` : message à afficher
    * `id` : ID de la dialog box
    * `tooltipMessage` : message affiché au survol
    * `buttonSize` : taille du bouton
    * `buttonIcon` : icone utilisée pour le bouton

    __Exemple__ :

    ```
    <ModalActionWithDialog
          on:display={() => copyLinkToClipboard("linkCopiedDialog-2")}
          message="Le lien est copié dans le presse-papier !"
          id="linkCopiedDialog-2"
          tooltipMessage="Lien du Diaporama"
          buttonSize="text-[100px]"
          buttonIcon="bx-link"
        />
    ```

 -->

<div class="tooltip tooltip-bottom tooltip-neutral" data-tip={tooltipMessage}>
  <button
    type="button"
    class="mr-4 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
    on:click={fireMessage}
  >
    <i class="bx {buttonIcon} {buttonSize}" />
  </button>
  <dialog class="rounded-xl bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg" {id}>
    {message}
  </dialog>
</div>
