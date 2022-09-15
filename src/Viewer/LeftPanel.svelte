<script>
	import { createEventDispatcher, onMount } from 'svelte';
    import Expandable from './Components/Expandable.svelte';
    import Button from './Components/Button.svelte';

    export let sketches;
    export let selected;

    // Communicate selection event to parent
	const dispatch = createEventDispatcher();
    function selectSketch(sketch) {
        dispatch('selection', {
            sketch: sketch
        });
    }

    // Settings panel!
    let storedSettingsPanelState = localStorage.getItem('settingsPanelOpen');
    let settingsPanelOpen = storedSettingsPanelState ? (storedSettingsPanelState === 'true') : false;

    // WIP sketches!
    let storedWorksInProgressState = localStorage.getItem('showWorksInProgress');
    let showWorksInProgress = storedWorksInProgressState ? (storedWorksInProgressState === 'true') : false;
    $: worksInProgressButtonText = (showWorksInProgress ? 'Hide ' : 'Show') + ' Works in Progress';

    function toggleSettingsPanel() {
        settingsPanelOpen = !settingsPanelOpen;
        localStorage.setItem('settingsPanelOpen', settingsPanelOpen ? 'true' : 'false');
    }

    function toggleWIP() {
        // Toggle the state
        showWorksInProgress = !showWorksInProgress;
        localStorage.setItem('showWorksInProgress', showWorksInProgress ? 'true' : 'false');

        // Select a different non-WIP sketch if currently selected is WIP
        if (!selected.date) {
            for (let sketchIdx = 0; sketchIdx < sketches.length; sketchIdx++) {
                const sketch = sketches[sketchIdx];
                if (sketch.date) {
                    selectSketch(sketch);
                    break;
                }
            }
        };
    }

    function resetState() {
        location.hash = '';
        localStorage.clear();
        location.reload();
    }
</script>

<div id='panel_container'>
    <div id='title'>
        Sketchbook
    </div>

    <div id='subtitle'>
        <div id='subtitle_text'>
            by <a href='http://flatpickles.com'>flatpickles</a>
        </div>
        <div id='subtitle_button' on:click={toggleSettingsPanel}>
            {#if settingsPanelOpen}
                &#9733;
            {:else}
                &#9734;
            {/if}
        </div>
    </div>

    <Expandable open={settingsPanelOpen}>
        <div id='settings_container'>
            <p>
                Sketchbook is a collection of programmatic art pieces. It is a work in progress.
                Code and details <a href='https://github.com/flatpickles/sketchbook'>here</a>.
            </p>
            <div id='buttons'>
                <Button name={worksInProgressButtonText} on:click={toggleWIP}></Button>
                <Button name='Reset Sketchbook' on:click={resetState}></Button>
            </div>
            <!-- todo: copyright here? -->
        </div>
    </Expandable>
    
    <div id='list_container'>
        {#each sketches as sketch}
            {#if sketch.date || showWorksInProgress || sketch == selected}
                <div
                    class='sketch_item'
                    class:sketch_selected={sketch == selected}
                    on:click={selectSketch.bind(this, sketch)}>
                        {sketch.name}
                        {#if !sketch.date}[WIP]{/if}
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    #panel_container {
        display: flex;
        flex-direction: column;
        overflow: auto;
        max-height: 100vh;
    }

    /* Header */

    #title {
        font-size: var(--title-font-size);
        padding: var(--spacing);
        padding-bottom: 0;
    }

    #subtitle {
        display: flex;
    }

    #subtitle_text {
        flex-grow: 1;
        font-size: var(--subtitle-font-size);
        padding: var(--spacing);
        padding-top: var(--subtitle-top-spacing);
    }

    #subtitle_button {
        padding-right: var(--spacing);
        cursor: pointer;
        user-select: none;
    }

    /* Settings panel */

    #settings_container {
        font-size: var(--description-font-size);
        padding: var(--spacing);
        padding-top: 0;
        display: flex;
        flex-direction: column;
    }

    p {
        margin: 0;
    }

    :global(#buttons > *) {
        margin-top: calc(var(--spacing) / 4);
        width: 100%;
    }

    :global(#buttons > :first-child) {
        margin-top: var(--spacing);
    }

    /* Sketch list */

    #list_container {
        display: flex;
        flex-direction: column;
    }

    .sketch_item {
        font-size: var(--sketch-list-font-size);
        cursor: pointer;
        flex-grow: 1;
        border-bottom: var(--border);
        padding: var(--spacing);
    }

    .sketch_item:first-of-type {
        border-top: var(--border);
    }

    .sketch_selected {
        color: var(--selected-text-color);
        background-color:  var(--selected-bg-color);
    }
</style>
