<script>
    import CanvasSketch from './CanvasSketch.svelte';
    import { ColorParam, FloatParam, BoolParam } from './Sketch.js';
    import SliderInput from './InputComponents/SliderInput.svelte';
    import ColorInput from './InputComponents/ColorInput.svelte';
    import CheckboxInput from './InputComponents/CheckboxInput.svelte';

    export let sketch;
    
  //   let localStorageSupported = (() => {
  //       try {
  //           return typeof window.localStorage !== 'undefined';
  //       } catch (err) {
  //           return false;
  //       }
  //   })();

  //   // None of this will work in the sandbox REPL but it will work offline
  // readData(settings, data);
  // $: saveData(settings, data);

  // function saveData(settings, data) {
  //   if (localStorageSupported && settings.localStorage !== false) {
  //     window.localStorage.setItem("data", JSON.stringify(data));
  //   }
  // }

  // function readData(settings, data) {
  //   if (localStorageSupported && settings.localStorage !== false) {
  //     try {
  //       const prev = window.localStorage.getItem("data");
  //       if (!prev) return;
  //       const newData = JSON.parse(prev);
  //       Object.assign(data, newData);
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // }

  function paramUpdated(param) {
    // Trigger reactivity
    sketch = sketch;
  }

</script>

<main>
    <div class='panel'>
      <slot>
        <!-- Sketch list -->
      </slot>
    </div>
    <div class='viewport'>
        <CanvasSketch {sketch}/>
    </div>
    <div class='panel'>
        {#each Object.values(sketch.params) as param}
            {#if (param instanceof FloatParam)}
                <SliderInput label={param.name} on:input={paramUpdated} bind:value={param.value} min={param.min} max={param.max}></SliderInput>
            {:else if (param instanceof BoolParam)}
                <CheckboxInput label={param.name} on:input={paramUpdated} bind:value={param.value}></CheckboxInput>
            {:else if (param instanceof ColorParam)}
                <ColorInput label={param.name} on:input={paramUpdated} bind:value={param.value}></ColorInput>
            {/if}
        {/each}
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
    
    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
    .viewport {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        flex-basis: 60%;
        min-width: 200px;
        flex-grow: 1;
        flex-shrink: 1;
    }
    .panel {
        padding: 20px;
        box-sizing: border-box;
        flex-basis: 300px;
        min-width: 200px;
        max-width: 400px;
        flex-grow: 1;
        flex-shrink: 1;
        height: 100%;
        background: hsl(0, 0%, 95%);
        border-left: 1px solid hsl(0, 0%, 90%);
    }
</style>