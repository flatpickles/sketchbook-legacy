<script>
    import SketchViewer from './Viewer/SketchViewer.svelte';
    import SketchList from './Viewer/SketchList.svelte';
    import ParamList from './Viewer/ParamList.svelte';
    import sketches from './SketchIndex.js';

    let viewerComponent;

    let currentSketch = sketches[0];
    function sketchSelection(event) {
        const selectedSketch = event.detail.sketch;
        if (selectedSketch != currentSketch) currentSketch = selectedSketch;
    }

    function update() {
        viewerComponent.update();
    }
</script>

<main>
    <SketchViewer sketch={currentSketch} bind:this={viewerComponent}>
        <span slot="left">
            <SketchList
                sketches={sketches}
                selected={currentSketch}
                on:selection={sketchSelection}
            />
        </span>
        <span slot="right">
            <ParamList sketch={currentSketch} on:update={update}></ParamList>
        </span>
    </SketchViewer>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overscroll-behavior: none;
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
