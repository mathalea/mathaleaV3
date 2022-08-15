<script lang="ts">
  import ItemListe from "./ItemListe.svelte"
  export let liste: string[]
  export let liste2 = []
  export let spacing: number
  export let indiceExercice: number
  export let type: 'enonce' | 'correction'

  // Le type permet de créer des identifiants différents qui sont notamment utilisés dans 
  // les exercices avec liste déroumante pour ajouter un div de feedback
</script>

<ul class="list-decimal list-inside mt-2 mx-2 lg:mx-6 marker:text-coopmaths marker:font-bold">
  {#each liste as item, i}
    <li style="margin-bottom: {spacing}em; margin-top: {spacing}em" id="{(type === 'enonce') ? `exercice${indiceExercice}Q${i}` : `correction${indiceExercice}Q${i}`}"><ItemListe textItem={item.replace(/\\dotfill/g, '..............................').replace(/\\not=/g, '≠').replace(/\\ldots/g, '....')} /></li>
    {#if liste2[i]}
    <div class="bg-gray-100" style="margin-bottom: {spacing}em; margin-top: {spacing}em" id="{(type === 'enonce') ? `exercice${indiceExercice}Q${i}` : `correction${indiceExercice}Q${i}`}"><ItemListe textItem={liste2[i].replace(/\\dotfill/g, '..............................').replace(/\\not=/g, '≠').replace(/\\ldots/g, '....')} /></div>
    {/if}
  {/each}
</ul>

<style></style>
