#### <sup>:notebook: [sketchbook](../README.md) → [Notes](./README.md) → Rectilinear</sup>
---

## [Rectilinear](http://flatpickles.com/sketchbook/#rectilinear)

Randomly sized rectangles, fit together edge-to-edge, with configurable color palettes. This can generate patterns in a Mondrian-like style, and can achieve many other looks as well.

### Parameters
* `Total Width`: Maximum percentage of canvas width that will be filled with rectangles.
* `Total Height`: Maximum percentage of canvas height that will be filled with rectangles.
* `H Border Px`: Size of rectangle top/bottom borders, in pixels.
* `V Border Px`: Size of rectangle left/right borders, in pixels.
* `BG Color`: Color of the background, and the borders between rectangles.
* `Rect Color A`: Primary rectangle color, applied randomly to a subset of shapes.
* `A Likelihood`: Likelihood of each rectangle being the primary color, i.e. rough percentage of primary color coverage.
* `Rect Color B`: Secondary rectangle color, applied to non-primary shapes.
* `Random B Hue`: Randomize secondary color hue in HSV color space. Saturation & value are still respected.
* `New Colors`: Regenerate colors, preserving the current shapes.
* `Unit Size Px`: Unit size in pixels. Rectangle size will be set in increments of this unit.
* `H Max Units`: Maximum number of units used for the width of each rectangle.
* `V Max Units`: Maximum number of units used for the height of each rectangle.
* `New Shapes`: Regenerate shapes. As a side effect, colors will also be regenerated.