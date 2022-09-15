#### <sup>:notebook: [sketchbook](../README.md) → [Notes](./README.md) → No Signal</sup>
---

## No Signal

A "no signal" graphic, inspired by VCRs and other classic image displays. This was the first sketch project created within Sketchbook, and it is a simple demo of Sketchbook's capabilities and intent.

No Signal is implemented fully as an HTML canvas painting, without any shaders. This has performance implications; after implementing the base graphic, I built a film grain effect to post-process the canvas's pixels, but it caused considerable FPS lag on large displays so I've disabled it for now. Someday I'll enable GPU shaders as a post-processing option for HTML canvas drawings, and perhaps I'll revisit this piece at that point.

### Parameters

* `Color Count`: Number of vertical color stripes displayed in the upper segment of the screen.
* `B&W Count`: Number of vertical black & white stripes displayed in the lower segment of the screen.
* `Display Text`: Hide or show the "No Signal" text in the middle of the screen.