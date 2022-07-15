<script>
    import SketchViewer from './SketchViewer.svelte';
    import { SketchDemo1, SketchDemo2 } from './Sketch.js';
    import { onMount } from 'svelte';

    let viewerComponent = undefined;

    const sketches = [
        new SketchDemo1(),
        new SketchDemo2(),
    ];
    let currentSketch = sketches[0];

    onMount(async () => {
        sketchSelected(currentSketch);
    });

    function sketchSelected(sketch) {
        viewerComponent.loadSketch(sketch);
        currentSketch = sketch;
    }
</script>

<SketchViewer bind:this={viewerComponent}>
    <ul>
        {#each sketches as sketch}
            <li>
                <span
                    class='sketch_item'
                    class:sketch_unselected={sketch != currentSketch}
                    class:sketch_selected={sketch == currentSketch}
                    on:click={sketchSelected.bind(this, sketch)}>
                        {sketch.name}
                </span>
            </li>
        {/each}
    </ul>
</SketchViewer>

<style>
    .sketch_item {
        cursor: pointer;
    }
    .sketch_selected {
        font-weight: bold;
    }
    .sketch_unselected {
        font-style: italic;
    }
</style>