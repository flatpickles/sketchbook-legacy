#### <sup>:notebook: [sketchbook](../../../../../../) → [Projects](../) → Rectilinear</sup>
---

## [Rectilinear](http://flatpickles.com/sketchbook/#rectilinear)

Randomly sized rectangles, fit together edge-to-edge, with configurable color palettes. This can generate patterns in a Mondrian-like style, and can achieve many other looks as well.

Each pattern is built from the top left, adding randomly sized rectangles to the right of or beneath previously created rectangles. As I add each rectangle, I must make sure it's not overlapping with any that have previously been added; to find potential collisions quickly, I built a [quadtree](../src/Sketches/Util/Quadtree.js). By sizing each rectangle in increments of `Unit Size Px`, I can make sure that even the smallest gap-filling rectangles are still sized uniformly, contributing to a feeling of regularity and organization in the pattern as a whole.  

### Parameters
* `Total Width`: Maximum percentage of canvas width that will be filled with rectangles. At 100%, the rightmost rectangle sizes may not be divisible by `Unit Size Px`, such that the pattern fills the full screen. Less than 100%, the overall width will be rounded down to an increment of `Unit Size Px`.
* `Total Height`: Maximum percentage of canvas height that will be filled with rectangles. This behaves similarly to `Total Height`.
* `H Border Px`: Size of rectangle top/bottom borders, in pixels. Borders will only be drawn at the top & bottom of the overall pattern if `Total Width` is less than 100%; this enables a full-screen presentation, while ensuring that the outermost rectangles appear with a regular size when drawn with an inset.
* `V Border Px`: Size of rectangle left/right borders, in pixels. This behaves similarly to `H Border Px`.
* `BG Color`: Color of the background, and the borders between rectangles.
* `Rect Color A`: Primary rectangle color, applied randomly to a subset of shapes.
* `A Likelihood`: Likelihood of each rectangle being the primary color, i.e. rough percentage of primary color coverage.
* `Rect Color B`: Secondary rectangle color, applied to non-primary shapes.
* `Random B Hue`: Randomize secondary color hue in HSV color space. Saturation & value are still respected.
* `New Colors`: Regenerate colors, preserving the current shapes.
* `Unit Size Px`: Unit size in pixels. Rectangle size will be set in increments of this unit.
* `H Max Units`: Maximum number of units used for the width of each rectangle. Each rectangle will be given a random width in increments of `Unit Size Px`, from 1x up to `H Max Units`.
* `V Max Units`: Maximum number of units used for the height of each rectangle. Each rectangle will be given a random height in increments of `Unit Size Px`, from 1x up to `V Max Units`.
* `New Shapes`: Regenerate shapes. As a side effect, colors will also be regenerated. If the window has been resized, this will reset the dimensions of the pattern.