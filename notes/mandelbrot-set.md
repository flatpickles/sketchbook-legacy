#### <sup>:notebook: [sketchbook](../README.md) → [Notes](./README.md) → Mandelbrot Set</sup>
---

## [Mandelbrot Set](http://flatpickles.com/sketchbook/#mandelbrot-set)

Standard low-precision Mandelbrot fare, with basic navigation and a little bit extra. Look, a rainbow!

This is implemented as a fragment shader, and as it turns out, WebGL doesn't support double precision. It probably makes this considerably snappier to use floats, but also means that we can't zoom in as far, so perhaps this misses some of the classic fractal appeal.

If I were to keep working on this (which I may, someday), I'd explore the following:
* A more sophisticated Mandelbrot algorithm, and/or custom double math to enable higher resolution rendering.
* Julia set calculations as well! (Or maybe this is a different project.)
* More customizable coloring.
* Pixel smoothing, via a Gaussian post-process, or something like that.
* Better navigation: buttons to move a consistent amount depending on zoom depth, and/or keyboard and mouse controls.

### Parameters

* `Zoom`: Zoom depth, as a percentage of the deepest allowable zoom within this rendering.
* `X Offset`: Effectively the horizontal scroll location.
* `Y Offset`: Effectively the vertical scroll location.
* `Color Cycles`: How many times the we cycle through the color wheel between the outer and inner boundaries of the fractal.
