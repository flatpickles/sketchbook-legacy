<script>
    import ParamInput from './ParamInput.svelte';

    export let label = '';
    export let value = 0;
</script>

<ParamInput {label} >
  <input type='color' id={label} bind:value={value} on:input on:change />
</ParamInput>

<style>
input {
    cursor: pointer;
    -webkit-appearance: none;
    border: none;
    background: none;
    border-radius: 5px;
    padding: 0;
    overflow: hidden;
    width: 50px;
    height: 25px;
    outline: 0;
    box-sizing: border-box;
    border: 1px solid #dcdcdc;
    padding: 0;
    margin: 0;
}
  
input[type="color"]::-webkit-color-swatch-wrapper {
    border: 0;
    padding: 0;
}
input[type="color"]::-webkit-color-swatch {
    border: none;
    border: 2px solid white;
    border-radius: 5px;
}
</style>