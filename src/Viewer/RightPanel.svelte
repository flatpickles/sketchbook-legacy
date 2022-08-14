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
        {sketch.date.toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
    </div>

    {#if sketch.params && Object.values(sketch.params).length > 0}
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
    {/if}

    {#if sketch.description}
        <div id='description'>
            {sketch.description.trim()}
        </div>
    {/if}
</div>

<style>
    #panel_container {
        display: flex;
        flex-direction: column;
        overflow: auto;
        max-height: 100vh;
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
    }

    #list_container {
        padding: var(--spacing);
        border-top: var(--border);
    }

    #description {
        padding: var(--spacing);
        border-top: var(--border);
        font-size: var(--description-font-size);
        white-space: pre-line;
    }
</style>