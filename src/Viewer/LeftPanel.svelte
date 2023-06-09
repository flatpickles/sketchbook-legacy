<script>
	import { createEventDispatcher } from 'svelte';
    import Button from './Components/Button.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import ValuePairInput from './Components/ValuePairInput.svelte';
    import { printDimensions } from './stores';

    export let sketches;
    export let selected;
    let visibleSketches = [];

    // Communicate selection event to parent
	const dispatch = createEventDispatcher();
    function selectSketch(sketch) {
        dispatch('selection', {
            sketch: sketch
        });
    }

    // Derive categories from available sketches
    const categories = sketches.reduce((acc, sketch) => {
        if (acc.indexOf(sketch.category) === -1) {
            acc.push(sketch.category);
        }
        return acc;
    }, []);
    if (categories.length != 2) {
        throw 'UI supports only two categories for now.';
    }

    // Enable category selection
    let selectedCategory = undefined;
    selectCategory(selected.category);
    function selectCategory(category) {
        selectedCategory = category;
        visibleSketches = sketches.filter((sketch) => {
            return sketch.category === category;
        });
    }

    // Experimental mode
    let storedExperimentalState = localStorage.getItem('showExperimental');
    let experimentalMode = storedExperimentalState ? (storedExperimentalState === 'true') : false;
    $: worksInProgressButtonText = experimentalMode ? '~ Hide Experiments ~' : 'Experimental Mode';
    $: showExperimentalButton = sketches.reduce((incrementalState, currentSketch) => {
        return currentSketch.experimental || incrementalState;
    }, false);

    function toggleExperimentalMode() {
        // Toggle the state
        experimentalMode = !experimentalMode;
        localStorage.setItem('showExperimental', experimentalMode ? 'true' : 'false');

        // Select a different non-experimental sketch if currently selected is experimental
        if (!experimentalMode && selected.experimental) {
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
            {#if experimentalMode}
                <p>
                    You've enabled experimental mode! This will show projects that may be incomplete or unimpressive, but might be interesting nonetheless.
                </p>
            {/if}
            <ValuePairInput
                groupLabel='Print Size (Inches)'
                leftLabel='W:'
                bind:leftValue={$printDimensions.width}
                rightLabel='H:'
                bind:rightValue={$printDimensions.height}
            />
            <div id='buttons'>
                {#if showExperimentalButton}
                    <Button name={worksInProgressButtonText} on:click={toggleExperimentalMode}></Button>
                {/if}
                <Button name='Reset Sketchbook' on:click={resetState}></Button>
            </div>
        </span>
    </PanelHeader>

    {#if experimentalMode}
        <div id='category_container'>
            {#each categories as category}
                <div
                    class='category_item'
                    class:selected={category == selectedCategory}
                    on:click={selectCategory.bind(this, category)}
                    on:keypress={selectCategory.bind(this, category)}>
                        {category}
                </div>
            {/each}
        </div>
    {/if}
    
    <div id='list_container'>
        {#each visibleSketches as sketch}
            {#if !sketch.experimental || experimentalMode || sketch == selected}
                <div
                    class='sketch_item'
                    class:selected={sketch == selected}
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
        hyphens: auto;
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

    /* Category list */

    #category_container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-top: var(--border-emphasis);
        border-bottom: var(--border-emphasis);
        margin-bottom: var(--spacing);
    }

    .category_item {
        font-size: var(--sketch-list-font-size);
        cursor: pointer;
        flex-grow: 1;
        width: 50%;
        padding: var(--spacing);
        user-select: none;
    }

    .category_item:first-of-type {
        border-right: var(--border-emphasis);
    }

    .category_item.selected {
        color: var(--selected-text-color);
        background-color:  var(--selected-bg-color);
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

    .sketch_item.selected {
        color: var(--selected-text-color);
        background-color:  var(--selected-bg-color);
    }
</style>
