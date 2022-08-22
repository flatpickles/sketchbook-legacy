<script>
    export let name;
</script>

<button on:click>
    {name}
</button>

<style>
    button {
        background-color: #000;
        border: var(--border);
        color: #fff;
        margin: 0;
        padding: 4px 8px;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        font-size: var(--description-font-size);
    }

    button:active {
        background-color: #fff;
        color: #000;
    }
</style>