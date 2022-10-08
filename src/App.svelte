<script>
    import Viewer from './Viewer/Viewer.svelte';
    import LeftPanel from './Viewer/LeftPanel.svelte';
    import RightPanel from './Viewer/RightPanel.svelte';
    import sketches from './SketchIndex.js';

    let viewerComponent;
    let currentSketch;

    // Select sketch on page load, and on hash change (fwd/back nav etc)
    let initialDirectLink = false;
    loadInitialSketch();
    window.onhashchange = loadInitialSketch;

    // Restore state for all loaded sketches
    sketches.forEach((sketch) => {
        sketch.restoreParamValues();
        sketch.restorePresets();
    });

    // Select directly linked sketch OR last viewed sketch
    function loadInitialSketch() {
        const normalizeString = (input) => {
            let output = input.toLowerCase();
            output = output.replace(/\s+/g, '');
            output = output.replace(/-+/g, '');
            output = output.replace(/_+/g, '');
            return output;
        };
        const normalizedLinkName = window.location.hash
            ? normalizeString(window.location.hash.substring(1))
            : undefined;
        if (normalizedLinkName) initialDirectLink = true;
        const storedName = localStorage.getItem('currentSketchName');
        const normalizedStoredName = storedName
            ? normalizeString(storedName)
            : undefined;
        let linkedIndex, storedIndex, firstNonWIPIndex;
        sketches.forEach((sketch, currentIndex) => {
            const normalizedSketchName = normalizeString(sketch.name);
            if (normalizedSketchName === normalizedLinkName) linkedIndex = currentIndex;
            if (normalizedSketchName === normalizedStoredName) storedIndex = currentIndex;
            if (sketch.date && firstNonWIPIndex == undefined) firstNonWIPIndex = currentIndex;
        });
        const sketchToLoadIndex = linkedIndex ?? storedIndex ?? firstNonWIPIndex;
        selectSketch(sketches[sketchToLoadIndex]);
    }

    // Select sketch and update local state, navigation, etc.
    function selectSketch(selectedSketch) {
        if (selectedSketch != currentSketch) {
            currentSketch = selectedSketch;
            localStorage.setItem('currentSketchName', currentSketch.name);
            document.title = currentSketch.name;
            const hashName = '#' + currentSketch.name.toLowerCase().replace(/\s+/g, '-');
            location.hash = hashName;
        }
    }

    function sketchSelection(event) {
        const selectedSketch = event.detail.sketch;
        selectSketch(selectedSketch);
    }

    function update(event) {
        if (!event.detail || !event.detail.incomplete) {
            currentSketch.storeParamValues();
        }
        viewerComponent.update();
    }
</script>

<main>
    <Viewer sketch={currentSketch} directLink={initialDirectLink} bind:this={viewerComponent}>
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
    </Viewer>
</main>

<style>
    :global(:root) {
        /* General */
        --spacing: 8px;
        --border: 1px solid rgb(0, 0, 0, 90%);
        --panel-background: rgb(255, 255, 255, 80%);
        --panel-filter: blur(8px);

        /* Sidebars */
        --title-font-size: 24px;
        --subtitle-font-size: 14px;
        --title-top-spacing: 6px;
        --subtitle-top-spacing: 2px;
        --description-font-size: 14px;
        --param-font-size: 12px;

        /* Collapse tabs */
        --collapse-tab-text-color: rgb(0, 0, 0);
        --collapse-tab-font-size: 16px;
        --collapse-tab-padding: 4px;
        --collapse-tab-bg-color: rgb(255, 255, 255, 50%);
        --collapse-tab-filter: blur(4px);

        /* Sketch list */
        --sketch-list-font-size: 16px;
        --selected-text-color: rgb(0, 0, 0);
        --selected-bg-color: rgb(0, 0, 0, 10%);
    }

    :global(html) {
        height: -webkit-fill-available;
        min-height: 100%;
        margin: 0;
    }

    :global(body) {
        background-color: #000;
        margin: 0;
        padding: 0;
        overscroll-behavior: none;
        font-family: 'Lucida Console', monospace;
        font-size: 20px;
        position: absolute;
        width: 100%;
        height: 100%;
    }
    
    main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
</style>
