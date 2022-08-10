<script>
    import CanvasSketch from './CanvasSketch.svelte';
    import SliderInput from './InputComponents/SliderInput.svelte';
    import ColorInput from './InputComponents/ColorInput.svelte';
    import CheckboxInput from './InputComponents/CheckboxInput.svelte'
    import { ColorParam, FloatParam, BoolParam } from '../Sketches/Base/SketchParam.js';

    export let sketch;

    function paramUpdated() {
        // Svelte reactivity with param input updates
        sketch = sketch;
    }

    let leftPanelOpen = false;
    function toggleLeft() {
        leftPanelOpen = !leftPanelOpen;
    }

    let rightPanelOpen = false;
    function toggleRight() {
        rightPanelOpen = !rightPanelOpen;
    }
</script>

<!-- <div class='panel'>
    <slot>
    </slot>
</div> -->

<div id="left_panel" class="panel" class:open={leftPanelOpen}>
    <div class="panel_content">
        <slot>
        </slot>
    </div>
    <div class="button_container">
        <div class="panel_button">
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

<div class="viewport">
    <CanvasSketch {sketch} />
</div>

<div id="right_panel" class="panel" class:open={rightPanelOpen}>
    <div class="button_container">
        <div class="panel_button">
            <span on:click={toggleRight}>
                {#if rightPanelOpen}
                    [x]
                {:else}
                    [&lt]
                {/if }
            </span>
        </div>
    </div>
    <div class="panel_content">
        {#each Object.values(sketch.params) as param}
            {#if (param instanceof FloatParam)}
                <SliderInput
                    label={param.name}
                    on:input={paramUpdated}
                    on:change={paramUpdated}
                    bind:value={param.value}
                    min={param.min}
                    max={param.max}
                />
            {:else if (param instanceof BoolParam)}
                <CheckboxInput
                    label={param.name}
                    on:input={paramUpdated}
                    on:change={paramUpdated}
                    bind:value={param.value}
                />
            {:else if (param instanceof ColorParam)}
                <ColorInput
                    label={param.name}
                    on:input={paramUpdated}
                    on:change={paramUpdated}
                    bind:value={param.value}
                />
            {/if}
        {/each}
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
        padding: 20px;
        flex-grow: 1;
        background-color: rgb(255, 255, 255, 70%);
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

    .panel_content {
    }

    .button_container {
        width: 50px;
        background-color: rgb(0, 0, 0, 0%);
    }

    .panel_button {
        cursor: pointer;
    }

    /* .panel {
        padding: 20px;
        box-sizing: border-box;
        flex-basis: 300px;
        min-width: 200px;
        max-width: 400px;
        flex-grow: 1;
        flex-shrink: 1;
        height: 100%;
        background: hsl(0, 0%, 95%, 50%);
        border-left: 1px solid hsl(0, 0%, 90%);
    } */


</style>