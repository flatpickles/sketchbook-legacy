<script>
	import { createEventDispatcher, onMount } from 'svelte';
    export let sketches;
    export let selected;

    // Communicate selection event to parent
	const dispatch = createEventDispatcher();
    function selectSketch(sketch) {
        dispatch('selection', {
            sketch: sketch
        });
    }

    // Settings panel!
    let storedSettingsPanelState = localStorage.getItem('settingsPanelOpen');
    let settingsPanelOpen = storedSettingsPanelState ? (storedSettingsPanelState === 'true') : false;
    let settingsPanelHeight = undefined;
    let settingsPanelBorderSize = undefined;
    $: settingsPanelHeightPx = settingsPanelHeight + settingsPanelBorderSize + 'px';

    onMount(async () => {
        // Compute settings panel border size for use in height calculation
        // Currently this is styled at zero, but I'll leave this just in case.
        settingsPanelBorderSize = parseInt(
            getComputedStyle(document.getElementById('settings_panel'), null)
            .getPropertyValue('border-top-width')
        );
    })

    function toggleSettingsPanel() {
        settingsPanelOpen = !settingsPanelOpen;
        localStorage.setItem('settingsPanelOpen', settingsPanelOpen ? 'true' : 'false');
    }
</script>

<div id='panel_container' style='--settings-panel-height: {settingsPanelHeightPx}'>
    <div id='title'>
        Sketchbook
    </div>

    <div id='subtitle'>
        <div id='subtitle_text'>
            by <a href='http://flatpickles.com'>flatpickles</a>
        </div>
        <div id='subtitle_button' on:click={toggleSettingsPanel}>
            {#if settingsPanelOpen}
                &#9733;
            {:else}
                &#9734;
            {/if}
        </div>
    </div>

    <div id='settings_panel_container' class:open={settingsPanelOpen}>
        <div id='settings_panel' bind:clientHeight={settingsPanelHeight}>
            Sketchbook is a collection of programmatic art pieces.
            Code and details <a href='https://github.com/flatpickles/sketchbook'>here</a>.
            <br/>
            <br/><b>todo:</b> experimental mode
            <br/><b>todo:</b> clear local state
        </div>
    </div>
    
    <div id='list_container'>
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
        display: flex;
    }

    #subtitle_text {
        flex-grow: 1;
        font-size: var(--subtitle-font-size);
        padding: var(--spacing);
        padding-top: 4px;
    }

    #subtitle_button {
        padding-right: var(--spacing);
        cursor: pointer;
        user-select: none;
    }

    #settings_panel {
        font-size: var(--description-font-size);
        padding: var(--spacing);
        padding-top: 0;
    }

    #settings_panel_container {
        box-sizing: content-box;
        height: 0;
        transition: height 0.3s ease-in-out;
        overflow: hidden;
    }

    #settings_panel_container.open {
        /* CSS cannot transition height to `auto`, so use computed height */
        height: var(--settings-panel-height);
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

    .sketch_item:first-of-type {
        border-top: var(--border);
    }

    .sketch_selected {
        color: var(--selected-text-color);
        background-color:  var(--selected-bg-color);
    }
</style>
