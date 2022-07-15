<script>
    import SketchViewer from './SketchViewer.svelte';
    import { SketchDemo1, SketchDemo2 } from './Sketch.js';

    const sketches = [
        new SketchDemo1(),
        new SketchDemo2(),
    ];
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
                <!-- {JSON.stringify(sketch.params)} -->
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