<script type="ts">
    export let open: boolean;
    const size = 12;
</script>

<div style="--size: {size}" class="triangle" class:rotated={!open} />

<style>
    .triangle {
        width: calc(var(--size) * 1px);
        height: calc(var(--size) * 1px);
        background-color: black;
        clip-path: polygon(6.7% 25%, 93.3% 25%, 50% 100%);
        transition: transform var(--disclosure-animation-time) ease-out;
        transform: translate(0%, -25%) rotate(0deg);
        -webkit-transform: translate(0%, -25%) rotate(0deg);
    }

    .triangle.rotated {
        transform: translate(0%, 0%) rotate(60deg);
        -webkit-transform: translate(0%, 0%) rotate(60deg);
    }
</style>