<script>
    export let open = false;
    export let id = undefined;

    // CSS cannot transition height to `auto`, so generate and use computed height
    let expandableHeight = undefined;
    let expandableBorderSize = 0; // could be derived w/ getComputedStyle in onMount if need be
    $: expandableHeightPx = expandableHeight + expandableBorderSize + 'px';

    // Disable animation when adjusting content, then re-enable it again
    let animationEnabled = true;
    $: contentUpdated(expandableHeight, id);
    function contentUpdated() {
        animationEnabled = false;
        setTimeout(() => { animationEnabled = true }, 0);
    }
</script>

<div id='expandable_container' style='--expandable-container-height: {expandableHeightPx}' class:open={open} class:expand_animation={animationEnabled}>
    <div id='expandable' bind:clientHeight={expandableHeight}>
        <slot>
            Expandable content.
        </slot>
    </div>
</div>

<style>
    #expandable_container {
        box-sizing: content-box;
        height: 0;
        overflow: hidden;
        flex-shrink: 0;
    }

    .expand_animation {
        transition: height var(--animation-time) ease-in-out;
    }

    #expandable_container.open {
        height: var(--expandable-container-height);
    }
</style>