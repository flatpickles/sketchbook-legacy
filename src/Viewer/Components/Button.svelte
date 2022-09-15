<script>
    export let name;
</script>

<button on:click>
    {name}
</button>

<style>
    button {
        background-color: rgb(0, 0, 0, 0);
        border: var(--border);
        color: #000;
        margin: 0;
        padding: 4px 8px;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        font-size: var(--description-font-size);
        border-radius: 2px;
    }

    button:active {
        background-color: #000;
        color: #FFF;
    }
</style>