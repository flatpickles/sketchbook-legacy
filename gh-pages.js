let ghpages = require('gh-pages');

ghpages.publish(
    'public',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/flatpickles/sketchbook.git',
    },
    () => {
        console.log('Deploy Complete!')
    }
)