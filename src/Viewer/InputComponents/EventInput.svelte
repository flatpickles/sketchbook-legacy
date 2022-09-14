<script>
    import { createEventDispatcher } from 'svelte';

    import ParamInput from './ParamInput.svelte';

    export let label = '';
    export let title = undefined;
    export let value = undefined;

    const dispatch = createEventDispatcher();
    function buttonClicked(event) {
        if (value) value();
        // todo: can Svelte just forward the event?
        dispatch('click');
    }
</script>

<ParamInput {label} {title}>
    <button on:click={buttonClicked}>
    </button>
</ParamInput>

<style>
    button {
        background-color: #000;
        border: var(--border);
        color: #fff;
        margin: 0;
        padding: 0px 8px;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        font-size: 12px;
        border-radius: 5px;
        height: 10px;
        width: 33%;
        border: 2px solid #000;
    }

    button:active {
        background-color: rgb(0, 0, 0, 0);
        color: #000;
    }
</style>