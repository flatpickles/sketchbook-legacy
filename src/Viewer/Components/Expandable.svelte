<script>
    export let open = false;

    // CSS cannot transition height to `auto`, so generate and use computed height
    let expandableHeight = undefined;
    let expandableBorderSize = 0; // could be derived w/ getComputedStyle in onMount if need be
    $: expandableHeightPx = expandableHeight + expandableBorderSize + 'px';

    // Disable animation when adjusting height, then re-enable it again
    let animationEnabled = true;
    $: expandableHeightUpdated(expandableHeight);
    function expandableHeightUpdated() {
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
    }

    .expand_animation {
        transition: height 0.3s ease-in-out;
    }

    #expandable_container.open {
        height: var(--expandable-container-height);
    }
</style>