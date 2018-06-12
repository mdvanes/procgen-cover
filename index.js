// https://intoli.com/blog/saving-images/

const path = require('path');
const puppeteer = require('puppeteer');
const port = 50822;
let server = require('node-http-server');

function startServer() {
    // Serve the HTML that will generate the cover with WebGL
    server.deploy(
        {
            port: port,
            root: path.resolve(__dirname) + '/public/'
        }
    );
}

async function sendConfigsToBrowser(imgPath, options, configs) {
    // Set up browser and page.
    const browser = await puppeteer.launch({headless: options.headless});
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    const puppeteerOptions = {};

    // console.log('  *** part 1', configs);
    for(let config of configs) {
        await page.goto(`http://localhost:${port}?${config}`);
        await page.waitForSelector('canvas');

        let extension = 'png';

        if(options.type === 'jpg') {
            extension = 'jpg';
            puppeteerOptions.type = 'jpeg';
            if(options.quality) {
                puppeteerOptions.quality = options.quality;
            }
        }

        const fileName = `${config}.${extension}`
        puppeteerOptions.path = `${imgPath}/${fileName}`;

        const generatedImage = await page.$('canvas');
        await generatedImage.screenshot(puppeteerOptions);
        // await generatedImage.screenshot({
        //     path: `${imgPath}/${config}.png`,
        //     // omitBackground: true,
        // });
        console.log(`Generated ${fileName}`);
    }

    await browser.close();

    // Needed because the server keeps the process running
    if(!options.keepOpen) {
        await process.exit(1);
    }
    return { status: 'ok' };
}

module.exports = function convert(imgPath, options, configs) {
    const newOptions = Object.assign({}, {
        // default options
        keepOpen: false,
        headless: true,
        type: 'png',
        quality: 100
    }, options);
    startServer();
    return sendConfigsToBrowser(imgPath, newOptions, configs);
}
