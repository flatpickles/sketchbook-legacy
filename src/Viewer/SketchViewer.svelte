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

    let leftBarOpen = false;
    function toggleLeft() {
        leftBarOpen = !leftBarOpen;
    }
</script>

<!-- <div class='panel'>
    <slot>
    </slot>
</div> -->

<div class="left_side" class:open={leftBarOpen}>
    <div class="left_content">
        <slot>
        </slot>
    </div>
    <div class="left_button_container">
        <div class="left_button">
            <span on:click={toggleLeft}>[x]</span>
        </div>
    </div>
</div>

<div class='viewport'>
    <CanvasSketch {sketch} />
</div>

<!--
<div class='panel'>
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

-->
<style>
    .viewport {
        width: 100%;
        height: 100%;
    }

    .left_side {
        position: fixed;
        display: flex;
        flex-direction: row;
        height: 100%;
        left: -250px;
        width: 300px;
        transition: left 0.3s ease-in-out;
    }

    .open {
        left: 0px
    }

    .left_content {
        flex-grow: 1;
        background-color: rgb(0, 0, 0, 20%);
    }

    .left_button_container {
        width: 50px;
        text-align: left;
        background-color: rgb(0, 0, 0, 0%);
    }

    .left_button {
        cursor: pointer;
    }

    .panel {
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
    }

    

    aside {
        /* offscreen by default */
    }


</style>