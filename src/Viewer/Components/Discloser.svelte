<script type="ts">
    import { Direction, DisclosureConfig } from "./Types";

    export let direction: Direction;
    export let borderStyle: boolean = false;
    export let size: number = 12;
    export let open: boolean;
    export let id: string;

    $: config = ((direction) => {
        switch (direction) {
            case Direction.Down:
                return new DisclosureConfig(0, -25, 0, 60);
            case Direction.Left:
                return new DisclosureConfig(0, 0, 90, 30);
            case Direction.Right:
                return new DisclosureConfig(0, 0, 30, 90);
        }
    })(direction);

    // Disable animation when adjusting content, then re-enable it again
    let animationEnabled = true;
    $: contentUpdated(id);
    function contentUpdated(_: string) {
        animationEnabled = false;
        setTimeout(() => { animationEnabled = true }, 0);
    }
</script>

<div
    style="
        --size: {size};
        --openTransX: {config.openTransX};
        --openTransY: {config.openTransY};
        --openRotation: {config.openRotation};
        --closeRotation: {config.closeRotation};"
    class="triangle"
    class:rotated={!open}
    class:rotate_animation={animationEnabled}
>
    {#if borderStyle}
        <div
            style="--size: {size -  2 / Math.sin(Math.PI / 6)};"
            class="triangle inner"
        />
    {/if}
</div>


<style>
    .triangle {
        width: calc(var(--size) * 1px);
        height: calc(var(--size) * 1px);
        background-color: black;
        clip-path: polygon(6.7% 25%, 93.3% 25%, 50% 100%);
        transform: translate(calc(var(--openTransX) * 1%), calc(var(--openTransY) * 1%)) rotate(calc(var(--openRotation) * 1deg));
        -webkit-transform: translate(calc(var(--openTransX) * 1%), calc(var(--openTransY) * 1%)) rotate(calc(var(--openRotation) * 1deg));
        
        /* Center contained objects (e.g. another triangle) */
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .triangle.rotate_animation {
        transition: transform var(--animation-time) ease-out;
    }

    .triangle.rotated {
        transform: translate(0%, 0%) rotate(calc(var(--closeRotation) * 1deg));
        -webkit-transform: translate(0%, 0%) rotate(calc(var(--closeRotation) * 1deg));
    }

    .inner {
        background-color: rgba(255, 255, 255, 100%);
        transform: rotate(0deg);
    }
</style>