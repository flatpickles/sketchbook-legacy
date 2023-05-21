import { writable } from 'svelte/store';

// A store that persists to local storage
function createStoredStore(id: string, defaultValues: Record<string, any>) {
    // Get starting state
    let storedState = localStorage.getItem(id);
    let state = storedState ? JSON.parse(storedState) : defaultValues;

    // Assign defaults for unset state values
    for (const key in defaultValues) {
        if (!(key in state)) {
            state[key] = defaultValues[key];
        }
    }

    // Create the store
    const { subscribe, set } = writable(state);

    // Store any updates
    subscribe((value) => {
        localStorage.setItem(id, JSON.stringify(value));
    });

    return {
        subscribe,
        set,
    };
}

// A store for the current print dimensions!
export const printDimensions = createStoredStore('printDimensions', {
    width: 8.5,
    height: 11,
    hMargin: 0.5,
    vMargin: 0.5,
});
