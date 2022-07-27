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

<ul>
    {#each sketches as sketch}
        <li>
            <span
                class='sketch_item'
                class:sketch_unselected={sketch != selected}
                class:sketch_selected={sketch == selected}
                on:click={selectSketch.bind(this, sketch)}>
                    {sketch.name}
            </span>
        </li>
    {/each}
</ul>

<style>
    .sketch_item {
        cursor: pointer;
    }
    .sketch_selected {
        font-weight: bold;
    }
    .sketch_unselected {
        font-style: italic;
    }
</style>
