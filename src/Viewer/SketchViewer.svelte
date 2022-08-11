<script>
    import CanvasSketch from './CanvasSketch.svelte';

    export let sketch;
    let sketchComponent;

    export function update() {
        sketchComponent.update();
    }

    let leftPanelOpen = localStorage.getItem('leftPanelOpen') ? (localStorage.getItem('leftPanelOpen') === 'true') : true;
    function toggleLeft() {
        leftPanelOpen = !leftPanelOpen;
        localStorage.setItem('leftPanelOpen', leftPanelOpen ? 'true' : 'false');
    }

    let rightPanelOpen = localStorage.getItem('rightPanelOpen') ? (localStorage.getItem('rightPanelOpen') === 'true') : true;
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
        <div class='panel_button'>
            <span on:click={toggleLeft}>
                {#if leftPanelOpen}
                    [x]
                {:else}
                    [&gt]
                {/if }
            </span>
        </div>
    </div>
</div>

<div class='viewport'>
    <CanvasSketch {sketch} bind:this={sketchComponent} />
</div>

<div id='right_panel' class='panel' class:open={rightPanelOpen}>
    <div class='button_container'>
        <div class='panel_button'>
            <span on:click={toggleRight}>
                {#if rightPanelOpen}
                    [x]
                {:else}
                    [&lt]
                {/if }
            </span>
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
        background-color: rgb(255, 255, 255, 70%);
    }

    .button_container {
        width: 50px;
        background-color: rgb(0, 0, 0, 0%);
    }

    .panel_button {
        cursor: pointer;
    }

    #left_panel {
        left: -250px;
        transition: left 0.3s ease-in-out;
    }

    #left_panel.open {
        left: 0px
    }

    #left_panel .button_container {
        text-align: left;
    }

    #left_panel .panel_content {
        border-right: 2px solid black;
    }

    #right_panel {
        left: calc(100vw - 50px);
        transition: left 0.3s ease-in-out;
    }

    #right_panel.open {
        left: calc(100vw - 300px);
    }

    #right_panel .button_container {
        text-align: right;
    }

    #right_panel .panel_content {
        border-left: 2px solid black;
    }

</style>