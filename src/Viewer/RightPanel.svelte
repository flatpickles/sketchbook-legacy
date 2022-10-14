<script>
    import { createEventDispatcher } from 'svelte';

    import SliderInput from './ParamInputs/SliderInput.svelte';
    import ColorInput from './ParamInputs/ColorInput.svelte';
    import CheckboxInput from './ParamInputs/CheckboxInput.svelte';
    import EventInput from './ParamInputs/EventInput.svelte';
    import { ColorParam, FloatParam, BoolParam, EventParam } from '../Sketches/Base/SketchParam.js';
    import PanelHeader from './PanelHeader.svelte';
    import PresetSelector from './PresetSelector.svelte';

    export let sketch;
    const dispatch = createEventDispatcher();
    let presetSelector = undefined;

    let labelWidths = new Array();
    $: paramCount = Object.keys(sketch.params).length;
    $: labelBasis = (Math.min(Math.max(...labelWidths.slice(0, paramCount)) + 1, 200)).toString() + 'px';

    function updateSketch(event) {
        dispatch('update', {
            incomplete: event && event.type !== 'change'
        });
        if (presetSelector) {
            presetSelector.paramsUpdated();
        }
    }

    function presetSelected(event) {
        const selectedPresetName = event.detail.name;
        sketch.selectPreset(selectedPresetName);
        sketch = sketch; // Svelte reactivity: update UI
        updateSketch(); // new param values will be saved
    }
</script>

<div id="panel_container">
    <PanelHeader id={sketch.name} openDefault={true} showContents={!!sketch.description}>
        <span slot='title'>
            {sketch.name}
        </span>
        <span slot='subtitle'>
            {#if sketch.date}
                {sketch.date.toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'long'
                })}
            {:else}
                [Work in Progress]
            {/if}
        </span>
        <span slot='click_to_expand' let:open={open}>
            {#if open}
                &dtrif;
            {:else}
                &dtri;
            {/if}
        </span>
        <span slot='contents'>
            {#if sketch.description}
                {@html sketch.description.trim()}
            {/if}
        </span>
    </PanelHeader>

    {#if sketch.showPresets}
        <PresetSelector
            bind:this={presetSelector}
            sketch={sketch}
            on:selection={presetSelected}
        />
    {/if}

    {#if sketch.params && Object.values(sketch.params).length > 0}
        <div id='params_container'>
            {#each Object.values(sketch.params) as param, index (sketch.name + param.name)}
                {#if (param instanceof FloatParam)}
                    <SliderInput
                        label={param.name}
                        title={param.description}
                        labelBasis={labelBasis}
                        bind:labelWidth={labelWidths[index]}
                        on:input={param.continuousUpdate ? updateSketch : null}
                        on:change={updateSketch}
                        bind:value={param.value}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                    />
                {:else if (param instanceof BoolParam)}
                    <CheckboxInput
                        label={param.name}
                        title={param.description}
                        labelBasis={labelBasis}
                        bind:labelWidth={labelWidths[index]}
                        on:input={updateSketch}
                        on:change={updateSketch}
                        bind:value={param.value}
                    />
                {:else if (param instanceof ColorParam)}
                    <ColorInput
                        label={param.name}
                        title={param.description}
                        labelBasis={labelBasis}
                        bind:labelWidth={labelWidths[index]}
                        on:input={updateSketch}
                        on:change={updateSketch}
                        bind:value={param.value}
                    />
                {:else if (param instanceof EventParam)}
                    <EventInput
                        label={param.name}
                        title={param.description}
                        labelBasis={labelBasis}
                        bind:labelWidth={labelWidths[index]}
                        on:click={updateSketch}
                        bind:value={param.value}
                    />
                {/if}
            {/each}
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

    #params_container {
        padding: var(--spacing);
        border-top: var(--border);
    }
</style>