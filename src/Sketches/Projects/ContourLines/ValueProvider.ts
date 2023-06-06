import alea from 'alea';
import { createNoise3D } from 'simplex-noise';

export default class ValueProvider {
    constructor() {
        // Create the noise function
        const prng = alea(0);
        const noise = createNoise3D(prng);
    }
}
