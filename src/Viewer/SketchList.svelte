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

<div class="list_container">
    {#each sketches as sketch}
        <div
            class='sketch_item'
            class:sketch_selected={sketch == selected}
            on:click={selectSketch.bind(this, sketch)}>
                {sketch.name}
        </div>
    {/each}
</div>

<style>
    .list_container {
        display: flex;
        flex-direction: column;
    }

    .sketch_item {
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
