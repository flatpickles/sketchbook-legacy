<script>
    import { createEventDispatcher } from 'svelte';

    import SliderInput from './InputComponents/SliderInput.svelte';
    import ColorInput from './InputComponents/ColorInput.svelte';
    import CheckboxInput from './InputComponents/CheckboxInput.svelte';
    import { ColorParam, FloatParam, BoolParam } from '../Sketches/Base/SketchParam.js';

    export let sketch;

    const dispatch = createEventDispatcher();
    function paramUpdated() {
        dispatch('update', {});
    }
</script>

<div id='list_container'>
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

<style>
    #list_container {
        padding: 20px;
    }
</style>