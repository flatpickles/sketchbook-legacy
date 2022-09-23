<script>
    import canvasSketch from 'canvas-sketch';
    import { onMount } from 'svelte';

    export let sketch;
    let canvas, loadedSketch, canvasSketchManager;
    
    onMount(async () => {
        setTimeout(loadCurrentSketch, 500);
    });

    export function update() {
        canvasSketchManager.render();
    }

    $: sketchChanged(sketch);
    function sketchChanged(sketch) {
        if (canvas && sketch != loadedSketch) {
            if (sketch.type != loadedSketch.type) {
                // Canvas must be recreated for a new sketch when the context changes type
                // sketchChanged is called before the DOM updates, so use setTimeout to execute after
                setTimeout(loadCurrentSketch, 0);
            } else {
                loadCurrentSketch();
            }
        }
    }

    async function loadCurrentSketch() {
        if (canvasSketchManager) canvasSketchManager.unload();
        // sketch.settings.dimensions = [window.innerWidth, window.innerHeight];
        const opt = {
            ...sketch.settings,
            canvas,
            parent: canvas.parentElement,
            // dimensions: [window.innerWidth, window.innerHeight]
        };
        // console.log(opt);
        canvasSketchManager = await canvasSketch(sketch.sketchFn, opt);
        loadedSketch = sketch;
    }
</script>

{#key sketch.type}
    <canvas bind:this={canvas} />
{/key}

<style>
</style>
