<script>
    import { createEventDispatcher } from 'svelte';

    import SliderInput from './InputComponents/SliderInput.svelte';
    import ColorInput from './InputComponents/ColorInput.svelte';
    import CheckboxInput from './InputComponents/CheckboxInput.svelte';
    import { ColorParam, FloatParam, BoolParam } from '../Sketches/Base/SketchParam.js';

    export let sketch;

    const dispatch = createEventDispatcher();
    function paramUpdated(event) {
        dispatch('update', {
            domEvent: event
        });
    }
</script>

<div id="panel_container">
    <div id="sketch_name">
        {sketch.name}
    </div>
    <div id="sketch_date">
        Aug 13, 2022
    </div>

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
</div>

<style>
    #panel_container {
        display: flex;
        flex-direction: column;
    }

    #sketch_name {
        font-size: var(--title-font-size);
        padding: var(--spacing);
        padding-bottom: 0;
    }

    #sketch_date {
        font-size: var(--subtitle-font-size);
        padding: var(--spacing);
        padding-top: 4px;
        border-bottom: var(--border);
    }

    #list_container {
        padding: var(--spacing);
    }
</style>