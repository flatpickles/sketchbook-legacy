import NoSignal from './Sketches/Projects/NoSignal/index.js';
import Rectilinear from './Sketches/Projects/Rectilinear/index.js';
import FloppyDisk from './Sketches/Projects/FloppyDisk/index.js';
import Mandelbrot from './Sketches/Projects/Mandelbrot/index.js';
import EtherealGoop from './Sketches/Projects/EtherealGoop/index.js';
import ReglCube from './Sketches/Projects/ReglCube/index.js';
import Tunnel from './Sketches/Projects/Tunnel/index.js';
import AuroraVibes from './Sketches/Projects/AuroraVibes/AuroraVibes.js';
import Essentia from './Sketches/Projects/Essentia/Essentia.js';
import Concentric from './Sketches/Projects/Concentric/Concentric.js';
import BioBlobs from './Sketches/Projects/BioBlobs/BioBlobs.js';
import Globe from './Sketches/Projects/Globe/Globe.js';
import ContourLines from './Sketches/Projects/ContourLines/ContourLines.js';
import FlowField from './Sketches/Projects/FlowField/FlowField.js';
import Testbed from './Sketches/Projects/Testbed/Testbed.js';
import Relax from './Sketches/Projects/Relax/Relax.js';
import CornerRays from './Sketches/Projects/CornerRays/CornerRays.js';
import SolarPraxis from './Sketches/Projects/SolarPraxis/SolarPraxis.js';
import ImpliedShape from './Sketches/Projects/ImpliedShape/ImpliedShape.js';
import ThatsAMoire from './Sketches/Projects/ThatsAMoire/ThatsAMoire.js';

// Collect all sketches (todo: automate as a part of the build process)
const sketches = [
    new ThatsAMoire(),
    new ContourLines(),
    new ImpliedShape(),
    new SolarPraxis(),
    new CornerRays(),
    // new Testbed(),
    new Relax(),
    new FlowField(),
    new Globe(),
    new BioBlobs(),
    new Concentric(),
    new Essentia(),
    new AuroraVibes(),
    new Tunnel(),
    new ReglCube(),
    new EtherealGoop(),
    new Mandelbrot(),
    new Rectilinear(),
    new NoSignal(),
    new FloppyDisk()
];
export default sketches;
