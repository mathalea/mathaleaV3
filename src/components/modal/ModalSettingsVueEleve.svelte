<script lang="ts">
  import Button from '../forms/Button.svelte'
  import ButtonToggle from '../forms/ButtonToggle.svelte'
  import FormRadio from '../forms/FormRadio.svelte'
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
        <FormRadio
          title="Présentation"
          bind:valueSelected={$globalOptions.presMode}
          labelsValues={[
            { label: 'Une page unique', value: 'page' },
            { label: 'Une page par exercices', value: 'exos' },
            { label: 'Toutes les questions sur une page', value: 'liste' },
            { label: 'Une page par question', value: 'question' },
          ]}
        />
      </div>
      <div class="pb-2">
        <FormRadio
          title="Interactif"
          bind:valueSelected={$globalOptions.setInteractive}
          labelsValues={[
            { label: 'Laisser tel quel', value: 2 },
            { label: 'Tout interactif', value: 1 },
            { label: 'Pas d\'interactivité', value: 0 },
          ]}
        />
      </div>
      <div class="pb-2">
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Correction</div>
        <div class="flex flex-row justify-start items-center px-4">
          <ButtonToggle titles={['Accès aux corrections', 'Pas de corrections']} bind:value={$globalOptions.isSolutionAccessible} />
        </div>
      </div>
    </div>
    <ButtonToggle titles={['Les élèves peuvent modifier l\'interactivité', 'Les élèves ne peuvent pas modifier l\'interactivité']} bind:value={$globalOptions.isInteractiveFree} />
    <div class="modal-action">
      <Button on:click={handleEleveVueSetUp} />
    </div>
  </div>
</div>
