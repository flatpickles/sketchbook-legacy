<script>
    import Discloser from './Components/Discloser.svelte';
    import Expandable from './Components/Expandable.svelte';

    export let id = undefined
    export let openDefault = false;
    export let showContents = true;

    // Determine openness from stored state for this id
    $: openStateKey = id + '_HeaderOpen';
    let openState = getStoredOpenState(openDefault);
    $: idChanged(id);
    function idChanged() {
        openState = getStoredOpenState(openDefault)
    }

    function getStoredOpenState(defaultState) {
        let storedOpenState = localStorage.getItem(openStateKey);
        return storedOpenState ? (storedOpenState === 'true') : defaultState;
    }

    function toggleOpenState() {
        openState = !openState;
        localStorage.setItem(openStateKey, openState ? 'true' : 'false');
    }
</script>

<div class='title'>
    <slot name='title'>
    </slot>
</div>

<div class='subtitle'>
    <div class='subtitle_text'>
        <slot name='subtitle'>
        </slot>
    </div>

    <div class='subtitle_button' on:click={toggleOpenState} class:hidden={!showContents}>
        <Discloser bind:open={openState} />
    </div>
</div>

{#if showContents}
    <Expandable open={openState} id={id}>
        <div class='contents_container'>
            <slot name='contents'>
            </slot>
        </div>
    </Expandable>
{/if}

<style>
    .title {
        font-size: var(--title-font-size);
        padding: var(--spacing);
        padding-bottom: 0;
        padding-top: var(--title-top-spacing);
    }

    .subtitle {
        display: flex;
        align-items: end;
        padding-top: var(--subtitle-top-spacing);
        padding-bottom: var(--spacing);
    }

    .subtitle_text {
        flex-grow: 1;
        font-size: var(--subtitle-font-size);
        padding: var(--spacing);
        padding-top: 0;
        padding-bottom: 0;
    }

    .subtitle_button {
        padding-bottom: 1px; /* lil zhuzh */
        padding-right: var(--spacing);
        cursor: pointer;
        user-select: none;
        vertical-align: top;
    }

    .contents_container {
        font-size: var(--description-font-size);
        padding: var(--spacing);
        padding-top: 0;
        display: flex;
        flex-direction: column;
    }

    .hidden {
        visibility: hidden;
    }
</style>
