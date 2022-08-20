# sketchbook

Sketchbook is a web app that presents an ever growing series of AV multimedia sketches, each with a set of configurable parameters. These sketches could be shaders, canvas drawings, audio visualizers, video effects, or anything else, as long as they can run in a browser. For the time being, sketches may only be built via the magnificent [canvas-sketch framework](https://github.com/mattdesl/canvas-sketch).

## Known Issues
* No blur effect behind panels on mobile - they need to be more opaque here
* Resizing the window can leave the CanvasSketch HTML canvas at the wrong size – seems like this sets a non-zero `margin` value for some reason
* Behavior is undefined with an empty sketch index

## Feature wishlist & next steps
* Option to clear local state
* FPS meter   
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
* Folders for sketch index display organization
* Sketch sorting options: alphabetical or most recent

## Workflow wishlist
* Parameter improvements: `this.params.param.value` is awkward
* An easy way to capture current parameter values for use as defaults
* Making it easier for others to create their own sketchbooks. Potential approach:
    * Master branch is just the sketchbook tool, gh-pages branch includes sketches
    * Allow forking of master branch, updates to & rebases on master branch
* A sketch type that doesn't use canvas-sketch - just vanilla svelte

## Utility function wishlist
* HSV
* Kernel applicator
* Blur(s)
