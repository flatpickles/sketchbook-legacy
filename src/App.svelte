<script>
    import CanvasSketchEditor from './CanvasSketchEditor.svelte';
    import Slider from './Params/Slider.svelte';
    import Color from './Params/Color.svelte';
    import Checkbox from './Params/Checkbox.svelte';
    import { SketchDemo1, SketchDemo2 } from './Sketch.js';
    import { onMount } from 'svelte';

    let viewerComponent = undefined;

    const sketches = [
        new SketchDemo1(),
        new SketchDemo2(),
    ];
    let currentSketch = sketches[0];

    onMount(async () => {
        sketchSelected(currentSketch);
    });

    function sketchSelected(sketch) {
        viewerComponent.loadSketch(sketch);
        currentSketch = sketch;
    }
</script>

<CanvasSketchEditor bind:this={viewerComponent}>
    <span slot='sketches'>
        <ul>
            {#each sketches as sketch}
                <li>
                    <span
                        class='sketch_item'
                        class:sketch_unselected={sketch != currentSketch}
                        class:sketch_selected={sketch == currentSketch}
                        on:click={sketchSelected.bind(this, sketch)}>
                            {sketch.name}
                    </span>
                </li>
            {/each}
        </ul>
    </span>
    <span slot='inspector'>
        <!-- <Color label='Background' bind:value={selectedSketch.data.background} />
        <Color label='Foreground' bind:value={selectedSketch.data.foreground} />
        <Slider label='Arc Length' bind:value={selectedSketch.data.arclen} />
        <Slider label='Radius' bind:value={selectedSketch.data.radius} />
        <Slider label='Angle' bind:value={selectedSketch.data.angle} min={-Math.PI} max={Math.PI} />
        <Checkbox label='Outline' bind:checked={selectedSketch.data.outline} />
        {#if data.outline}
            <Slider label='Line Width' bind:value={selectedSketch.data.lineWidth} min=1 max=100 />
        {/if} -->
    </span>
</CanvasSketchEditor>

<style>
    .sketch_item {
        cursor: pointer;
    }
    .sketch_selected {
        font-weight: bold;
    }
    .sketch_unselected {
        font-style: italic;
    }
</style>