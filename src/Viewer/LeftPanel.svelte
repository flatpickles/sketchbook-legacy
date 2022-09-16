<script>
	import { createEventDispatcher, onMount } from 'svelte';
    import Button from './Components/Button.svelte';
    import PanelHeader from './PanelHeader.svelte';

    export let sketches;
    export let selected;

    // Communicate selection event to parent
	const dispatch = createEventDispatcher();
    function selectSketch(sketch) {
        dispatch('selection', {
            sketch: sketch
        });
    }

    // WIP sketches!
    let storedWorksInProgressState = localStorage.getItem('showWorksInProgress');
    let showWorksInProgress = storedWorksInProgressState ? (storedWorksInProgressState === 'true') : false;
    $: worksInProgressButtonText = (showWorksInProgress ? 'Hide ' : 'Show') + ' Works in Progress';

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
    <PanelHeader openStateKey='SketchbookHeader'>
        <span slot='title'>
            Sketchbook
        </span>
        <span slot='subtitle'>
            by <a href='http://flatpickles.com'>flatpickles</a>
        </span>
        <span slot='click_to_expand' let:open={open}>
            {#if open}
                &#9733;
            {:else}
                &#9734;
            {/if}
        </span>
        <span slot='contents'>
            <p>
                Sketchbook is a collection of programmatic art pieces. It is a work in progress.
                Code and details <a href='https://github.com/flatpickles/sketchbook'>here</a>.
            </p>
            <div id='buttons'>
                <Button name={worksInProgressButtonText} on:click={toggleWIP}></Button>
                <Button name='Reset Sketchbook' on:click={resetState}></Button>
            </div>
        </span>
    </PanelHeader>
    
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

    /* Settings panel */

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
