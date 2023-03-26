<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import Button from "../forms/Button.svelte"

  export let modalId: string = "my-modal"
  export let modalButtonId: string = "ok-btn"
  export let modalButtonTitle: string = "OK"
  export let icon: string = "bx-error"

  // Au clic sur le bouton, on diffuse _action_
  const dispatch = createEventDispatcher()

  function triggerAction() {
    dispatch("action", {
      msg: "Action triggered !",
    })
  }
</script>

<!-- @component
  Bouton dont le clic affiche un modal contenant un message d'information et un bouton pour déclencher véritablement l'action

  __Paramètres__ :

  * `modalId` : chaîne représentant l'ID du modal affiché
  * `modalButtonId` : chaîne représentant l'ID du bouton du modal
  * `modalButtonTitle`: chaîne reporésentant le titre du bouton
  * `icon`: nom de l'icone (bibliothèque [Boxicons](https://boxicons.com/?query=))

  __Remarques__ :

  * un slot avec le nom _header_ est disponible pour le titre du message et un autre avec le nom _content_ pour le contenu
  * le bouton du modal diffuse le mot _action_ lorsqu'il est cliqué afin de déclencher dans le parent avec `on:action`
  * la fermeture du modal doit être géré dans le parent. Par exemple :

  ```tsx
  let modal: HTMLElement
  onMount(async () => {
    modal = document.getElementById("my-modal")
  })
  // click en dehors du modal le fait disparaître
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }
  // fonction appelée par exemple par `on:action`
  function handleAction() {
    modal.style.display = "none"
  }
  ```

  __Exemple d'utilisation__ :

  ```tsx
  <ModalMessageBeforeAction buttonTitle="Continuer" on:action={handleOverLeaf} icon="bxs-error">
    <span slot="header">Attention !</span>
    <ul slot="content" class="list-inside list-disc text-left text-base">
      <li>Il faudra uploader sur Overleaf le package <span class="font-mono bg-coopmaths-warn-100">automultiplechoice.sty</span> pour compiler.</li>
      <li>Le fichier sortit d’Overleaf ne constitue qu’un aperçu.</li>
      <li>Le fichier doit être compilé sous AMC impérativement pour que le fichier soit fonctionnel.</li>
    </ul>
  </ModalMessageBeforeAction>
  ```

-->

<div class="fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id={modalId}>
  <!-- 
  <slot name="header" />
  <slot name="content" /> -->
  <!--modal content-->
  <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-coopmaths-canvas">
    <div class="mt-3 text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-coopmaths-warn-100">
        <div class="h-6 w-6 text-coopmaths-warn-darkest"><i class="bx bx-sm {icon}" /></div>
      </div>
      <div class="text-3xl pt-4 leading-6 font-medium text-coopmaths-warn-dark">
        <slot name="header">
          <span>Successful!</span>
        </slot>
      </div>
      <div class="mt-2 px-7 py-3">
        <div class="text-sm text-coopmaths-corpus-light">
          <slot name="content">
            <span>Account has been successfully registered!</span>
          </slot>
        </div>
      </div>
      <div class="items-center px-4 py-3">
        <Button title={modalButtonTitle} idLabel={modalButtonId} on:click={triggerAction} />
      </div>
    </div>
  </div>
</div>
