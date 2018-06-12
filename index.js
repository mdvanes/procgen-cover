// https://intoli.com/blog/saving-images/

const path = require('path');
const puppeteer = require('puppeteer');
const webp = require('webp-converter');
let server = require('node-http-server');
const port = 50822;

function startServer() {
    // Serve the HTML that will generate the cover with WebGL
    server.deploy(
        {
            port: port,
            root: path.resolve(__dirname) + '/public/'
        }
    );
}

function cwebpPromise(input, output, quality) {
    return new Promise((resolve, reject) => {
        webp.cwebp(input, output, `-q ${quality}`, status => {
            if(status.indexOf('100') === 0) {
                resolve();
            } else {
                reject(`failed with status ${status}`);
            }
        });    
    });
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
        } else if(options.type === 'webp') {
            extension = 'jpg';
            puppeteerOptions.type = 'jpeg';
            puppeteerOptions.quality = 100;
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

        if(options.type === 'webp') {
            try {
                await cwebpPromise(puppeteerOptions.path, `${imgPath}/${config}.webp`, 80);
                console.log(`Generated ${imgPath}/${config}.webp`);
            } catch(err) {
                console.error('err', err);
            }
        }
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
