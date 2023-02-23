<script lang="ts">
  export let title = 'Titre'
  export let valueSelected
  export let labelsValues = []

  let name = title !== undefined ? title.replaceAll(' ', '') : ''
</script>

<!-- 
  @component
  Formulaire avec bouton radio
  
  Usage:
    ```tsx
  <FormRadio title="Mon titre" bind:valueSelected={maVariable} labelsValues={[
          { label: 'Titre du label 1', value: '1' },
          { label: 'Titre du label 2', value: '2' }
        ]} />
  ```
 -->

<div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">{title}</div>
<div class="flex flex-col justify-start items-start">
  {#each labelsValues as labelValue, i}
    <div class="form-check flex flex-row ml-4 items-center">
      <input
        class="form-check-input rounded-full h-4 w-4 border border-coopmaths-action bg-coopmaths-canvas dark:border-coopmathsdark-action dark:bg-coopmathsdark-canvas-dark text-coopmaths-action checked:bg-coopmaths-action checked:border-coopmaths-action active:border-coopmaths-action focus:border-coopmaths-action dark:text-coopmathsdark-action dark:checked:bg-coopmathsdark-action dark:checked:border-coopmathsdark-action dark:active:border-coopmathsdark-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 focus:border-1 transition duration-200 mt-1 mr-2 cursor-pointer"
        type="radio"
        {name}
        id={name + i.toString()}
        bind:group={valueSelected}
        value={labelValue.value}
      />
      <label
        class="form-check-label inline-block text-coopmaths-corpus dark:text-coopmathsdark-corpus text-sm text-opacity-70 font-light"
        for="presentationModeRadio1"
      >
        {labelValue.label}
      </label>
    </div>
  {/each}
</div>
