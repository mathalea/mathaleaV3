<script lang="ts">
  import {afterUpdate, createEventDispatcher} from "svelte"
  import type TypeExercice from "../utils/typeExercice"
  
  export let exercice: TypeExercice
  let nbQuestions: number
  let amcType: string
  let digits: number
  let decimals: number
  let sup: boolean
  let sup2: boolean
  let sup3: boolean
  let sup4: boolean
  let alea: string
  let premierUpdate: boolean = true
  
  
  afterUpdate(async () => {
    // On ne remplit les champs que la première fois
    if (exercice && premierUpdate) {
      premierUpdate = false
      nbQuestions = exercice.nbQuestions
      alea = exercice.seed
      digits = exercice.autoCorrection[0].reponse.param.digits
      decimals = exercice.autoCorrection[0].reponse.param.decimals
      amcType = exercice.amcType
    }
  })
  
  const dispatch = createEventDispatcher()
  
  function newSettings() {
    dispatch("settings", {
      nbQuestions,
      alea,
      digits,
      decimals
    })
    for (let i = 0; i < exercice.autoCorrection.length; i++) {
      exercice.autoCorrection[i].reponse.param.digits = digits
      exercice.autoCorrection[i].reponse.param.decimals = decimals
    }
    exercice = exercice
  }

</script>

<div class="text-xl lg:text-base ml-2 lg:ml-4 space-y-4 p-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark">
  <h3 class="text-coopmaths-struct dark:text-coopmathsdark-struct font-bold">Paramètres</h3>
  {#if exercice.nbQuestionsModifiable}
    <div>
      <span class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light">Nombre de questions :</span>
      <input
        type="number"
        min="1"
        bind:value={nbQuestions}
        on:change={newSettings}
        class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
      />
    </div>
  {/if}
  {#if exercice.amcType}
    <div>
      <span class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light">Type AMC :</span>
      <input
        bind:value={amcType}
        class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
        on:change={newSettings}
        type="text"
      />
    </div>
  {/if}
  {#if exercice.amcType === 'AMCNum'}
    <div>
      <span class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light">Nombre de chiffres en tout :</span>
      <input
        bind:value={digits}
        class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
        on:change={newSettings}
        type="number"
      />
    </div>
    <div>
      <span class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light">Nombre de décimales :</span>
      <input
        bind:value={decimals}
        class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
        on:change={newSettings}
        type="number"
      />
    </div>
  {/if}
  
  <form id="formAlea" name="formAlea" on:submit|preventDefault={newSettings}>
    <label class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light" for="formAlea">Série :</label>
    <input
      bind:value={alea}
      class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
      name="formAlea"
      type="text"
    />
  </form>
</div>
