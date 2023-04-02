<script lang="ts">
  import TopicRight from "./display/TopicRight.svelte"
  import TopicLeft from "./display/TopicLeft.svelte"
  import NavBarHome from "./header/NavBarHome.svelte"
  import { darkMode } from "./store"
</script>

<div class="scrollbar-hide {$darkMode.isActive ? 'dark' : ''} bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
  <NavBarHome />
  <div class="h-[90vh] flex flex-col justify-center items-center bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <div class="w-full text-[15vw] text-center font-extrabold font-logo13 text-coopmaths-struct dark:text-coopmathsdark-struct">Coopmaths</div>
    <div class="w-2/3 text-3xl text-center font-light text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut lacus ex.</div>
  </div>
  <div class="flex flex-col space-y-10 pt-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <TopicRight pathToSVG="assets/svg/coopmaths_coop.svg" infoLink="https://coopmaths.fr/a_propos/">
      <span slot="header">Coopération</span>
    </TopicRight>
    <TopicLeft pathToSVG="assets/svg/coopmaths_export.svg">
      <span slot="header">Plein de possibilités</span>
    </TopicLeft>
    <TopicRight pathToSVG="assets/svg/mathalea.svg">
      <span slot="header">Aléatoire</span>
    </TopicRight>
  </div>
</div>
