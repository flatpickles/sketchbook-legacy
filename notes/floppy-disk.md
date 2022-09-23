#### <sup>:notebook: [sketchbook](../README.md) → [Notes](./README.md) → Floppy Disk</sup>
---

## [Floppy Disk](http://flatpickles.com/sketchbook/#floppy-disk)

A wobbly warpy floppy disk. Ported over to Sketchbook from the [original version](https://editor.isf.video/shaders/62506e017917e40014095a49) on ISF.video.

Floppy Disk is implemented as a shader, taking a playful approach to abstract shapes created within a polar coordinate system. Two underlying shapes are phased against each other with configurable influence factors, creating an undulating motion that's both good, and good for you.

### Parameters

* `Inner Size`: The size (relative to display space radius) of the inner border of the form.
* `Outer Size`: The size of the outer border of the form.
* `Shape 1`: Number of polygon vertices for the first of two underlying shapes.
* `Factor 1`: The influence that the first shape has on the overall form.
* `Shape 2`: Number of polygon vertices for the second of two underlying shapes.
* `Factor 2`: The influence that the second shape has on the overall form.
* `Center Color`: The color at the center.
* `Color 1`: Innermost ring color, repeated several times.
* `Color 2`: Second innermost ring color, repeated several times.
* `Color 3`: Third innermost ring color, repeated several times.
* `BG Color`: The color outside of the form.