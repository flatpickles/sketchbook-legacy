<script>
	import { createEventDispatcher, onMount } from 'svelte';

    export let sketch = undefined;
    let selectElement = undefined;
    let presetModified = false;

    let menuVisible = false;
    $: resetEnabled = presetModified;
    $: createEnabled = presetModified;
    let removeEnabled = false; // todo: enable for custom or imported presets
    let importEnabled = true; // todo: pick local json file via dialog 
    let exportEnabled = true; // todo: save json file via dialog

    // Dispatch selection event
	const dispatch = createEventDispatcher();
    function presetSelected() {
        dispatch('selection', {
            name: selectElement.value
        });
    }

    // Update modified asterisk when parameters are updated
    onMount(paramsUpdated);
    export function paramsUpdated() {
        // Tricky to use Svelte reactivity here, so update function it is
        presetModified = sketch.presetModified;
    }

    // Show & hide the preset actions menu
    function showMenu() { menuVisible = true; }
    function hideMenu() { menuVisible = false; }
    function toggleMenu() { menuVisible = !menuVisible; }

    /*

    * Increase tap target size
    * Make the menu actions do things!
    * Hide/show menu actions when relevant

    */

    // Close menu when clicking outside of it
    window.addEventListener('mousedown', function(event) {
        if (menuVisible && !event.target.classList.contains('menu_item') && !event.target.classList.contains('menu_button')) {
            hideMenu();
        };
    });

    // Button click events

    function resetClicked() {
        hideMenu();
        presetSelected();
    }

    function createClicked() {
        hideMenu();
        const newPresetName = sketch.createPreset();
        if (newPresetName) {
            sketch = sketch; // Svelte reactivity (smelly but idiomatic, perhaps)
            setTimeout(() => { // After DOM updates with new preset in selector...
                selectElement.value = newPresetName;
                presetSelected();
            }, 0);
        }
    }

    function removeClicked() {
        hideMenu();
        throw 'Remove not yet enabled.'
    }

    function importClicked() {
        hideMenu();
        throw 'Import not yet enabled.'
    }

    function exportClicked() {
        hideMenu();
        sketch.exportPreset();
    }
</script>

<div class='preset_selector'>
    <div class='select_container'>
        <select bind:this={selectElement} on:change={presetSelected}>
            {#each Object.keys(sketch.presets) as presetName}
                {#if presetName === sketch.selectedPresetName}
                    <option value={presetName} selected>{presetName + (presetModified ? ' *' : '')}</option>
                {:else}
                    <option value={presetName}>{presetName}</option>
                {/if}
            {/each}
        </select>
    </div>

    <div class='menu'>
        <div class='menu_button' on:click={toggleMenu}>&ctdot;</div>
        <div class='menu_content' class:open={menuVisible}>
            {#if resetEnabled}
                <div class='menu_item' on:click={resetClicked}>
                    Reset
                </div>
            {/if}
            {#if createEnabled}
                <div class='menu_item' on:click={createClicked}>
                    Create
                </div>
            {/if}
            {#if removeEnabled}
                <div class='menu_item' on:click={removeClicked}>
                    Remove
                </div>
            {/if}
            {#if importEnabled}
                <div class='menu_item' on:click={importClicked}>
                    Import
                </div>
            {/if}
            {#if exportEnabled}
                <div class='menu_item' on:click={exportClicked}>
                    Export
                </div>
            {/if}
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
        z-index: 2;
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
