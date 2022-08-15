# sketchbook

The vision for this project is to have a nice web app that presents an ever growing series of AV multimedia sketches. These may be shaders, canvas drawings, audio visualizers, video effects, or anything else, as long as they can run in a browser. I started from [this template](https://svelte.dev/repl/65d8e61777a44c77bf46eaa15b5f63dc?version=3.12.1), but have since modified it extensively. 

## Known Issues
* Resizing window can leave the CanvasSketch HTML canvas at the wrong size – seems like this sets a `margin` value for some reason.
* Behavior is undefined with an empty sketch index

## Feature wishlist & next steps
* HSV utility function
* Direct links: URL arguments -> sketch loading
* Custom parameter control styles + polish
* Crossfade when switching sketches
* Inputs:
    * Mouse position
    * Microphone
    * Webcam
    * MIDI (+ output?)
    * Image (browse & load)
* Param types
    * Button
* Hide sidebar tabs when collapsed w/ no mouse movement
* Date metadata & display for sketches (in sidebar)
* Save/load parameter configurations
* Visit without a URL argument -> select last viewed sketch
* Export frame option and/or record video option
* Experimental vs. "production" sketches
* Clear local state
* Folders for sketch index display organization
* Sketch sorting options: alphabetical or most recent

## Workflow wishlist
* Parameter improvements: `this.params.param.value` is awkward
* An easy way to capture current parameter values for use as defaults
* Making it easier for others to create their own sketchbooks:
    * Master branch is just the sketchbook tool, gh-pages branch includes sketches
    * Allow forking of master branch, updates to & rebases on master branch
* A sketch type that doesn't use canvas-sketch - just vanilla svelte

## Architecture notes
* Cleaner parameter display logic/architecture in SketchViewer
* Perhaps a single param component referenced from SketchViewer
* Types at top level of app (sketch types, parameter types)
