<script>
    import canvasSketch from 'canvas-sketch';
    import { onMount } from 'svelte';

    export let sketch;
    let canvas, loadedSketch, canvasSketchManager;
    
    onMount(async () => {
        loadCurrentSketch();
    });

    $: sketchChanged(sketch);
    function sketchChanged(sketch) {
        if (canvas && sketch != loadedSketch) {
            loadCurrentSketch();
        } else if (canvasSketchManager) {
            canvasSketchManager.render();
        }
    }

    async function loadCurrentSketch() {
        console.log('Loading "' + sketch.name +'"');
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

<canvas bind:this={canvas} />

<style>
    canvas {
        margin: auto;
        display: block;
        box-shadow: 0px 2px 12px -2px rgba(0, 0, 0, 0.15);
    }
</style>
