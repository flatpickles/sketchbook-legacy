<script type="ts">
    export let open: boolean;
    const size = 10;
</script>

<div style="--size: {size}" class="triangle" class:rotated={!open} />

<style>
    .triangle {
        width: calc(var(--size) * 1px);
        height: calc(var(--size) * 1px);
        background-color: black;
        clip-path: polygon(0 6.7%, 100% 6.7%, 50% 93.3%);
    }

    .triangle.rotated {
        transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
    }
</style>