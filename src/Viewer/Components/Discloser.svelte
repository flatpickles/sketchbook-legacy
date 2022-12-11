<script type="ts">
    export let open: boolean;
    export let id: string;
    const size = 12;

    // Disable animation when adjusting content, then re-enable it again
    let animationEnabled = true;
    $: contentUpdated(id);
    function contentUpdated(_: string) {
        animationEnabled = false;
        setTimeout(() => { animationEnabled = true }, 0);
    }
</script>

<div style="--size: {size}" class="triangle" class:rotated={!open} class:rotate_animation={animationEnabled} />

<style>
    .triangle {
        width: calc(var(--size) * 1px);
        height: calc(var(--size) * 1px);
        background-color: black;
        clip-path: polygon(6.7% 25%, 93.3% 25%, 50% 100%);
        transform: translate(0%, -25%) rotate(0deg);
        -webkit-transform: translate(0%, -25%) rotate(0deg);
    }

    .triangle.rotate_animation {
        transition: transform var(--disclosure-animation-time) ease-out;
    }

    .triangle.rotated {
        transform: translate(0%, 0%) rotate(60deg);
        -webkit-transform: translate(0%, 0%) rotate(60deg);
    }
</style>