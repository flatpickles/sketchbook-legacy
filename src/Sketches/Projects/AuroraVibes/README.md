#### <sup>:notebook: [sketchbook](https://github.com/flatpickles/sketchbook-legacy) → [Projects](../) → Aurora Vibes</sup>

---

## [Aurora Vibes](https://sketchbook.flatpickles.com/#aurora-vibes)

Aurora Vibes was originally designed as the background for a friend's web project. My goal was to create something interesting without demanding too much attention, using the aurora borealis as inspiration. Though vivid results are within easy reach, more mellow outputs can maintain the same richness and depth.

-   `Time Scale` adjusts the speed of movement.
-   `X Scale` and `Y Scale` control how the textures stretch across the screen.
-   `Simplex Noise` allows you to use simplex noise when checked, or "classic" noise when unchecked (both via [glsl-noise](https://github.com/hughsk/glsl-noise)).
-   `Noise Offset` controls how far apart successive noise functions will be. Lower values will create similar looking "layers", enabling interesting trails or chrome-like highlights.
-   `Mix Easing` controls easing curves for color mixing. Higher values will enhance the definition between colors, making transitions more abrupt.
-   The four `Color` inputs define the colors that are used for the final composition, starting with `Base Color` and mixing in the following three colors in sequence.
-   Mix values are derived from noise function outputs, interpolated between `Mix Min` and `Mix Max` values. With `Mix Min = 0` and `Mix Max = 1`, the existing and next colors will be evenly distributed. With a negative `Mix Min` value, extrapolation away from the existing color is possible, enabling overexposed highlights, complementary hues, and other interesting results.
