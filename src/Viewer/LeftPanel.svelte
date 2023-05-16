<script>
	import { createEventDispatcher } from 'svelte';
    import Button from './Components/Button.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import PrintSize from './Components/PrintSize.svelte';

    export let sketches;
    export let selected;

    // Communicate selection event to parent
	const dispatch = createEventDispatcher();
    function selectSketch(sketch) {
        dispatch('selection', {
            sketch: sketch
        });
    }

    // Experimental mode
    let storedExperimentalState = localStorage.getItem('showExperimental');
    let showExperimental = storedExperimentalState ? (storedExperimentalState === 'true') : false;
    $: worksInProgressButtonText = showExperimental ? '~ Hide Experiments ~' : 'Experimental Mode';
    $: showExperimentalButton = sketches.reduce((incrementalState, currentSketch) => {
        return currentSketch.experimental || incrementalState;
    }, false);

    function toggleExperimentalMode() {
        // Toggle the state
        showExperimental = !showExperimental;
        localStorage.setItem('showExperimental', showExperimental ? 'true' : 'false');

        // Select a different non-experimental sketch if currently selected is experimental
        if (!showExperimental && selected.experimental) {
            for (let sketchIdx = 0; sketchIdx < sketches.length; sketchIdx++) {
                const sketch = sketches[sketchIdx];
                if (!sketch.experimental) {
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
    <PanelHeader id='Sketchbook' openDefault={false}>
        <span slot='title'>
            Sketchbook
        </span>
        <span slot='subtitle'>
            by <a href='http://flatpickles.com'>flatpickles</a>
        </span>
        <span slot='contents'>
            <p>
                Sketchbook is a collection of programmatic art pieces. It is a work in progress.
                Code and details <a href='https://github.com/flatpickles/sketchbook'>here</a>.
            </p>
            {#if showExperimental}
                <p>
                    You've enabled experimental mode! Experimental sketches are generally incomplete or unimpressive, but might be interesting nonetheless.
                </p>
                <PrintSize />
            {/if}
            <div id='buttons'>
                {#if showExperimentalButton}
                    <Button name={worksInProgressButtonText} on:click={toggleExperimentalMode}></Button>
                {/if}
                <Button name='Reset Sketchbook' on:click={resetState}></Button>
            </div>
        </span>
    </PanelHeader>
    
    <div id='list_container'>
        {#each sketches as sketch}
            {#if !sketch.experimental || showExperimental || sketch == selected}
                <div
                    class='sketch_item'
                    class:sketch_selected={sketch == selected}
                    on:click={selectSketch.bind(this, sketch)}
                    on:keypress={selectSketch.bind(this, sketch)}>
                        {#if sketch.experimental}~{/if}
                        {sketch.name}
                        {#if sketch.experimental}~{/if}
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

    /* Settings panel */

    p {
        margin: 0;
        margin-bottom: var(--spacing);
    }

    :global(#buttons > *) {
        margin-top: calc(var(--spacing) / 4);
        width: 100%;
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
        user-select: none;
    }

    .sketch_item:first-of-type {
        border-top: var(--border);
    }

    .sketch_selected {
        color: var(--selected-text-color);
        background-color:  var(--selected-bg-color);
    }
</style>
