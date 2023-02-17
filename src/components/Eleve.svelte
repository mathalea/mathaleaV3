<script lang="ts">
  import { Mathalea } from "../Mathalea"
  import { exercicesParams, darkMode, eleveVueSetUp, globalOptions } from "./store"
  import Exercice from "./exercice/Exercice.svelte"
  import { onMount } from "svelte"

  let currentExerciseNumber: number = 0

  function handleExerciseChange(exoNum: number) {
    currentExerciseNumber = exoNum
  }
</script>

<div class={$darkMode.isActive ? "dark" : ""}>
  <div class="flex flex-col min-h-screen min-w-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus">
    <div class="h-32 w-full  bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-struct dark:text-coopmathsdark-struct">
      <div class="flex flex-row justify-start p-4 items-center">
        <!-- titre de la feuille -->
        <div class="text-4xl font-extrabold ml-4 mr-10">{$eleveVueSetUp.title}</div>
        <!-- barre de navigation -->
        {#if $eleveVueSetUp.presMode === "exos"}
          <div class="w-full flex flex-row justify-center space-x-0 border-b-2 border-coopmaths-struct">
            {#each $exercicesParams as paramsExercice, i (paramsExercice)}
              <div class="">
                <button
                  class="{currentExerciseNumber === i
                    ? 'border-b-4'
                    : 'border-b-0'} border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                  disabled={currentExerciseNumber === i}
                  on:click={() => handleExerciseChange(i)}
                >
                  <div class="py-2 px-6 text-xl font-bold">
                    Exercice {i + 1}
                  </div>
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    <div class="px-8">
      {#each $exercicesParams as paramsExercice, i (paramsExercice)}
        {#if $eleveVueSetUp.presMode === "exos"}
          <div class={currentExerciseNumber === i ? "" : "hidden"}>
            <Exercice {paramsExercice} indiceExercice={currentExerciseNumber} indiceLastExercice={$exercicesParams.length} />
          </div>
        {:else if $eleveVueSetUp.presMode === "page"}
          <Exercice {paramsExercice} indiceExercice={currentExerciseNumber} indiceLastExercice={$exercicesParams.length} />
        {/if}
      {/each}
    </div>
  </div>
</div>
