const generateCovers = require('./index');

// Sync
generateCovers('.', {keepOpen: false, headless: true}, [
    '0ad401c67a2d28fced849ee1bb76e7391b93eb12ed849ea',
    'fad4f1c67a2d28fced849ee1bb76e7391b93eb12ed849ea',
    '3e7398b93eb529004e1c67a2d28fced849ee1bb76e7391b',
    '6ad4e1c67a2d28fced849ee1bb76e7391b93eb12ed849ea',
    '9e7398b93eb529004e1c67a2d28fced849ee1bb76e7391b',
    'cad4e1c67a2d28fced849ee1bb76e7391b93eb12ed849ea',
    'ee7398b93eb529004e1c67a2d28fced849ee1bb76e7391b'
]);

// Formats
// generateCovers('.', {
//     keepOpen: false,
//     headless: true,
//     formats: [
//         {type: 'jpg', quality: 70},
//         {type: 'webp', quality: 70}
//     ],
//     sizes: [
//         {
//             width: 1222,
//             height: 300
//         },
//         {
//             width: 377,
//             height: 162
//         }
//     ]
// }, [
//     'ee7398b93eb529004e1c67a2d28fced849ee1bb76e7391b'
// ]);

// Async
// generateCovers('.', {keepOpen: true, headless: true}, [
//     '0ad401c67a2d28fced849ee1bb76e7391b93eb12ed849ea'
// ]).then(result => console.log(result.status));