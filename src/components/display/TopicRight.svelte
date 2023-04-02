<script lang="ts">
  export let pathToSVG: string = ""
  export let altText: string = "Illustraiton"
  export let infoLink: string = ""
</script>

<div class="flex flex-col md:flex-row px-10 py-4">
  <div class="w-1/3 p-6 hidden md:flex justify-center">
    <img alt={altText} src={pathToSVG} class="w-5/6 md:w-11/12" />
  </div>
  <div class="w-full md:w-2/3 p-6 flex flex-col">
    <div class="text-4xl xl:text-6xl pt-4 font-extrabold text-coopmaths-struct dark:text-coopmathsdark-struct text-center md:text-right pb-8 md:pb-10 xl:pb-20">
      <slot name="header">
        <span>Mon titre</span>
      </slot>
    </div>
    <div class="flex text-justify  pb-4 md:pb-6 xl:pb-8">
      <div class="text-2xl font-light  text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light">
        <slot name="content">
          <span
            >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut lacus ex. Sed commodo lacinia facilisis. Fusce sollicitudin justo ac libero sagittis convallis. Pellentesque metus magna,
            iaculis ut enim id.</span
          >
        </slot>
      </div>
    </div>
    <div class="flex flex-row justify-end md:justify-start items-center w-full">
      <a
        class="flex flex-row items-center text-coopmaths-action  hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest text-xl font-semibold"
        href={infoLink}
      >
        <span class="mr-1">En savoir plus</span>
        <i class="bx bx-chevron-right" />
      </a>
    </div>
  </div>
  <div class="w-full md:hidden p-6 flex justify-center">
    <img alt={altText} src={pathToSVG} class="w-5/6 md:w-11/12" />
  </div>
</div>
