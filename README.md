# :notebook: `sketchbook`

[Sketchbook](https://sketchbook.flatpickles.com/) is a web app that presents a growing collection of programmatic art pieces, aka "sketches", each with a set of configurable parameters. For the time being, sketches may only be built via the magnificent [canvas-sketch](https://github.com/mattdesl/canvas-sketch) framework.

I aspire to rebuild Sketchbook with TypeScript & SvelteKit. I also plan to eventually split this into two repositories: the UI and development system as an open source repo, and my own personal artwork as a fork of this, maintaining copyright. For now, no open source license applies.

Caveat lector: this readme is a rough brain-dump space from here on out!

## To do

-   Page sizing:
    -   Implement inset sizing (UI currently does nothing)
    -   Allow opting into print presentation for full-screen sketches
    -   Fix dimensions bug with shaders in this mode
-   Export - additionally export JSON file with current param values
-   Text parameters

## Known Issues

-   "Create" from existing but modified preset doesn't provide a usable name to start (number should increment further)
-   Resizing can clear canvas; need to redraw upon window resize
-   Color parameter inputs have a weird internal margin after hiding/showing right panel
-   If a sketch times out with a particular set of parameters, it can become unresponsive, and those params are saved in local storage so that the same issue persists past reload
-   Mobile:
    -   Preset selector is blue?!
    -   Taps on disclosure triangles flash an odd tap target
    -   Swipes on sliders can scroll page
    -   Color preview block has strange corners
-   Resizing the window can leave the canvas element at the wrong size. It seems this is literal canvas size and not padding, and happens only when the window is getting smaller in one dimension, every other time it seems.
-   Two finger mousepad swipe doesn't work for page navigation when Sketchbook is open. Probably this is disabled by my scrolling settings?
-   Sporadic:
    -   presets sometimes think they've been changed on page load (\*), but they haven't.
    -   panel open/close tabs don't always work reliably with narrow screens
    -   canvas-sketch doesn't fill the full screen height. Perhaps a race condition w/ full-height settings? (primarily mobile)
    -   print view was zoomed out too far, until scrolling (seen once on mobile)
    -   switching between full-screen canvas sketches causes a repeated doubling of canvas scale until reset or resize. Resetting Sketchbook solves this problem. (seen once)

## To consider for v2

-   Make this a SvelteKit project & rebuild with TypeScript
-   Import contents of Sketches/Projects automatically!? (easier with SvelteKit)
-   Presets
    -   Option to return param to return to preset/default value
    -   URL option to pre-select a preset
-   Hide/show panels w/ double click:
    -   Capture state (e.g. just one panel open) and resume that state
    -   Doesn't work on mobile?
-   Link styling
-   Global options:
    -   Additional link out to per-sketch readmes from right panel
    -   Import JSON parameter settings (bottom right panel)
    -   Option to set canvas size, inc. fit to window size (bottom right panel)
    -   FPS meter (probably in left panel settings)
    -   Command-Z to undo parameter changes
-   Test: Float bounds search for quadtree
-   Use class names in file names for projects
-   Port some 2021 P3 projects into Sketchbook
-   Link previews! Can we show a preview image for each sketch?
-   CSS triage: clean everything up
-   Cleanup: documentation, naming, etc.
-   Copyright somewhere on the page
-   Key commands
    -   Hide/show panels (both or each)
-   Sketch details display
    -   Link out to sketch-specific readmes on github
-   Sketch list display:
    -   Date metadata & display for sketches in sidebar
    -   Folders for sketch index display organization
    -   Sketch sorting options: alphabetical or most recent
-   Parameters / param display:
    -   Allow editing parameters via number readouts
    -   Foldable parameter groups
    -   Calculate parameter defaults based on initial size
    -   Min/max range slider (new param type)
    -   Radio button parameter type (2-5 options?)
-   Inputs:
    -   Mouse position & clicks
    -   Key presses
    -   Microphone
    -   Webcam
    -   MIDI (+ output?)
    -   Image (browse & load)
-   Assorted:
    -   Crossfade when switching sketches
    -   Export a sub-section of the canvas (smaller renders)
    -   When sharing a link to a WIP sketch with WIP disabled, it works as expected until another sketch is selected, then the WIP sketch disappears in the left panel. Ideally this would only happen on page reload, for consistency.
    -   Try using Vulf Mono - maybe it'd add a little vibe. It's also not as compact, TBD.

## Workflow / project wishlist

-   No defaults? Just presets - param default values are optional, first preset used otherwise
-   Preset values etc
    -   Easily create defaults from an export
    -   Update presets when params are updated?
-   Run tests in CI before deploying, something like [this](https://medium.com/@jjzcru/building-a-ci-cd-pipeline-with-vercel-and-github-actions-f80d3a4a7de3)
-   "Experimental" flag for Sketchbook features (not just sketches)
-   Probably get rid of global.css
-   A sketch type that doesn't use canvas-sketch - just vanilla svelte
-   Parameter improvements: `this.params.paramName.value` is awkward, but providing a generated `this.paramName` property seems tricky.
-   Make it easier for others to create their own sketchbooks. Potential approach:
    -   Master branch is just the sketchbook tool, gh-pages branch includes sketches
    -   Allow forking of master branch, updates to & rebases on master branch
-   Port to SvelteKit for better routing, and/or explore a Jamstack approach
