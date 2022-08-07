<script>
  import HeaderExercice from './HeaderExercice.svelte'
  export let exercice
  export let indiceExercice
  export let indiceLastExercice



  const headerExerciceProps = {
    title: 'Mon exercice',
  }


</script>


<HeaderExercice {...headerExerciceProps} {indiceExercice} {indiceLastExercice} />
Exercice simple pas encore pris en charge