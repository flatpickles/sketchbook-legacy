import { writable } from 'svelte/store';

// A store for the current print dimensions!
// todo: generalize localStorage based Svelte stores, and use this for other saved state

const printDimensionsDefault = { width: 8.5, height: 11 };
let storedPrintDimensionsState = localStorage.getItem('printDimensions');
let printDimensionsState = storedPrintDimensionsState
    ? JSON.parse(storedPrintDimensionsState)
    : printDimensionsDefault;

export const printDimensions = writable(printDimensionsState);
printDimensions.subscribe((value) => {
    localStorage.setItem('printDimensions', JSON.stringify(value));
});
