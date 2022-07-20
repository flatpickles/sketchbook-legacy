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
</script>

<main>
    <div class='panel'>
      <slot>
        <!-- Sketch list goes here! -->
      </slot>
    </div>
    <div class='viewport'>
        <CanvasSketch {sketch}/>
    </div>
    <div class='panel'>
        {#each Object.values(sketch.params) as param}
            {#if (param instanceof FloatParam)}
                <SliderInput
                    label={param.name}
                    on:input={paramUpdated}
                    on:change={paramUpdated}
                    bind:value={param.value}
                    min={param.min}
                    max={param.max}>
                </SliderInput>
            {:else if (param instanceof BoolParam)}
                <CheckboxInput
                    label={param.name}
                    on:input={paramUpdated}
                    on:change={paramUpdated}
                    bind:value={param.value}>
                </CheckboxInput>
            {:else if (param instanceof ColorParam)}
                <ColorInput
                    label={param.name}
                    on:input={paramUpdated}
                    on:change={paramUpdated}
                    bind:value={param.value}>
                </ColorInput>
            {/if}
        {/each}
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
    
    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
    .viewport {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        flex-basis: 60%;
        min-width: 200px;
        flex-grow: 1;
        flex-shrink: 1;
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
        background: hsl(0, 0%, 95%);
        border-left: 1px solid hsl(0, 0%, 90%);
    }
</style>