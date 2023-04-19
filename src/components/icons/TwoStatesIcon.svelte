<script lang="ts">
  export let isOnStateActive: boolean = false
  export let size: number = 5
</script>

<!-- 
  @component
  Icône avec deux états

   __Paramètres__ :

  * `isOnStateActive` : booléen pour basculer entre les deux icônes
  * `size`: nombre pour régler la taille de l'icône (`5` par défault)
  
  __Utilisation__ :

  ```tsx
  <InteractivityIcon isOnStateActive={<monBoolean>}>
    <i slot="icon_to_switch_on" class="bx bxs-phone" />
    <i slot="icon_to_switch_off" class="bx bxs-phone-off" />
  </InteractivityIcon>
  ```
 -->
<div class={isOnStateActive ? "hidden" : "block"}>
  <slot name="icon_to_switch_on">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 8.467 8.467"
      class="w-{size} h-{size} fill-coopmaths-action dark:fill-coopmathsdark-action stroke-coopmaths-action dark:stroke-coopmathsdark-action"
    >
      <defs>
        <marker id="a" markerHeight="2" markerWidth="2" orient="auto-start-reverse" preserveAspectRatio="xMidYMid" refX="0" refY="0" style="overflow:visible" viewBox="0 0 5.324 6.155">
          <path d="m5.77 0-8.65 5V-5Z" style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt" transform="scale(.5)" />
        </marker>
        <marker id="b" markerHeight="2" markerWidth="2" orient="auto-start-reverse" preserveAspectRatio="xMidYMid" refX="0" refY="0" style="overflow:visible" viewBox="0 0 5.324 6.155">
          <path d="m5.77 0-8.65 5V-5Z" style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt" transform="scale(.5)" />
        </marker>
      </defs>
      <g transform="matrix(.87062 0 0 .87062 .723 1.111)">
        <path
          d="M6.117 4.022a2.086 2.086 0 0 0-2.084 2.083c0 1.15.935 2.084 2.084 2.084A2.086 2.086 0 0 0 8.2 6.105a2.086 2.086 0 0 0-2.083-2.083zm0 3.75a1.669 1.669 0 0 1-1.52-2.35l.096.058c.082.052.164.104.268.143.103.04.226.065.391.065s.289-.026.392-.065c.103-.039.186-.09.268-.143.083-.052.165-.104.268-.143.103-.04.227-.065.392-.065s.289.026.392.065c.103.039.185.091.268.143.082.052.165.104.268.143.037.014.078.026.121.036.04.142.063.291.063.446 0 .92-.748 1.667-1.667 1.667z"
          style="stroke-width:.208363"
        />
        <circle cx="5.388" cy="6.209" r=".313" style="stroke-width:.208363" />
        <circle cx="6.846" cy="6.209" r=".313" style="stroke-width:.208363" />
      </g>
      <path
        d="M1.062.56h3.08a.474.474 0 0 1 .474.474v2.37a.474.474 0 0 1-.474.473h-3.08a.474.474 0 0 1-.474-.474v-2.37A.474.474 0 0 1 1.062.56Z"
        style="fill:none;stroke-width:.236966;stroke-linecap:round;stroke-linejoin:round"
      />
      <path
        d="M.773.536.536.752v.432h4.029V.752L4.327.536Zm1.948.141h1.421a.118.118 0 0 1 .12.12.118.118 0 0 1-.12.12H2.721a.118.118 0 0 1-.12-.12.118.118 0 0 1 .12-.12ZM1.019.68a.118.118 0 0 1 .009 0 .118.118 0 0 1 .118.118.118.118 0 0 1-.118.118.118.118 0 0 1-.119-.118.118.118 0 0 1 .11-.118Zm.313 0a.118.118 0 0 1 .009 0 .118.118 0 0 1 .118.118.118.118 0 0 1-.118.118.118.118 0 0 1-.119-.118.118.118 0 0 1 .11-.118Zm.313 0a.118.118 0 0 1 .01 0 .118.118 0 0 1 .118.118.118.118 0 0 1-.119.118.118.118 0 0 1-.118-.118.118.118 0 0 1 .11-.118z"
        style="stroke:none;stroke-width:.226291px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
      />
      <path d="M7.062 3.945V1.536h-1.21" style="fill:none;stroke-width:.747516;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;marker-end:url(#a)" /><path
        d="M1.589 4.668v2.41h1.208"
        style="fill:none;stroke-width:.747516;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;marker-end:url(#b)"
      />
    </svg>
  </slot>
