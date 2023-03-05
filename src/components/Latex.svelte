<script lang="ts">
  import { exercicesParams } from './store'
  import { Mathalea } from '../Mathalea.js'
  import type TypeExercice from './utils/typeExercice'
  import Footer from './Footer.svelte'
  import NavBar from './header/NavBar.svelte'
  import seedrandom from 'seedrandom'
  import Latex from '../lib/Latex'
  import Button from './forms/Button.svelte'
  import FormRadio from './forms/FormRadio.svelte'

  Mathalea.loadExercicesFromUrl()

  let nbVersions = 1
  let title = ''
  let reference = ''
  let subtitle = ''
  let style = 'Coopmaths'
  let textForOverleaf : HTMLInputElement
  let dialogLua: HTMLDialogElement

  async function uuidToExercice(
    {
      uuid,
      alea,
      nbQuestions,
      interactif = false,
      cd,
      sup,
      sup2,
      sup3,
      sup4,
    }: {
      uuid: string
      alea: string
      nbQuestions?: number
      interactif: boolean
      cd?: boolean
      sup?: string
      sup2?: string
      sup3?: string
      sup4?: string
    },
    version = 1
  ) {
    const exercice: TypeExercice = await Mathalea.load(uuid)
    exercice.seed = alea
    if (nbQuestions !== undefined) exercice.nbQuestions = nbQuestions
    if (cd !== undefined) exercice.correctionDetaillee = cd
    if (sup !== undefined) exercice.sup = sup
    if (sup2 !== undefined) exercice.sup2 = sup2
    if (sup3 !== undefined) exercice.sup3 = sup3
    if (sup4 !== undefined) exercice.sup4 = sup4
    exercice.interactif = interactif
    const seedSup = version === 1 ? '' : `v${version}`
    seedrandom(exercice.seed + seedSup, { global: true })
    if (exercice.typeExercice === 'simple') {
      Mathalea.handleExerciceSimple(exercice)
    }
    exercice.nouvelleVersion()
    return exercice
  }

  async function getContentsOfExercices(version = 1) {
    const exercices: TypeExercice[] = []
    for (const param of $exercicesParams) {
      const exercice = await uuidToExercice(param, version)
      exercices.push(exercice)
    }
    const latex = new Latex()
    for (const exercice of exercices) {
      latex.addExercice(exercice)
    }
    return { content: latex.content, contentCorr: latex.contentCorr }
  }

  async function getContentOfDocument({ nbVersions, title, reference, subtitle, style }) {
    const latex = new Latex()
    const tampon = nbVersions > 1
    for (let i = 1; i < nbVersions + 1; i++) {
      let newContents = { content: '', contentCorr: '' }
      if (tampon) {
        newContents.content = `\n\\version{${i}}`
        if (i > 1) newContents.content += '\\setcounter{ExoMA}{0}'
        newContents.contentCorr = `\n\\version{${i}}`
        if (i > 1) newContents.contentCorr += '\\setcounter{ExoMA}{0}'
        newContents.content += (await getContentsOfExercices(i)).content + '\n\\clearpage'
        newContents.contentCorr += (await getContentsOfExercices(i)).contentCorr + '\n\\clearpage'
      } else {
        newContents = await getContentsOfExercices(i)
      }
      latex.content = latex.content + newContents.content
      latex.contentCorr = latex.contentCorr + newContents.contentCorr
    }
    return { file: latex.getFile({ title, reference, subtitle, style }), exercices: latex.text, corrections: latex.contentCorr }
  }

  let contents = getContentOfDocument({ nbVersions, title, subtitle, reference, style })
  $: {
    contents = getContentOfDocument({ nbVersions, title, subtitle, reference, style })
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
      const text = (await contents).file
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
    const text = (await contents).file
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
        <Button title="Copier le code LaTeX complet (avec preambule)" on:click={copyDocument} />
    </form>

    <div class="my-5 flex-auto w-full space-x-5">
      <div class="inline-flex align-top">
        <FormRadio
          title="Style"
          bind:valueSelected={style}
          labelsValues={[
            { label: 'Coopmaths', value: 'Coopmaths' },
            { label: 'Classique', value: 'Classique' },
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
      {#await contents}
        Chargement...
      {:then contents}
        {contents.exercices}
  
        %%%%%%%%%%%%%%%%%%%%%%
        %%%   CORRECTION   %%%
        %%%%%%%%%%%%%%%%%%%%%%
  
        {contents.corrections}
      {/await}
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
