import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';
import Util from './Base/Util.js';

export default class NoSignal extends Sketch {
    name = 'No Signal';
    type = SketchType.Canvas;
    date = new Date("8/14/2022");
    description = `
        A "no signal" graphic, inspired by VCRs and other classic image displays.
    `;

    params = {
        colorCount: new FloatParam('Color Count', 7, 1, 32),
        bwCount: new FloatParam('B&W Count', 32, 1, 64),
        displayText: new BoolParam('Display Text', true)
    };

    settings = {
        animate: true
    }
    
    sketchFn = ({}) => {
        const barSize = 0.15;
        const colorPercentage = 0.85;
        const speed = 0.1;

        return ({ context, width, height, time }) => {
            context.clearRect(0, 0, width, height);
            const timeValue = time * speed;

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
                const hue = (barIndex / colorNumBars + timeValue) % 1;
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
                const value = Util.triangle(timeValue - barIndex / bwNumBars + 2);
                context.fillStyle = Util.hsl(0, 0, value);
                context.fillRect(bwBarWidth * barIndex, colorBarHeight, currentBarWidth, bwBarHeight);
            }

            // Horizontal stripe across the screen
            context.fillStyle = '#000';
            const barHeight = height * barSize;
            context.fillRect(0, height/2 - barHeight/2, width, barHeight);

            // "No Signal" text
            if (this.params.displayText.value) {
                context.fillStyle = '#FFF';
                context.font = "56px monospace";
                context.textAlign = "center";
                context.textBaseline = 'middle';
                context.fillText("NO SIGNAL", width/2, height/2);
            }
        };
    };
}