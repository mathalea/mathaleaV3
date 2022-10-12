<script lang='ts'>
  import { afterUpdate, onMount, tick } from 'svelte'
  import { fly } from 'svelte/transition'
  import { Mathalea } from '../Mathalea'
  import { exercicesParams } from './store'
  import seedrandom from 'seedrandom'
  import type { Exercice } from './utils/typeExercice'

  let divDiaporama: HTMLDivElement
  let currentQuestion = 0
  let listQuestions = [] // Concaténation de toutes les questions des exercices de exercicesParams
  let listSize = []
  onMount( async () => {
    Mathalea.updateUrl($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
        const exercice: Exercice = await Mathalea.load(paramsExercice.uuid)
        if (exercice === undefined) return
        if (paramsExercice.nbQuestions) exercice.nbQuestions = paramsExercice.nbQuestions
        if (paramsExercice.sup) exercice.sup = paramsExercice.sup
        if (paramsExercice.sup2) exercice.sup2 = paramsExercice.sup2
        if (paramsExercice.sup3) exercice.sup3 = paramsExercice.sup3
        if (paramsExercice.sup4) exercice.sup4 = paramsExercice.sup4
        if (paramsExercice.interactif) exercice.interactif = paramsExercice.interactif
        if (paramsExercice.alea) exercice.seed = paramsExercice.alea
        if (paramsExercice.cd !== undefined) exercice.correctionDetaillee = (paramsExercice.cd === '1')
        seedrandom (exercice.seed, { global: true })
        if (exercice.typeExercice === 'simple') Mathalea.handleExerciceSimple(exercice, false)
        exercice.nouvelleVersion()
        listQuestions = [...listQuestions, ...exercice.listeQuestions]
        for (let i = 0; i < exercice.listeQuestions.length; i++) {
            listSize.push(exercice.tailleDiaporama)
        }
    } 
    Mathalea.renderDiv(divDiaporama)
  })

  afterUpdate(async () => {
    await tick()
    if (divDiaporama) Mathalea.renderDiv(divDiaporama)
  })


  function prevQuestion() {
    if (currentQuestion > 0) currentQuestion--

	}
	
	function nextQuestion() {
	  if (currentQuestion < listQuestions.length - 1) currentQuestion++
	}
	
  const ARROW_LEFT = 37
  const ARROW_RIGHT = 39
  function handleShortcut(e) {
    if (e.keyCode === ARROW_LEFT ) {
		prevQuestion()
    }
    if (e.keyCode === ARROW_RIGHT ) {
        nextQuestion()
    }
  }


</script>

<svelte:window on:keyup={handleShortcut} />

<div class="h-screen scrollbar-hide dark:bg-white dark:text-slate-800" >
    {#each listQuestions as question, i (question)  }
        {#if i === currentQuestion}
          <div bind:this={divDiaporama}
           style={`font-size: ${1.5 * listSize[i]}rem; line-height: ${2 * listSize[i]}rem;`}
           in:fly="{{ y: 100, duration: 1000 }}"
           out:fly="{{ y: -200, duration: 1000 }}"
           >
              {@html question}
          </div>
        {/if}
    {/each}
</div>
  
<style>
</style>
  