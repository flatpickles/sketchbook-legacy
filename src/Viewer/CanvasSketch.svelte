<script>
    import canvasSketch from 'canvas-sketch';
    import { onMount, onDestroy } from 'svelte';
    import { printDimensions } from './stores';

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

    // Update print dimensions when the canvas is resized
    const dimensionsUnsubscribe = printDimensions.subscribe(loadCurrentSketch);
    onDestroy(() => dimensionsUnsubscribe());

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
            loadedSketch = null;
        }
    }

    async function loadCurrentSketch() {
        if (!canvas) return;
        if (canvasSketchManager) canvasSketchManager.unload();
        const opt = {
            ... sketch.settings,
            canvas,
            parent: canvas.parentElement
        };
        const printOpt = { // todo: maybe make units & PPI configurable and/or config constants
            ... opt,
            pixelsPerInch: 300,
            units: 'in',
            dimensions: [$printDimensions.width, $printDimensions.height]
        };
        canvasSketchManager = await canvasSketch(sketch.sketchFn, sketch.displayAsPrint ? printOpt : opt);
        loadedSketch = sketch;
    }
</script>

<div class='canvas-container'>
    {#key sketch.type}
        <canvas bind:this={canvas} class:canvas-loaded={!!loadedSketch} />
    {/key}
</div>

<style>
    canvas {
        display: block;
        margin: 0;
    }

    .canvas-loaded {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        background-color: white;
    }
    
    .canvas-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #C0C0C0;
        z-index: -1;
    }
</style>
