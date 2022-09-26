import NoSignal from './Sketches/NoSignal.js';
import Rectilinear from './Sketches/Rectilinear.js';
import FloppyDisk from './Sketches/FloppyDisk.js';
import Mandelbrot from './Sketches/Mandelbrot.js';

const sketches = [
    new Mandelbrot(),
    new Rectilinear(),
    new NoSignal(),
    new FloppyDisk(),
];

export default sketches;