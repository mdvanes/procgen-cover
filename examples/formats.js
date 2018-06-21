const generateCovers = require('../index');

// Formats
generateCovers('.', {
    keepOpen: false,
    headless: true,
    formats: [
        {type: 'jpg', quality: 70},
        {type: 'webp', quality: 70}
    ],
    sizes: [
        {
            width: 1222,
            height: 300
        },
        {
            width: 377,
            height: 162
        }
    ]
}, [
    'ee7398b93eb529004e1c67a2d28fced849ee1bb76e7391b'
]);
