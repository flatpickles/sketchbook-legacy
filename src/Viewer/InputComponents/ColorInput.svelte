<script>
    import ParamInput from './ParamInput.svelte';

    export let label = '';
    export let title = undefined;
    export let value = 0;
</script>

<ParamInput {label} {title}>
  <input type='color' id={label} bind:value={value} on:input on:change />
</ParamInput>

<style>
    input {
        cursor: pointer;
        -webkit-appearance: none;
        border: none;
        background: none;
        border-radius: 2px;
        padding: 0;
        overflow: hidden;
        width: 66%;
        height: 12px;
        outline: 0;
        box-sizing: border-box;
        border: 2px solid #000;
        padding: 0;
        margin: 0;
    }
    
    input[type="color"]::-webkit-color-swatch-wrapper {
        border: 0;
        padding: 0;
    }

    input[type="color"]::-webkit-color-swatch {
        border: 0;
    }
</style>