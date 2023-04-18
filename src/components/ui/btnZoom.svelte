<script lang="ts">
  import { MathaleaUpdateUrlFromExercicesParams } from "../../lib/Mathalea"
  import { exercicesParams, globalOptions } from "../store"

  export let size: "xs" | "sm" | "md" | "lg" = "sm"

  const urlParams = new URLSearchParams(window.location.search)
  let zoom = parseInt(urlParams.get("z")) || 1
  function zoomMinus() {
    zoom -= 0.25
    updateSize()
  }

  function zoomPlus() {
    zoom += 0.25
    updateSize()
  }

  function updateSize() {
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
    MathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }
</script>

<button type="button" on:click={zoomMinus} class="tooltip tooltip-left tooltip-neutral" data-tip="Réduire la taille du texte">
  <i
    class="bx {size} rounded-full p-1 bx-minus border-2 border-coopmaths-canvas hover:bg-coopmaths-action-lightest bg-coopmaths-action dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest text-coopmaths-canvas"
  />
</button>
<button type="button" on:click={zoomPlus} class="tooltip tooltip-left tooltip-neutral" data-tip="Augmenter la taille du texte">
  <i
    class="bx {size} rounded-full p-1 bx-plus border-2 border-coopmaths-canvas hover:bg-coopmaths-action-lightest bg-coopmaths-action dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest text-coopmaths-canvas"
  />
</button>
