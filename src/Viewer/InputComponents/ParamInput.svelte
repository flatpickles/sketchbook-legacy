<script>
    export let label = '';
    $: inputID = label.split(" ")[0]
</script>

<div class='param'>
    {#if label}<label for={label}>{label}</label>{/if}
    <div class='param-wrapper'>
        <slot></slot>
    </div>
</div>

<style>
    .param {
        margin: 0;
        padding-top: var(--spacing);
        padding-bottom: var(--spacing);
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    div:first-child {
        padding-top: 0;
    }

    div:last-child {
        padding-bottom: 0;
    }

    .param-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 1;
        flex-grow: 1;
        flex-basis: 60%;
        box-sizing: border-box;
    }

    label {
        font-size: var(--param-font-size);
        flex-shrink: 1;
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: black;
        padding-right: var(--spacing);
        flex-basis: 120px;
        box-sizing: border-box;
    }
</style>