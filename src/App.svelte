<script>
    import SketchViewer from './Viewer/SketchViewer.svelte';
    import SketchList from './Viewer/SketchList.svelte';
    import sketches from './SketchIndex.js';

    let currentSketch = sketches[0];
    function sketchSelection(event) {
        const selectedSketch = event.detail.sketch;
        if (selectedSketch != currentSketch) currentSketch = selectedSketch;
    }
</script>

<main>
    <SketchViewer sketch={currentSketch}>
        <SketchList
            sketches={sketches}
            selected={currentSketch}
            on:selection={sketchSelection}
        />
    </SketchViewer>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
    
    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
</style>
