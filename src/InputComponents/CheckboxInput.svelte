<script>
    import ParamInput from './ParamInput.svelte';

    export let label = '';

    export let value = false;
</script>

<ParamInput {label}>
    <input type='checkbox' id={label} bind:checked={value} on:input on:change />
</ParamInput>

<style>
input {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    width: 100%;
}
</style>