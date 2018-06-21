const generateCovers = require('../index');

// Async
generateCovers('.', {keepOpen: true, headless: true}, [
    '0ad401c67a2d28fced849ee1bb76e7391b93eb12ed849ea'
]).then(result => console.log(result.status));