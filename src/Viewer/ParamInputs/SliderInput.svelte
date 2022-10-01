<script>
    import ParamInput from './ParamInput.svelte';

    export let label = '';
    export let title = undefined;
    export let labelBasis = undefined;

    export let value = 0;
    export let min = 0;
    export let max = 1;
    export let step = 0.01;
    export let labelWidth = undefined;

    $: fixedDecimals = Math.ceil(Math.log10(1/step));
    $: inputString = value.toFixed(fixedDecimals);

    // Never let the number display get smaller than an original minimum width
    // This keeps the slider value from jumping around, e.g. when crossing 0
    let numberDisplayBasis = 18; // minimum width
    let numberDisplayBasisPx = numberDisplayBasis.toString() + 'px';
    let numberDisplayDiv = undefined;
    $: valueUpdated(value);
    function valueUpdated() {
        if (numberDisplayDiv) {
            let ceilWidth = numberDisplayDiv.offsetWidth;
            numberDisplayBasis = Math.max(numberDisplayBasis, ceilWidth);
            numberDisplayBasisPx = (numberDisplayBasis).toString() + 'px';
        };
    };
</script>

<ParamInput {label} {title} {labelBasis} bind:labelWidth={labelWidth}>
    <div class='slider_wrapper' style='--number-display-basis: {numberDisplayBasisPx}'>
        <input
            type='range' class='slider' id={label}
            bind:value={value} {min} {max} {step}
            on:input on:change
        />
        <div contenteditable='false' class='number_display' bind:this={numberDisplayDiv} bind:innerHTML={inputString}/>
    </div>
</ParamInput>

<style>

.slider_wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
}

.slider {
    appearance: none;
    margin: 0;
    padding: 0;
    height: auto;
    width: 100%;
    outline: none;
    height: 2px;
    background: #000;
    border: none;
}

.number_display {
    border: 0;
    background-color: #0000;
    margin: 0;
    margin-left: var(--spacing);
    font-size: var(--param-font-size);
    width: auto;
    text-align: right;
    flex-basis: var(--number-display-basis);
    flex-shrink: 0;
}

.number_display:focus {
    outline: 0;
}

.slider::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background-color: #000;
    border: none;
}

.slider::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    cursor: pointer;
    background-color: #000;
    border: none;
}

</style>