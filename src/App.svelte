<script>
    import SketchViewer from './Viewer/SketchViewer.svelte';
    import LeftPanel from './Viewer/LeftPanel.svelte';
    import RightPanel from './Viewer/RightPanel.svelte';
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
            <LeftPanel
                sketches={sketches}
                selected={currentSketch}
                on:selection={sketchSelection}
            />
        </span>
        <span slot="right">
            <RightPanel
                sketch={currentSketch}
                on:update={update}
            />
        </span>
    </SketchViewer>
</main>

<style>
    :global(:root) {
        /* General */
        --spacing: 8px;
        --border: 1px solid rgb(0, 0, 0, 90%);
        --panel-background: rgb(255, 255, 255, 70%);
        --panel-filter: blur(5px);

        /* Sidebars */
        --title-font-size: 24px;
        --subtitle-font-size: 14px;
        --collapse-tab-text-color: rgb(0, 0, 0);
        --collapse-tab-font-size: 16px;
        --collapse-tab-padding: 4px;
        --collapse-tab-bg-color: rgb(255, 255, 255, 50%);

        /* Sketch list */
        --sketch-list-font-size: 16px;
        --selected-text-color: rgb(0, 0, 0);
        --selected-bg-color: rgb(0, 0, 0, 10%);
    }

    :global(body) {
        margin: 0;
        padding: 0;
        overscroll-behavior: none;
        font-family: monospace;
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
