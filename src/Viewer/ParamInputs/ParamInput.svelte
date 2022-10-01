<script>
    import { onMount } from "svelte";

    export let label = '';
    export let title = undefined;
    export let labelBasis = undefined;
    export let labelWidth = undefined;

    // Use size of hidden textMeasurementDiv to publish display width for this label
    // Previously I was using bind:clientWidth, but this value can be inaccurate for
    // occasional initial page loads in mobile Safari (iOS). What a world.

    let textMeasurementDiv = undefined;
    onMount(setLabelWidth);
    $: labelUpdated(label);

    function labelUpdated(l) {
        setTimeout(setLabelWidth, 0);
    }

    function setLabelWidth() {
        if (!textMeasurementDiv) return;
        labelWidth = textMeasurementDiv.offsetWidth;
    }
</script>

<div class='param' title={title} style='--label-basis: {labelBasis}'>
    {#if label}<label for={label} class='param_name'>{label}</label>{/if}
    <div class='param_wrapper'>
        <slot></slot>
    </div>
</div>

<!-- An invisible div that we use to measure the label width, for common basis calculation -->
<div class='param_name text_measurement' bind:this={textMeasurementDiv}>{label}</div>

<style>
    .param {
        margin: 0;
        padding-top: var(--spacing);
        padding-bottom: var(--spacing);
        box-sizing: border-box;
        display: flex;
        flex-grow: 1;
        flex-basis: 100%;
        justify-content: flex-start;
        align-items: center;
    }

    div:first-child {
        padding-top: 0;
    }

    div:last-child {
        padding-bottom: 0;
    }

    .param_wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        box-sizing: border-box;
    }

    .param_name {
        font-size: var(--param-font-size);
        flex-shrink: 0;
        width: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: black;
        padding-right: var(--spacing);
        flex-basis: var(--label-basis);
        box-sizing: border-box;
        /* background-color: pink; */
    }

    .text_measurement {
        position: absolute;
        visibility: hidden;
        height: auto;
        width: auto;
        white-space: nowrap;
    }
</style>