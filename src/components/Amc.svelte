<script lang="ts">
  import Mathalea from '../lib/Mathalea.js'
  import Footer from './Footer.svelte'
  import { exercicesParams } from './store'
  import type TypeExercice from './utils/typeExercice'

  let exercices: TypeExercice[] = []
  let content = ''

  async function initExercices() {
    Mathalea.loadExercicesFromUrl()
    exercices = await Mathalea.getExercicesFromParams($exercicesParams)

    for (const exercice of exercices) {
        exercice.nouvelleVersion()
        console.log(exercice)
        content += exercice.listeQuestions[0]
    }
  }

  initExercices()


</script>

<section>
  {content}
</section>
<Footer />

<style>
</style>
