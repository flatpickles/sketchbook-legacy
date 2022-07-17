export default class Sketch {
    name = "Unnamed Sketch";
    params = {};
    settings = {
        scaleToView: true,
        dimensions: [ 1280, 1280 ],
        // animate: true,
        // duration: Infinity
    };
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, width, height);
        }
    };
}

