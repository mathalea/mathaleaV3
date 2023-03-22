<script lang="ts">
  import Start from "./Start.svelte"
  import Diaporama from "./Diaporama.svelte"
  import Can from "./Can.svelte"
  import Eleve from "./Eleve.svelte"
  import ConfigEleve from "./ConfigEleve.svelte"
  import Latex from "./Latex.svelte"
  import { globalOptions } from "./store"
  import { context } from "../modules/context"
  import { ElementButtonInstrumenpoche, ElementInstrumenpoche } from "../modules/ElementInstrumenpoche"
  import Amc from "./Amc.svelte"

  context.versionMathalea = 3
  // ToFix fonction à lier avec bugsnag
  // @ts-ignore
  window.notify = (arg: string) => console.log(arg)

  if (customElements.get("alea-instrumenpoche") === undefined) {
    customElements.define("alea-instrumenpoche", ElementInstrumenpoche)
    customElements.define("alea-buttoninstrumenpoche", ElementButtonInstrumenpoche)
  }

  $: {
    if ($globalOptions.v === "diaporama") {
      context.isDiaporama = true
    } else {
      context.isDiaporama = false
    }
    if ($globalOptions.v === "latex") {
      context.isHtml = false
    } else {
      context.isHtml = true
    }
    if ($globalOptions.v === "confeleve") {
      context.isHtml = false
    } else {
      context.isHtml = true
    }
    if ($globalOptions.v === "amc") {
      context.isAmc = true
      context.isHtml = false
    }
  }
</script>

<div class="subpixel-antialiased ">
  {#if $globalOptions.v === "diaporama"}
    <Diaporama />
  {:else if $globalOptions.v === "can"}
    <Can />
  {:else if $globalOptions.v === "eleve"}
    <Eleve />
  {:else if $globalOptions.v === "latex"}
    <Latex />
  {:else if $globalOptions.v === "confeleve"}
    <ConfigEleve />
  {:else if $globalOptions.v === "amc"}
    <Amc />
  {:else}
    <Start />
  {/if}
</div>
