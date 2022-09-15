<script>
    export let open = false;

    let expandableHeight = undefined;
    let expandableBorderSize = 0; // could be derived w/ getComputedStyle in onMount if need be
    $: expandableHeightPx = expandableHeight + expandableBorderSize + 'px';
</script>

<div id='expandable_container' style='--expandable-container-height: {expandableHeightPx}' class:open={open}>
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
        transition: height 0.3s ease-in-out;
        overflow: hidden;
    }

    #expandable_container.open {
        /* CSS cannot transition height to `auto`, so use computed height */
        height: var(--expandable-container-height);
    }
</style>