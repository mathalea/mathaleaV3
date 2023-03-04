<script lang="ts">
  import { exercicesParams } from './store'
  import { Mathalea } from '../Mathalea.js'
  import type TypeExercice from './utils/typeExercice'
  import Footer from './Footer.svelte'
  import NavBar from './header/NavBar.svelte'
  import seedrandom from 'seedrandom'
  import Latex from '../lib/Latex'
  import Button from './forms/Button.svelte'

  Mathalea.loadExercicesFromUrl()

  async function uuidToExercice({
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
  }) {
    const exercice: TypeExercice = await Mathalea.load(uuid)
    exercice.seed = alea
    if (nbQuestions !== undefined) exercice.nbQuestions = nbQuestions
    if (cd !== undefined) exercice.correctionDetaillee = cd
    if (sup !== undefined) exercice.sup = sup
    if (sup2 !== undefined) exercice.sup2 = sup2
    if (sup3 !== undefined) exercice.sup3 = sup3
    if (sup4 !== undefined) exercice.sup4 = sup4
    exercice.interactif = interactif
    seedrandom(alea, { global: true })
    if (exercice.typeExercice === 'simple') {
      Mathalea.handleExerciceSimple(exercice)
      // exerciceSimpleToContenu(exercice)
    }
    exercice.nouvelleVersion()
    return exercice
  }

  
  async function getContentOfDocument () {
  const exercices: TypeExercice[] = []
  for (const param of $exercicesParams) {
    const exercice = await uuidToExercice(param)
    exercices.push(exercice)
  }
  const latex = new Latex()
  for (const exercice of exercices) {
    latex.addExercice({ title: exercice.titre, id: exercice.id, introduction: exercice.introduction, consigne: exercice.consigne, questions: exercice.listeQuestions, spacing: exercice.spacing, corrections: exercice.listeCorrections, introductionCorr: '', spacingCorr: exercice.spacingCorr })
  }
  return {file: latex.getFile(), exercices: latex.content}
}

let contents = getContentOfDocument()

  const copyExercices = async () => {
    try {
      const text = (await contents).exercices
      await navigator.clipboard.writeText(text)
      console.log('Content copied to clipboard')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }
  
  const copyDocument = async () => {
    try {
      const text = (await contents).file
      await navigator.clipboard.writeText(text)
      console.log('Content copied to clipboard')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

</script>

<NavBar />

<section class="ml-10 my-10">
  <Button title="Copier le code LaTeX des exercices" on:click={copyExercices} />
  <Button title="Copier le code LaTeX complet (avec preambule)" on:click={copyDocument} />
  <pre class="my-10">
    {#await contents }
        Chargement...
      {:then contents } 
      {contents.exercices}        
      {/await}
</pre>
</section>
<footer>
  <Footer />
</footer>

<style>
  footer {
    margin-top: auto;
  }

  pre {
    width: 80%;
    background-color: lightgray;
    overflow: scroll;
    padding: 10px;
  }
</style>
