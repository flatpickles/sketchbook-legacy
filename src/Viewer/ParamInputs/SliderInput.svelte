<script>
    import ParamInput from './ParamInput.svelte';

    export let label = '';
    export let title = undefined;
    export let value = 0;
    export let min = 0;
    export let max = 1;
    export let step = 0.01;

    $: fixedDecimals = Math.ceil(Math.log10(1/step));
    $: inputString = value.toFixed(fixedDecimals);
</script>

<ParamInput {label} {title}>
    <div class='slider_wrapper'>
        <input
            type='range' class='slider' id={label}
            bind:value={value} {min} {max} {step}
            on:input on:change
        />
        <div contenteditable='false' class='number_display' bind:innerHTML={inputString}/>
    </div>
</ParamInput>

<style>

.slider_wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
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
    flex-basis: 18px; /* todo: un-hardcode 2 char width */
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