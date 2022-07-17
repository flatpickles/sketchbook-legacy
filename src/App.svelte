<script>
    import SketchViewer from './Viewer/SketchViewer.svelte';
    import sketches from './SketchIndex.js';

    let currentSketch = sketches[0];
    function sketchSelected(sketch) {
        if (sketch != currentSketch) currentSketch = sketch;
    }
</script>

<SketchViewer sketch={currentSketch}>
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