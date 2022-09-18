<script>
    import ParamInput from './ParamInput.svelte';

    export let label = '';
    export let title = undefined;
    export let value = 0;
    export let min = 0;
    export let max = 1;
    export let step = 0.01;

    $: inputString = value.toFixed(1)
</script>

<ParamInput {label} {title}>
    <div class='slider_wrapper'>
        <input
            type='range' class='slider' id={label}
            bind:value={value} {min} {max} {step}
            on:input on:change
        />
        <input type='text' class='number_display' value={inputString} readonly>
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

.number_display {
    border: 0;
    background-color: #0000;
    margin: 0;
    margin-left: var(--spacing);
    font-size: 10px;
    width: 30px;
}

</style>