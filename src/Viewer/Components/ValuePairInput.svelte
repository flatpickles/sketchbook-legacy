<script lang="ts">
    export let groupLabel: string;
    export let leftLabel: string;
    export let rightLabel: string;
    export let leftValue: number;
    export let rightValue: number;


    function selectText(event: FocusEvent) {
        (event.target as HTMLInputElement).select();
    }

    function zeroIfNeeded(event: FocusEvent) {
        const relatedTargetValue = (event.target as HTMLInputElement)?.value;
        if (!parseFloat(relatedTargetValue)) {
            // todo: perhaps reset to default here
            (event.target as HTMLInputElement).value = '0';
        }
    }
</script>

<fieldset class="inputs">
    <legend>{groupLabel}</legend>
    <div class="dimension-input">
        <label for="size-width-input">{leftLabel}</label>
        <input type="number" class="size-input" id="size-width-input" bind:value={leftValue} on:focusin={selectText} on:focusout={zeroIfNeeded}>
    </div>
    <div class="dimension-input">
        <label for="size-height-input">{rightLabel}</label>
        <input type="number" class="size-input" id="size-height-input" bind:value={rightValue} on:focusin={selectText} on:focusout={zeroIfNeeded}>
    </div>
</fieldset>

<style lang="scss">
    fieldset {
        border: 1px solid #000;
        border-radius: 2px;
        margin: 0;
    }

    input {
        width: 100%;
        margin: 0;
        text-align: right;
        border: 1px solid #000;
        border-radius: 2px;
        background-color: rgba(255, 255, 255, 0.5);
        outline: none;
    }

    .inputs {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        column-gap: 0.5rem;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 0.5rem;
    }

    .dimension-input {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    // Hide the input arrows
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        appearance: textfield;
        -moz-appearance: textfield;
    }
</style>