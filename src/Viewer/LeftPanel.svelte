<script>
	import { createEventDispatcher } from 'svelte';
    export let sketches;
    export let selected;

	const dispatch = createEventDispatcher();
    function selectSketch(sketch) {
        dispatch('selection', {
            sketch: sketch
        });
    }
</script>

<div id="panel_container">
    <div id="title">
        Sketchbook
    </div>

    <div id="subtitle">
        by <a href="http://flatpickles.com">flatpickles</a>
    </div>
    
    <div id="list_container">
        {#each sketches as sketch}
            <div
                class='sketch_item'
                class:sketch_selected={sketch == selected}
                on:click={selectSketch.bind(this, sketch)}>
                    {sketch.name}
            </div>
        {/each}
    </div>
</div>

<style>
    #panel_container {
        display: flex;
        flex-direction: column;
    }

    #title {
        font-size: var(--title-font-size);
        padding: var(--spacing);
        padding-bottom: 0;
    }

    #subtitle {
        font-size: var(--subtitle-font-size);
        padding: var(--spacing);
        padding-top: 4px;
        border-bottom: var(--border);
    }

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

    .sketch_selected {
        color: var(--selected-text-color);
        background-color:  var(--selected-bg-color);
    }
</style>
