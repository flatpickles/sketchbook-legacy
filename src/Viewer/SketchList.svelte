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
        border-bottom: 2px solid black;
        padding: 8px;
    }

    .sketch_selected {
        background-color:  rgb(0, 0, 0, 15%);
        font-weight: bold;
    }
</style>
