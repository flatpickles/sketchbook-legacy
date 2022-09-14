<script>
    import ParamInput from './ParamInput.svelte';

    export let label = '';
    export let title = undefined;
    export let value = false;
</script>

<ParamInput {label} {title}>
    <label class='custom_checkbox'>
        <input type='checkbox' class='checkbox' id={label} bind:checked={value} on:input on:change />
        <span></span>
    </label> 
</ParamInput>

<style>
    input {
        display: none;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        width: 100%;
    }

    .custom_checkbox {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .custom_checkbox span {
        width: 6px;
        height: 6px;
        display: block;
        background-color: rgba(0, 0, 0, 0);
        border: 2px solid #000;
        border-radius: 2px;
    }

    .custom_checkbox input:checked + span {
        background-color: #000;
    }
</style>