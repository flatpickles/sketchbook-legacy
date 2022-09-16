<script>
    import Expandable from './Components/Expandable.svelte';

    export let openStateKey = 'PanelHeader';
    let storedOpenState = localStorage.getItem(openStateKey);
    let openState = storedOpenState ? (storedOpenState === 'true') : false;

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

    <div class='subtitle_button' on:click={toggleOpenState}>
        <slot name='click_to_expand' open={openState}>
        </slot>
    </div>
</div>

<Expandable open={openState}>
    <div class='contents_container'>
        <slot name='contents'>
        </slot>
    </div>
</Expandable>

<style>
    .title {
        font-size: var(--title-font-size);
        padding: var(--spacing);
        padding-bottom: 0;
    }

    .subtitle {
        display: flex;
        align-items: baseline;
        padding-top: var(--subtitle-top-spacing);
    }

    .subtitle_text {
        flex-grow: 1;
        font-size: var(--subtitle-font-size);
        padding: var(--spacing);
        padding-top: 0;
    }

    .subtitle_button {
        line-height: 0.5em; /* unicode chars can be too tall */
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
</style>
