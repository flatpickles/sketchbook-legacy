<script>
    import CanvasSketch from './CanvasSketch.svelte';

    export let sketch;
    let sketchComponent;

    export function update() {
        sketchComponent.update();
    }

    let storedLeftPanelState = localStorage.getItem('leftPanelOpen');
    let leftPanelOpen = storedLeftPanelState ? (storedLeftPanelState === 'true') : true;
    function toggleLeft() {
        leftPanelOpen = !leftPanelOpen;
        localStorage.setItem('leftPanelOpen', leftPanelOpen ? 'true' : 'false');
    }

    let storedRightPanelState = localStorage.getItem('rightPanelOpen');
    let rightPanelOpen = storedRightPanelState ? (storedRightPanelState === 'true') : true;
    function toggleRight() {
        rightPanelOpen = !rightPanelOpen;
        localStorage.setItem('rightPanelOpen', rightPanelOpen ? 'true' : 'false');
    }
</script>

<div id='left_panel' class='panel' class:open={leftPanelOpen}>
    <div class='panel_content'>
        <slot name='left'>
        </slot>
    </div>
    <div class='button_container'>
        <div class='panel_button' on:click={toggleLeft}>
            {#if leftPanelOpen}
                &lt
            {:else}
                &gt
            {/if }
        </div>
    </div>
</div>

<div class='viewport'>
    <CanvasSketch {sketch} bind:this={sketchComponent} />
</div>

<div id='right_panel' class='panel' class:open={rightPanelOpen}>
    <div class='button_container'>
        <div class='panel_button' on:click={toggleRight}>
            {#if rightPanelOpen}
                &gt
            {:else}
                &lt
            {/if }
        </div>
    </div>
    <div class='panel_content'>
        <slot name='right'>
        </slot>
    </div>
</div>

<style>
    .viewport {
        width: 100%;
        height: 100%;
    }

    .panel {
        position: fixed;
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 300px;
    }

    .panel_content {
        flex-grow: 1;
        background-color: var(--panel-background);
        backdrop-filter: var(--panel-filter);
    }

    .button_container {
        width: 50px;
        background-color: rgb(0, 0, 0, 0%);
        display: flex;
        flex-direction: row;
        height: fit-content;
    }

    .panel_button {
        color: var(--collapse-tab-text-color);
        font-size: var(--collapse-tab-font-size);
        cursor: pointer;
        padding: var(--collapse-tab-padding);
        border-bottom: var(--border);
        background-color: var(--collapse-tab-bg-color);
        backdrop-filter: var(--panel-filter);
        text-align: center;
        flex-shrink: 2;
    }

    /* Left panel */

    #left_panel {
        left: -250px;
        transition: left 0.3s ease-in-out;
    }

    #left_panel.open {
        left: 0px
    }

    #left_panel .button_container {
        justify-content: flex-start;
    }

    #left_panel .panel_content {
        border-right: var(--border);
    }

    #left_panel .panel_button {
        border-right: var(--border);
    }

    /* Right panel */

    #right_panel {
        left: calc(100vw - 50px);
        transition: left 0.3s ease-in-out;
    }

    #right_panel.open {
        left: calc(100vw - 300px);
    }

    #right_panel .button_container {
        justify-content: flex-end;
    }

    #right_panel .panel_content {
        border-left: var(--border);
    }

    #right_panel .panel_button {
        border-left: var(--border);
    }

</style>