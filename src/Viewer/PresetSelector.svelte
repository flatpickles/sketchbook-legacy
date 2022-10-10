<script>
	import { createEventDispatcher, onMount } from 'svelte';

    export let sketch = undefined;
    let selectElement = undefined;

    // Dispatch selection event
	const dispatch = createEventDispatcher();
    function presetSelected() {
        dispatch('selection', {
            name: selectElement.value
        });
    }

    // Update modified asterisk when parameters are updated
    let modifiedText = undefined;
    onMount(paramsUpdated);
    export function paramsUpdated() {
        modifiedText = sketch.presetModified ? ' *' : '';
    }

    // Show & hide the preset actions menu
    let menuVisible = false;
    function toggleMenu() {
        menuVisible = !menuVisible;
    }

    /*

    * Hide menu when choosing new preset, switching sketch
    * Increase tap target size
    * Make the menu actions do things!
    * Hide/show menu actions when relevant

    */
</script>

<div class='preset_selector'>
    <div class='select_container'>
        <select bind:this={selectElement} on:change={presetSelected}>
            {#each Object.keys(sketch.availablePresets) as presetName}
                {#if presetName === sketch.selectedPresetName}
                    <option value={presetName} selected>{presetName + modifiedText}</option>
                {:else}
                    <option value={presetName}>{presetName}</option>
                {/if}
            {/each}
        </select>
    </div>
    <div class='menu'>
        <div class='menu_button' on:click={toggleMenu}>&ctdot;</div>
        <div class='menu_content' class:open={menuVisible}>
            <div class='menu_item'>
                Reset
            </div>
            <div class='menu_item'>
                New
            </div>
            <div class='menu_item'>
                Remove
            </div>
            <div class='menu_item'>
                Import
            </div>
            <div class='menu_item'>
                Export
            </div>
        </div>
    </div>
</div>

<style>
    .preset_selector {
        border-top: var(--border);
        padding: 0;
        font-size: var(--description-font-size);
        display: flex;
        align-items: baseline;
    }

    .select_container {
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

    .menu {
        position: relative;
        padding: var(--spacing);
        display: inline-block;
    }

    .menu_button {
        text-align: right;
        cursor: pointer;
    }

    .menu_content {
        display: none;
        flex-direction: column;
        position: absolute;
        z-index: 1;
        right: 0;
        border: var(--border);
        font-size: var(--description-font-size);
        color: #000;
        background-color: var(--panel-background);
        backdrop-filter: var(--panel-filter);
        -webkit-backdrop-filter: var(--panel-filter);
        border-radius: 2px;
    }

    .menu .open {
        display: flex;
    }

    .menu_item {
        flex-grow: 1;
        padding: 2px;
        padding-left: var(--spacing);
        padding-right: var(--spacing);
        cursor: pointer;
    }

    .menu_item:hover {
        background-color: var(--selected-bg-color);
    }
</style>
