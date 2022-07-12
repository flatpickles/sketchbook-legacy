# sketches

The vision for this project is to have a nice web app UI around an ever growing series of canvas-sketch based projects. These will probably be shaders to start, but hopefully can be anything I want in the web domain – thus the svelte wrapper.

I'm starting from [this template](https://svelte.dev/repl/65d8e61777a44c77bf46eaa15b5f63dc?version=3.12.1), but will end up heavily modifying it.

Basic UI:
* Left and right panels that slide out and in with the click of a button
* Left: list of sketches
* Right: customizable parameter / about pane

Considerations:
* Not necessarily optimizing for canvas-sketch only, having that just be one type of sub-component.
* [svelte-self](https://svelte.dev/tutorial/svelte-self) for nested folders containing sketches
* A way to link to a sketch directly, e.g. from flatpickles.com
* Storing the state (parameters and selected sketch) for when the site is reloaded again (only go to selected sketch if a direct URL is not provided)
* Where to go the first time the site is loaded? Probably the most recent sketch.
* Sorting the list by name and by date published
* How to make this easily usable for other people to use with their collections of things?