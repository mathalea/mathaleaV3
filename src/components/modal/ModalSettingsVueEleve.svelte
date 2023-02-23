<script lang="ts">
  import { globalOptions } from '../store'
  function handleEleveVueSetUp() {
    globalOptions.update((params) => {
      params.v = 'eleve'
      return params
    })
  }
</script>

<div class="modal" id="reglages-vue-eleve">
  <div class="modal-box bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <h3 class="font-bold text-lg text-coopmaths-struct dark:text-coopmathsdark-struct">Réglages de la feuille Élève</h3>
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
        <div class="flex flex-col justify-start items-start">
          <div class="form-check flex flex-row ml-4 items-center">
            <input
              class="form-check-input rounded-full h-4 w-4 border border-coopmaths-action bg-coopmaths-canvas dark:border-coopmathsdark-action dark:bg-coopmathsdark-canvas-dark text-coopmaths-action checked:bg-coopmaths-action checked:border-coopmaths-action active:border-coopmaths-action focus:border-coopmaths-action dark:text-coopmathsdark-action dark:checked:bg-coopmathsdark-action dark:checked:border-coopmathsdark-action dark:active:border-coopmathsdark-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 focus:border-1 transition duration-200 mt-1 mr-2 cursor-pointer"
              type="radio"
              name="presentationMode"
              id="presentationModeRadio1"
              bind:group={$globalOptions.presMode}
              value={'page'}
            />
            <label
              class="form-check-label inline-block text-coopmaths-corpus dark:text-coopmathsdark-corpus text-sm text-opacity-70 font-light"
              for="presentationModeRadio1"
            >
              une page unique
            </label>
          </div>
          <div class="form-check flex flex-row ml-4 items-center">
            <input
              class="form-check-input rounded-full h-4 w-4 border border-coopmaths-action bg-coopmaths-canvas dark:border-coopmathsdark-action dark:bg-coopmathsdark-canvas-dark text-coopmaths-action checked:bg-coopmaths-action checked:border-coopmaths-action active:border-coopmaths-action focus:border-coopmaths-action dark:text-coopmathsdark-action dark:checked:bg-coopmathsdark-action dark:checked:border-coopmathsdark-action dark:active:border-coopmathsdark-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 focus:border-1 transition duration-200 mt-1 mr-2 cursor-pointer"
              type="radio"
              name="presentationMode"
              id="presentationModeRadio2"
              bind:group={$globalOptions.presMode}
              value={'exos'}
            />
            <label
              class=" form-check-label inline-block text-coopmaths-corpus dark:text-coopmathsdark-corpus text-sm text-opacity-70 font-light"
              for="presentationModeRadio2"
            >
              une page par exercice
            </label>
          </div>

          <div class="form-check flex flex-row ml-4 items-center">
            <input
              class="form-check-input rounded-full h-4 w-4 border border-coopmaths-action bg-coopmaths-canvas dark:border-coopmathsdark-action dark:bg-coopmathsdark-canvas-dark text-coopmaths-action checked:bg-coopmaths-action checked:border-coopmaths-action active:border-coopmaths-action focus:border-coopmaths-action dark:text-coopmathsdark-action dark:checked:bg-coopmathsdark-action dark:checked:border-coopmathsdark-action dark:active:border-coopmathsdark-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 focus:border-1 transition duration-200 mt-1 mr-2 cursor-pointer"
              type="radio"
              name="presentationMode"
              id="presentationModeRadio3"
              bind:group={$globalOptions.presMode}
              value={'liste'}
            />
            <label
              class="form-check-label inline-block text-coopmaths-corpus dark:text-coopmathsdark-corpus text-sm text-opacity-70 font-light"
              for="presentationModeRadio3"
            >
              toutes les questions sur une page
            </label>
          </div>
          <div class="form-check flex flex-row ml-4 items-center">
            <input
              class="form-check-input rounded-full h-4 w-4 border border-coopmaths-action bg-coopmaths-canvas dark:border-coopmathsdark-action dark:bg-coopmathsdark-canvas-dark text-coopmaths-action checked:bg-coopmaths-action checked:border-coopmaths-action active:border-coopmaths-action focus:border-coopmaths-action dark:text-coopmathsdark-action dark:checked:bg-coopmathsdark-action dark:checked:border-coopmathsdark-action dark:active:border-coopmathsdark-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 focus:border-1 transition duration-200 mt-1 mr-2 cursor-pointer"
              type="radio"
              name="presentationMode"
              id="presentationModeRadio4"
              bind:group={$globalOptions.presMode}
              value={'questions'}
            />
            <label
              class="form-check-label inline-block text-coopmaths-corpus dark:text-coopmathsdark-corpus text-sm text-opacity-70 font-light"
              for="presentationModeRadio4"
            >
              une page par question
            </label>
          </div>
        </div>
      </div>
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Interactif</div>
        <div class="flex flex-row justify-start items-center px-4">
          <button
            type="button"
            on:click={() => {
              globalOptions.update((l) => {
                l.isInteractive = !$globalOptions.isInteractive
                return l
              })
            }}
          >
            <i
              class="mt-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm {$globalOptions.isInteractive
                ? 'bx-toggle-right'
                : 'bx-toggle-left'}"
            />
          </button>
          <div class="inline-flex pl-2">{$globalOptions.isInteractive ? 'Avec interactivité' : 'Sans interactivité'}</div>
        </div>
      </div>
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Correction</div>
        <div class="flex flex-row justify-start items-center px-4">
          <button
            type="button"
            on:click={() => {
              globalOptions.update((l) => {
                l.isSolutionAccessible = !$globalOptions.isSolutionAccessible
                return l
              })
            }}
          >
            <i
              class="mt-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm {$globalOptions.isSolutionAccessible
                ? 'bx-toggle-right'
                : 'bx-toggle-left'}"
            />
          </button>
          <div class="inline-flex pl-2">{$globalOptions.isSolutionAccessible ? 'Accès aux corrections' : 'Pas de correction'}</div>
        </div>
      </div>
    </div>
    <div class="modal-action">
      <button
        type="button"
        class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
        on:click={handleEleveVueSetUp}
      >
        Valider
      </button>
    </div>
  </div>
</div>
