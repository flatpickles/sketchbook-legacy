#### <sup>:notebook: [sketchbook](https://github.com/flatpickles/sketchbook) → [Projects](../) → 3D Experimentation </sup>
---

This is all a scratchpad right now. I'm learning how to use WebGL via regl, and it's great. My GL knowledge has been very much limited to fragment shaders (i.e. 2D shader art) and I'm excited to be expanding my mind.

References:
- https://webglfundamentals.org/
- https://bits.coop/articles/rigging-and-animation/

List:
- Understand how GL handles elements vs attributes
- Understand camera transforms: projection, view, etc
- What is regl-camera actually doing? Just giving us these matrices?
- Figure out flat cube shading (duplicating vertices?)
- Look up a Phong shading tutorial
- Explore generative 3D geometry generation: noisy blob perhaps?

Notes:
- Avoid derivative trick for flat shading; this introduces some aliasing it seems, perhaps because it relies on blocks of four pixels for differential calculation
- Attributes are "vertex attributes", i.e. there's one passed in for each of the 
- Use angle-normals to calculate vertex normals
- Use regl-camera for basic camera positioning