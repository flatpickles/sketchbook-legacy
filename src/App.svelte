<script>
    import SketchViewer from './Viewer/SketchViewer.svelte';
    import SketchList from './Viewer/SketchList.svelte';
    import ParamList from './Viewer/ParamList.svelte';
    import sketches from './SketchIndex.js';

    let viewerComponent;

    // Restore currently selected sketch - find index by name (allows reordering)
    // todo: check URL string to see if we're navigating to a specific sketch, if so use that instead
    let storedCurrentSketchName = localStorage.getItem('currentSketchName');
    let storedCurrentSketchIndex = sketches.reduce((foundIdx, sketch, currIdx) => {
        // foundIdx is null while we're still searching
        if (foundIdx == null) return (sketch.name === storedCurrentSketchName) ? currIdx : null;
        else return foundIdx;
    }, null) ?? 0;
    let currentSketch = sketches[storedCurrentSketchIndex];
    document.title = currentSketch.name;

    // Restore parameter values for all loaded sketches
    sketches.forEach((sketch) => {
        sketch.restoreParamValues();
    });

    function sketchSelection(event) {
        const selectedSketch = event.detail.sketch;
        if (selectedSketch != currentSketch) {
            currentSketch = selectedSketch;
            localStorage.setItem('currentSketchName', currentSketch.name);
            document.title = currentSketch.name;
        }
    }

    function update(event) {
        if (event.detail.domEvent.type === 'change') {
            currentSketch.storeParamValues();
        };
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
    @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap');

    :global(body) {
        margin: 0;
        padding: 0;
        overscroll-behavior: none;
        font-family: 'Inconsolata', monospace;
        font-size: 20px;
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
