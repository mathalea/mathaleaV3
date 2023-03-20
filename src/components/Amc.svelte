<script lang="ts">
  import { creerDocumentAmc, exportQcmAmc } from "../modules/creerDocumentAmc.js";
  import Mathalea from "../lib/Mathalea";
  import Footer from "./Footer.svelte";
  import { exercicesParams } from "./store";
  import type TypeExercice from "./utils/typeExercice";
  import FormRadio from "./forms/FormRadio.svelte";
  import { darkMode } from "./store";
    import NavBar from "./header/NavBar.svelte";

  let exercices: TypeExercice[] = [];
  let content = ""
  let entete = 'AMCcodeGrid'
  let format = 'A4'
  let matiere = ''
  let titre = ''
  let nbQuestions: number[] = []
  let nbQuestionsString = ''

  async function initExercices() {
    Mathalea.updateExercicesParamsFromUrl();
    exercices = await Mathalea.getExercicesFromParams($exercicesParams);
    for (const exercice of exercices){
      exercice.nouvelleVersion()
      nbQuestions.push(exercice.nbQuestions)
    }
  }

  initExercices();

  $: {
    // ToDo vérifier la saisie utilisateur
    // nbQuestions = nbQuestionsString.split(',').map(e => parseInt(e))
    content = creerDocumentAmc({ questions: exercices, typeEntete: entete, format, matiere, titre, nbQuestions })
  }
</script>

<main class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {$darkMode.isActive ? 'dark' : ''}">
  <NavBar subtitle="AMC" />

  <section class="px-10 py-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <div class="flex my-4 space-x-5">
      <div>
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Type d'entête</div>
        <FormRadio
        title="entete"
          bind:valueSelected={entete}
          labelsValues={[
            { label: "Grille de codage", value: "AMCcodeGrid" },
            { label: "Copies pré-remplies", value: "AMCassociation" },
            { label: "Noms et prénoms manuscrits", value: "manuscrits"},
          ]}
        />
      </div>
      <div>
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Format</div>
        <FormRadio
          title="format"
          bind:valueSelected={format}
          labelsValues={[
            { label: "Format A4 portrait", value: "A4" },
            { label: "Format A3 paysage 2 colonnes", value: "A3" }
          ]}
        />
      </div>
    </div>
    <div class="flex space-x-5">
      <div>
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Matière</div>
        <input type="text" class="border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
        bind:value={matiere}>
      </div>
      <div>
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Titre</div>
        <input type="text" class="border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
        bind:value={titre}>
      </div>
      <div>
        <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Nombre de questions</div>
        <input type="text" class="border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
        bind:value={nbQuestionsString}>
      </div>
    </div>
  <pre class="my-10 shadow-md bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus dark:text-coopmathsdark-corpus p-4 w-full overflow-auto">
    {content}
  </pre>
</section>
<Footer />
</main>

<style>
</style>
