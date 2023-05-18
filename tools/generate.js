const {generateTemplateFiles} = require('generate-template-files');

generateTemplateFiles([
    {
        option: 'Plotter Project',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/plotter/',
        },
        stringReplacers: ['__name__'],
        output: {
            path: './src/Sketches/Projects/__name__/',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {},
    },
    {
        option: 'Shader Project',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/shader/',
        },
        stringReplacers: ['__name__'],
        output: {
            path: './src/Sketches/Projects/__name__/',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {},
    },
    {
        option: 'Canvas Project',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/canvas/',
        },
        stringReplacers: ['__name__'],
        output: {
            path: './src/Sketches/Projects/__name__/',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {},
    }
]);
