<script lang="ts">
  import { creerDocumentAmc } from '../modules/creerDocumentAmc.js'
  import Mathalea from '../lib/Mathalea'
  import Footer from './Footer.svelte'
  import { exercicesParams } from './store'
  import type TypeExercice from './utils/typeExercice'

  let exercices: TypeExercice[] = []
  let content = ''

  async function initExercices() {
    Mathalea.updateExercicesParamsFromUrl()
    exercices = await Mathalea.getExercicesFromParams($exercicesParams)

    content += creerDocumentAmc({questions: exercices})
  }

  initExercices()


</script>

<section>
  <pre>
    {content}
  </pre>
</section>
<Footer />

<style>
  pre {
    width: 600px;
  }
</style>
