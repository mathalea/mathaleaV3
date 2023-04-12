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
  <i class="bx bx-{size}  p-1 bx-zoom-out hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
</button>
<button type="button" on:click={zoomPlus} class="tooltip tooltip-left tooltip-neutral" data-tip="Augmenter la taille du texte">
  <i class="bx bx-{size} p-1 bx-zoom-in hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
</button>
