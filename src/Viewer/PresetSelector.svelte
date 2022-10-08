<script>
	import { createEventDispatcher } from 'svelte';

    export let presets = undefined;
    // export let presetSelectedIndex = 0; // todo: select last selected, add asterisk if modified

	const dispatch = createEventDispatcher();
    let selectElement = undefined;
    function presetSelected() {
        dispatch('selection', {
            name: selectElement.value
        });
    }
</script>

<div id='preset_selector'>
    <div id='select_container'>
        <select bind:this={selectElement} on:change={presetSelected}>
            {#each Object.keys(presets) as presetName, idx}
                <option value={presetName}>{presetName}</option>
            {/each}
        </select>
    </div>
    <div id='new_button'>
        +
    </div>
</div>

<style>
    #preset_selector {
        border-top: var(--border);
        padding: 0;
        font-size: var(--description-font-size);
        display: flex;
        align-items: baseline;
    }

    #select_container {
        flex-grow: 1;
        flex-shrink: 0;
    }

    select {
        appearance: none;
        border: 0;
        background: #0000;
        margin: 0;
        padding: var(--spacing);
        width: 100%;
    }

    select:focus {
        outline: 0;
        flex-shrink: 0;
        flex-grow: 0;
    }

    #new_button {
        padding: var(--spacing);
        text-align: right;
        
    }
</style>
