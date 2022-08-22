<script>
    import ParamInput from './ParamInput.svelte';

    export let label = '';
    export let value = 0;
    export let min = 0;
    export let max = 1;
    export let step = 0.01;
</script>

<ParamInput {label}>
    <input type='range' class='slider' id={label} bind:value={value} {min} {max} {step} on:input on:change />
</ParamInput>

<style>
.slider {
    appearance: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: auto;
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
</style>