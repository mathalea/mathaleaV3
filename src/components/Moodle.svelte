<script lang="ts">
  import { exercicesParams, darkMode } from "./store"
  import Footer from "./Footer.svelte"
  import NavBarV2 from "./header/NavBarV2.svelte"
  import { MathaleaGetExercicesFromParams, MathaleaUpdateExercicesParamsFromUrl } from "../lib/Mathalea.js"
  import type TypeExercice from "./utils/typeExercice"


  const copyCode = async () => {
    try {
      const text = document.querySelector("pre").innerText
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Accès au presse-papier impossible: ", err)
    }
  }

    function downloadCode() {
    const text = document.querySelector('pre').innerText
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', 'mathalea-gift.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  let content = ''
  let exercices: TypeExercice[]

  async function initExercices() {
    MathaleaUpdateExercicesParamsFromUrl()
    exercices = await MathaleaGetExercicesFromParams($exercicesParams)
    let i = 0
    for (const param of $exercicesParams) {
      let paramUrl = ''
      for (const key of Object.keys(param)) {
        paramUrl += `${key}\\=${param[key]}&`
      }
      paramUrl = paramUrl.slice(0, -1)
      content += `:: ${param.id} - ${exercices[i].titre} ::\n`
      content += '<script src\\="https\\:\/\/coopmaths.fr\/alea\/assets\/externalJs\/moodle.js" type\\="module"><\/script>\n'
      content += `<mathalea-moodle url\\="${paramUrl}" />\n`
      content += '{\n'
      content += '=%100%100|*=%90%90|*=%80%80|*=%75%75|*=%66.66667%66.666|*=%60%60|*=%50%50|*=%40%40|*=%33.33333%33.333|*=%30%30|*=%25%25|*=%20%20|*=%16.66667%16.666|*=%14.28571%14.2857|*=%12.5%12.5|*=%11.11111%11.111|*=%10%10|*=%5%5|*=%0%0|*\n'
      content += '####<script src\\="https\\:\/\/coopmaths.fr\/alea\/assets\/externalJs\/moodle.js" type\\="module"><\/script>\n'
      content += `<mathalea-moodle url\\="${paramUrl}" correction />\n`
      content += '}\n\n'
      i++  
    }
  }

  initExercices()

</script>

<main class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {$darkMode.isActive ? 'dark' : ''}">
  <NavBarV2 subtitle="Moodle" />

  <section class="px-4 py-0 md:py-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
 
    <h1 class="mt-12 mb-4 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-2xl md:text-4xl font-bold">Comment l'utiliser ?</h1>

    <p class="text-coopmaths-corpus dark:text-coopmathsdark-corpus text-lg md:text-xl">
      MathALÉA vous permet de créer un fichier au format gift que vous pourrez ensuite importer dans la banque de questions de votre plateforme Moodle. 
      Vous trouverez de plus amples informations dans notre <a href="https://github.com/mathalea/mathalea/wiki/Utilisation-de-Mathalea-avec-Moodle" target="_blank" rel="noopener noreferrer" class="text-coopmaths-action dark:text-coopmathsdark-action">documentation</a>.
    </p>
    <h1 class="mt-12 mb-4 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-2xl md:text-4xl font-bold">Exportation</h1>

    <button
        type="submit"
        on:click={downloadCode}
        class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
      >
      <i class='bx bx-download mr-2'></i>Télécharger le fichier gift
      </button>
    <!-- <button
        on:click={copyCode}
        class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
      >
      Copier le code
      </button> -->

   
    <h1 class="mt-12 md:mt-8 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-2xl md:text-4xl font-bold">Code</h1>
    <pre class="my-10 shadow-md bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus dark:text-coopmathsdark-corpus p-4 w-full overflow-auto">{content}
  </pre>
  </section>
  <footer>
    <Footer />
  </footer>
</main>

<style>
  footer {
    margin-top: auto;
  }
</style>
