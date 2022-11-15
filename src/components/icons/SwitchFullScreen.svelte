<script>
import { globalOptions } from "../store";

let isFullScreen = $globalOptions.v === "l";

function switchFullScreen() {
    isFullScreen = !isFullScreen;
    if (isFullScreen) {
        globalOptions.update((params) => {
            params.v = "l";
            return params;
        });
    } else {
        globalOptions.update((params) => {
            delete params.v;
            return params;
        });
    }
}
</script>

<div class="inline-block">
    <button type="button" on:click={switchFullScreen}><i class="bx ml-2 {isFullScreen ? 'bx-exit-fullscreen': 'bx-fullscreen'}"/></button>
</div>
