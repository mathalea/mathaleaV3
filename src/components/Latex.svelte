<script lang="ts">
  import { exercicesParams } from './store'
  import { Mathalea } from '../lib/Mathalea.js'
  import type TypeExercice from './utils/typeExercice'
  import Footer from './Footer.svelte'
  import NavBar from './header/NavBar.svelte'
  import Latex from '../lib/Latex'
  import Button from './forms/Button.svelte'
  import FormRadio from './forms/FormRadio.svelte'

  let nbVersions = 1
  let title = ''
  let reference = ''
  let subtitle = ''
  let style: 'Coopmaths' | 'Classique' | 'Can' = 'Coopmaths'
  let textForOverleaf : HTMLInputElement
  let dialogLua: HTMLDialogElement
  let exercices: TypeExercice[]
  let contents = { content: '', contentCorr : ''}
  
  const latex = new Latex()
  async function initExercices () {
    Mathalea.loadExercicesFromUrl()
    exercices = await Mathalea.getExercicesFromParams($exercicesParams)
    latex.addExercices(exercices)
    contents = latex.getContents(style, nbVersions)
  }

  initExercices()

  $: {
    contents = latex.getContents(style, nbVersions)
  }

  const copyExercices = async () => {
    try {
      const text = document.querySelector('pre').innerText
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Accès au presse-papier impossible: ', err)
    }
  }

  const copyDocument = async () => {
    try {
      const text = (await latex.getFile({title, reference, subtitle, style, nbVersions}))
      await navigator.clipboard.writeText(text)
      dialogLua.showModal()
      setTimeout(()=>{
        dialogLua.close()
      }, 2000)
    } catch (err) {
      console.error('Accès au presse-papier impossible: ', err)
    }
  }

  const copyDocumentToOverleaf = async () => {
    const text = (await latex.getFile({title, reference, subtitle, style, nbVersions}))
    textForOverleaf.value = encodeURIComponent(text)
  }
</script>

<main class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
  <NavBar />

  <section class="ml-10 my-10 ">
    <form class="my-5 flex-auto w-full space-x-5" method="POST" action="https://www.overleaf.com/docs" target="_blank">
        <input type="hidden" name="encoded_snip" value="" bind:this={textForOverleaf} autocomplete="off" />
        <input type="hidden" name="snip_name" value="CoopMaths" autocomplete="off" />
        <input type="hidden" name="engine" value="lualatex" autocomplete="off" />
        <button
          id="btn_overleaf"
          type="submit"
          on:click={copyDocumentToOverleaf}
          class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-blue-600 hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
        >
          Compiler en PDF sur Overleaf.com
        </button>
        <Button title="Copier le code LaTeX des exercices" on:click={copyExercices} />
        <Button title="Copier le code LaTeX complet (avec préambule)" on:click={copyDocument} />
    </form>

    <div class="my-5 flex-auto w-full space-x-5">
      <div class="inline-flex align-top">
        <FormRadio
          title="Style"
          bind:valueSelected={style}
          labelsValues={[
            { label: 'Coopmaths', value: 'Coopmaths' },
            { label: 'Classique', value: 'Classique' },
            { label: 'Course aux nombres', value: 'Can' },
          ]}
        />
      </div>
      <input type="text" placeholder="Titre" bind:value={title} />
      <input type="text" placeholder={style === 'Coopmaths' ? 'Référence' : 'Haut de page gauche'} bind:value={reference} />
      <input type="text" placeholder={style === 'Coopmaths' ? 'Sous-titre / Chapitre' : 'Pied de page droit'} bind:value={subtitle} />
      <label for="numberOfVersions">Nombre de versions des exercices</label>
      <input type="number" name="numberOfVersions" maxlength="2" min="1" max="20" class="ml-2" bind:value={nbVersions} />
    </div>

    <dialog bind:this={dialogLua} class="rounded-xl bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg">
      <p>Le contenu a été copié dans le presse-papier.</p> 
      <p>Il faudra utiliser <em class="text-coopmaths font-bold">LuaLaTeX</em> pour compiler le document</p>
    </dialog>
      
    <pre class="my-10 shadow-md bg-coopmaths-canvas-dark p-4 w-4/6 overflow-auto">
      {contents.content}

%%%%%%%%%%%%%%%%%%%%%%
%%%   CORRECTION   %%%
%%%%%%%%%%%%%%%%%%%%%%

      {contents.contentCorr}
  </pre>
  </section>
  <footer>
    <Footer />
  </footer>
</main>

<style>
  footer {
    margin-top: auto;
  }
</style>