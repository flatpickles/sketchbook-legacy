<script>
	import { createEventDispatcher, onMount } from 'svelte';

    export let sketch = undefined;
    let selectElement = undefined;
    let presetModified = false;

    let menuVisible = false;

    /* Selection & state management */

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

    function selectPreset(presetName) {
        if (presetName) {
            sketch.selectPreset(presetName);
            paramsUpdated();
            sketch = sketch; // Svelte reactivity
        }
    }

    /* Menu visibility */

    // Show & hide the preset actions menu
    function showMenu() { menuVisible = true; }
    function hideMenu() { menuVisible = false; }
    function toggleMenu() { menuVisible = !menuVisible; }

    // Close menu when clicking outside of it
    window.addEventListener('mousedown', function(event) {
        if (menuVisible && !event.target.classList.contains('menu_item') && !event.target.classList.contains('menu_button')) {
            hideMenu();
        };
    });

    /* Button click events */

    function resetClicked() {
        if (presetModified) {
            hideMenu();
            presetSelected();
        }
    }

    function createClicked() {
        if (presetModified) {
            hideMenu();
            const newPresetName = sketch.createPreset();
            selectPreset(newPresetName);
        }
    }

    function removeClicked() {
        if (sketch.canRemoveSelectedPreset()) {
            hideMenu();
            sketch.removeSelectedPreset();
            selectPreset(sketch.defaultPresetName);
        }
    }

    function importClicked() {
        hideMenu();
        sketch.importPreset().then((presetName) => {
            selectPreset(presetName);
        }).catch((errorMessage) => {
            if (!errorMessage.name || errorMessage.name != 'AbortError') {
                // The user did not cancel, and there was an error nonetheless
                const message = errorMessage.message ?? errorMessage;
                alert(message);
            }
        });
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
            <div class='menu_item' on:click={resetClicked} class:disabled={!presetModified}>
                Reset
            </div>
            <div class='menu_item' on:click={createClicked} class:disabled={!presetModified}>
                Create
            </div>
            <div class='menu_item' on:click={removeClicked} class:disabled={!sketch.canRemoveSelectedPreset()}>
                Remove
            </div>
            <div class='menu_item' on:click={importClicked}>
                Import
            </div>
            <div class='menu_item' on:click={exportClicked}>
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

    .menu_item.disabled {
        cursor: default;
        color: #AAA;
        background-color: #0000;
    }
</style>
