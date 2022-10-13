import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam } from '../../Base/SketchParam.js';
import Util from '../../Util/Util.js';
import Random from 'canvas-sketch-util/random';

export default class NoSignal extends Sketch {
    name = 'No Signal';
    type = SketchType.Canvas;
    date = new Date("8/15/2022");
    description = `
        A "no signal" graphic, inspired by VCRs and other classic image displays. This was the first sketch project created within Sketchbook, and it is a simple demo of Sketchbook's capabilities and intent.
    `;
    showPresets = false;

    params = {
        colorCount: new FloatParam('Color Count', 19, 1, 32, 1, true,
            'Number of vertical color stripes displayed in the upper segment of the screen.'),
        bwCount: new FloatParam('B&W Count', 32, 1, 64, 1, true,
            'Number of vertical black & white stripes displayed in the lower segment of the screen.'),
        displayText: new BoolParam('Show Text', true,
            'Hide or show the "No Signal" text in the middle of the screen.')
    };

    settings = {
        animate: true
    }
    
    sketchFn = ({}) => {
        // Tuned constants
        const barHeight = 150;
        const colorPercentage = 0.85;
        const colorSpeed = 0.1;
        const noiseSpeed = 14;
        const noiseFreq = 0.5;
        const noiseDepth = [30, 20, 10];

        // CanvasSketch function
        return ({ context, width, height, time }) => {
            // Clear the previous frame
            context.clearRect(0, 0, width, height);

            // Draw color bars
            const colorNumBars = Math.floor(this.params.colorCount.value);
            const colorBarWidth = Math.floor(width / colorNumBars);
            const colorExtraWidth = width - colorBarWidth * colorNumBars;
            const colorBarHeight = Math.floor(height * colorPercentage);
            for (let barIndex = 0; barIndex < colorNumBars; barIndex++) {
                let currentBarWidth = colorBarWidth;
                if (barIndex == colorNumBars - 1) {
                    currentBarWidth += colorExtraWidth;
                }
                const hue = (barIndex / colorNumBars + time * colorSpeed) % 1;
                context.fillStyle = Util.hsl(hue, 1, 0.5);
                context.fillRect(colorBarWidth * barIndex, 0, currentBarWidth, colorBarHeight);
            }

            // Draw B&W bars
            const bwNumBars = Math.floor(this.params.bwCount.value);
            const bwBarWidth = Math.floor(width / bwNumBars);
            const bwExtraWidth = width - bwBarWidth * bwNumBars;
            const bwBarHeight = height - colorBarHeight;
            for (let barIndex = 0; barIndex < bwNumBars; barIndex++) {
                let currentBarWidth = bwBarWidth;
                if (barIndex == bwNumBars - 1) {
                    currentBarWidth += bwExtraWidth;
                }
                const value = Util.triangle(time * colorSpeed - barIndex / bwNumBars + 2);
                context.fillStyle = Util.hsl(0, 0, value);
                context.fillRect(bwBarWidth * barIndex, colorBarHeight, currentBarWidth, bwBarHeight);
            }

            // Horizontal stripe across the screen
            context.fillStyle = '#000';
            context.fillRect(0, height/2 - barHeight/2, width, barHeight);

            // "No Signal" text
            if (this.params.displayText.value) {
                context.fillStyle = '#FFF';
                context.font = "56px monospace";
                context.textAlign = "center";
                context.textBaseline = 'middle';
                context.fillText("NO SIGNAL", width/2, height/2);
            }

            // Blur (todo)

            // Grain effect with minor color distortion
            /* Grain effect needs optimization
            const originalImage = context.getImageData(0, 0, width, height);
            const modifiedImage = new ImageData(width, height);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    // Get pixel data
                    const dataOffset = (width * y + x) * 4;
                    const rIdx = dataOffset;
                    const gIdx = dataOffset + 1;
                    const bIdx = dataOffset + 2;
                    const aIdx = dataOffset + 3;
                    const r = originalImage.data[rIdx];
                    const g = originalImage.data[gIdx];
                    const b = originalImage.data[bIdx];

                    // Apply noise value per channel
                    const noiseVal = Random.noise3D(x, y, time * noiseSpeed, noiseFreq);
                    modifiedImage.data[rIdx] = r - noiseVal * noiseDepth[0];
                    modifiedImage.data[gIdx] = g - noiseVal * noiseDepth[1];
                    modifiedImage.data[bIdx] = b - noiseVal * noiseDepth[2];
                    modifiedImage.data[aIdx] = 255;
                }
            }
            context.putImageData(modifiedImage, 0, 0);
            */
        };
    };
}