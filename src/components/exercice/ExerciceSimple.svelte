<script>
import { Mathalea } from '../../Mathalea'

  import HeaderExercice from './HeaderExercice.svelte'
  export let exercice
  export let indiceExercice
  export let indiceLastExercice



  const headerExerciceProps = {
    title: 'Mon exercice',
  }

  Mathalea.handleExerciceSimple(exercice)


console.log(exercice)
</script>


<HeaderExercice {...headerExerciceProps} {indiceExercice} {indiceLastExercice} />