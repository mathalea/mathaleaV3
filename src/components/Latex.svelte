<script lang='ts'>
  import { exercicesParams } from './store'
  import { Mathalea } from '../Mathalea.js'
  import type TypeExercice from './utils/typeExercice'
  import Footer from './Footer.svelte'
  import NavBar from './header/NavBar.svelte'
  import seedrandom from 'seedrandom'

  Mathalea.loadExercicesFromUrl()

  async function getContent ({uuid, alea, nbQuestions, interactif = false, cd, sup, sup2, sup3, sup4}: {uuid: string, alea: string, nbQuestions?: number, interactif: boolean, cd?: boolean, sup?: string, sup2?: string, sup3?: string, sup4?: string }) {
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
        }
        exercice.nouvelleVersion()
        return exercice.contenu
    }
</script>

<NavBar />

<section>
  <pre>
    {#each $exercicesParams as exerciceParam}
      {#await getContent(exerciceParam) }
        Chargement...
      {:then content } 
      {content}        
      {/await}
    {/each}
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
    width: 500px;
    background-color: lightgray;
    overflow: scroll;
  }
</style>
