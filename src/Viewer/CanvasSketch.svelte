<script>
    import canvasSketch from 'canvas-sketch';
    import { onMount } from 'svelte';

    export let sketch;
    let canvas, loadedSketch, canvasSketchManager;
    
    onMount(async () => {
        // On the first load of the page, specifically on mobile Safari (iOS), the canvas
        // can be sized incorrectly – not filling the full screen vertically. The root of
        // this is in canvas-sketch/lib/core/resizeCanvas.js#L24, wherein the function
        // getBoundingClientRect() can seemingly return incorrectly at the first instant
        // of a page load. I worked around a similar issue in ParamInput.svelte, when the
        // clientWidth element binding wasn't working under the same circumstances.

        // There's probably a more elegant solution here, but it seems like setTimeout
        // has come to the rescue yet again. What a world.
        setTimeout(loadCurrentSketch, 0);
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
        const opt = {
            ...sketch.settings,
            canvas,
            parent: canvas.parentElement
        };
        canvasSketchManager = await canvasSketch(sketch.sketchFn, opt);
        loadedSketch = sketch;
    }
</script>

{#key sketch.type}
    <canvas bind:this={canvas} />
{/key}

<style>
    canvas {
        display: block;
        margin: 0;
        z-index: -1;
    }
</style>
