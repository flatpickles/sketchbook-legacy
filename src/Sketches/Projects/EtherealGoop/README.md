#### <sup>:notebook: [sketchbook](https://github.com/flatpickles/sketchbook) → [Projects](../) → Ethereal Goop</sup>
---

## [Ethereal Goop](http://flatpickles.com/sketchbook/#ethereal-goop)

Ethereal Goop is based on a noise layering (experiment)[https://flatpickles.com/image/ethereal-goop.jpg] from 2021. I've built upon that for a fresh Sketchbook version, adding new features and presets, and improving performance.

### Parameters

* `Goop Scale`: The scale for the entire goopy form. Impacts everything except edge softness, which is rendered relative to absolute pixel density.
* `X Offset`: The X offset between the top and bottom noise layers. Intermediate layer offsets are interpolated.
* `Y Offset`: The Y offset between the top and bottom noise layers.
* `Layer Count`: Number of noise form layers rendered.
* `Noise Edge`: Threshold value between positive and negative space in the rendered noise forms.
* `Edge Taper`: Control for increasing/decreasing noise edge on each layer. Negative values will make lower layers larger; I've found that this is the most useful.
* `Edge Softness`: Blurring value for smooth transitions between layer edges. Small values can approximate antialiasing, large values can create rounded forms.
* `BG Color`: The color painted behind all layers. Often looks good when set to the same as Bottom Color, but can also provide a contrasting setting.
* `Bottom Color`: Color for the lowest layer. The color of all intermediary layers will be interpolated between this and Top Color (in HSV space).
* `Top Color`: Color for the highest layer, i.e. the foreground of the piece.