# sketchbook

Sketchbook is a web app that presents an ever growing series of programmatic art pieces, aka sketches, each with a set of configurable parameters. These sketches could be shaders, canvas drawings, audio visualizers, video effects, or anything else, as long as they can run in a browser. For the time being, sketches may only be built via the magnificent [canvas-sketch](https://github.com/mattdesl/canvas-sketch) framework.

## Known Issues
* Mobile:
    * First load doesn't render at 100% height (No Signal)
    * Swipes on sliders can scroll page
* Resizing the window can leave the CanvasSketch HTML canvas at the wrong size – seems like this sets a non-zero `margin` value for some reason.
* Behavior is undefined with an empty sketch index, or one with only WIP sketches (though perhaps this will never be a problem).
* When sharing a link to a WIP sketch with WIP disabled, it works as expected until another sketch is selected, then the WIP sketch disappears in the left panel. Ideally this would only happen on page reload, for consistency. 

## To do
* UX improvements:
    * Hide panel tabs when both collapsed w/ no mouse movement
    * Crossfade when switching sketches
* Global options:
    * Export frame option
    * Option to set window size
    * FPS meter
* Parameter UI:
    * Custom color styling
    * Number display for slider inputs
    * More space for parameter name (marquee for long names?)
* Presets:
    * Choose from curated parameter settings
    * Save your own (local storage)
    * Export current settings as JSON

## To consider
* Key commands
    * Hide/show panels (both or each)
* Sketch list display:
    * Date metadata & display for sketches in sidebar
    * Folders for sketch index display organization
    * Sketch sorting options: alphabetical or most recent
* Parameters / param display:
    * Foldable parameter groups
    * Calculate parameter defaults based on initial size
    * Min/max range slider (new param type)
* Inputs:
    * Mouse position & clicks
    * Key presses
    * Microphone
    * Webcam
    * MIDI (+ output?)
    * Image (browse & load)
* Assorted:
    * Export a sub-section of the canvas (smaller renders)

## Workflow / project wishlist
* Avoid bundling `public` dir in main branch
* A sketch type that doesn't use canvas-sketch - just vanilla svelte
* Parameter improvements: `this.params.paramName.value` is awkward, but providing a generated `this.paramName` property has proved difficult.
* An easy way to capture current parameter values for use as defaults
* Make it easier for others to create their own sketchbooks. Potential approach:
    * Master branch is just the sketchbook tool, gh-pages branch includes sketches
    * Allow forking of master branch, updates to & rebases on master branch

## Utility function wishlist
* HSV
* Kernel applicator
* Blur(s)
