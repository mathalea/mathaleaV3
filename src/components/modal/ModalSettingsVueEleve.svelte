<script lang="ts">
  import FormRadio from "../forms/FormRadio.svelte"
  import { globalOptions } from "../store"
  function handleEleveVueSetUp() {
    globalOptions.update((params) => {
      params.v = "eleve"
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
        <FormRadio
          title="Présentation"
          bind:valueSelected={$globalOptions.presMode}
          labelsValues={[
            { label: "Une page unique", value: "page" },
            { label: "Une page par exercices", value: "exos" },
            { label: "Toutes les questions sur une page", value: "liste" },
            { label: "Une page par question", value: "question" },
          ]}
        />
      </div>
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Interactif</div>
        <!-- <div class="flex flex-row justify-start items-center px-4">
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
        </div> -->
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
          <div class="inline-flex pl-2">{$globalOptions.isSolutionAccessible ? "Accès aux corrections" : "Pas de correction"}</div>
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