</div>
<div class=" {isOnStateActive ? 'block' : 'hidden'}">
  <slot name="icon_to_switch_off">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 8.467 8.467"
      class=" w-{size} h-{size} fill-coopmaths-action dark:fill-coopmathsdark-action stroke-coopmaths-action dark:stroke-coopmathsdark-action"
    >
      <defs>
        <marker id="a" markerHeight="2" markerWidth="2" orient="auto-start-reverse" preserveAspectRatio="xMidYMid" refX="0" refY="0" style="overflow:visible" viewBox="0 0 5.324 6.155">
          <path d="m5.77 0-8.65 5V-5Z" style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt" transform="scale(.5)" />
        </marker>
        <marker id="b" markerHeight="2" markerWidth="2" orient="auto-start-reverse" preserveAspectRatio="xMidYMid" refX="0" refY="0" style="overflow:visible" viewBox="0 0 5.324 6.155">
          <path d="m5.77 0-8.65 5V-5Z" style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt" transform="scale(.5)" />
        </marker>
      </defs>
      <g transform="matrix(.87062 0 0 .87062 .723 1.111)">
        <path
          d="M6.117 4.022a2.086 2.086 0 0 0-2.084 2.083c0 1.15.935 2.084 2.084 2.084A2.086 2.086 0 0 0 8.2 6.105a2.086 2.086 0 0 0-2.083-2.083zm0 3.75a1.669 1.669 0 0 1-1.52-2.35l.096.058c.082.052.164.104.268.143.103.04.226.065.391.065s.289-.026.392-.065c.103-.039.186-.09.268-.143.083-.052.165-.104.268-.143.103-.04.227-.065.392-.065s.289.026.392.065c.103.039.185.091.268.143.082.052.165.104.268.143.037.014.078.026.121.036.04.142.063.291.063.446 0 .92-.748 1.667-1.667 1.667z"
          style="stroke-width:.208363"
        />
        <circle cx="5.388" cy="6.209" r=".313" style="stroke-width:.208363" />
        <circle cx="6.846" cy="6.209" r=".313" style="stroke-width:.208363" />
      </g>
      <path
        d="M1.062.56h3.08a.474.474 0 0 1 .474.474v2.37a.474.474 0 0 1-.474.473h-3.08a.474.474 0 0 1-.474-.474v-2.37A.474.474 0 0 1 1.062.56Z"
        style="fill:none;stroke-width:.236966;stroke-linecap:round;stroke-linejoin:round"
      />
      <path
        d="M.773.536.536.752v.432h4.029V.752L4.327.536Zm1.948.141h1.421a.118.118 0 0 1 .12.12.118.118 0 0 1-.12.12H2.721a.118.118 0 0 1-.12-.12.118.118 0 0 1 .12-.12ZM1.019.68a.118.118 0 0 1 .009 0 .118.118 0 0 1 .118.118.118.118 0 0 1-.118.118.118.118 0 0 1-.119-.118.118.118 0 0 1 .11-.118Zm.313 0a.118.118 0 0 1 .009 0 .118.118 0 0 1 .118.118.118.118 0 0 1-.118.118.118.118 0 0 1-.119-.118.118.118 0 0 1 .11-.118Zm.313 0a.118.118 0 0 1 .01 0 .118.118 0 0 1 .118.118.118.118 0 0 1-.119.118.118.118 0 0 1-.118-.118.118.118 0 0 1 .11-.118z"
        style="stroke:none;stroke-width:.226291px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
      />
      <path d="M7.062 3.945V1.536h-1.21" style="fill:none;stroke-width:.747516;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;marker-end:url(#a)" />
      <path d="M1.589 4.668v2.41h1.208" style="fill:none;stroke-width:.747516;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;marker-end:url(#b)" />
      <path d="m.53.53 7.407 7.407" style="fill:none;stroke-width:.79375;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" />
    </svg>
  </slot>
</div>
