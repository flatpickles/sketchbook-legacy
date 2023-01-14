const {generateTemplateFiles} = require('generate-template-files');

generateTemplateFiles([
    {
        option: 'Create Shader',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/',
        },
        stringReplacers: ['__name__'],
        output: {
            path: './src/Sketches/Projects/__name__/',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {},
    }
]);
