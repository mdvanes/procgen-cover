// https://intoli.com/blog/saving-images/

const path = require('path');
const puppeteer = require('puppeteer');
const webp = require('webp-converter');
const fs = require('fs');
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

async function iterateFormats(imgPath, options, config, page, width) {
    const puppeteerOptions = {};
    let extension = 'png';

    await page.goto(`http://localhost:${port}?${config}`);
    await page.waitForSelector('canvas');

    for(format of options.formats) {
        if(format.type === 'jpg') {
            extension = 'jpg';
            puppeteerOptions.type = 'jpeg';
            if(format.quality) {
                puppeteerOptions.quality = format.quality;
            }
        } else if(format.type === 'webp') {
            extension = 'temp.jpg';
            puppeteerOptions.type = 'jpeg';
            puppeteerOptions.quality = 100;
        }

        const fileName = `${config}-${width}w.${extension}`;
        puppeteerOptions.path = `${imgPath}/${fileName}`;

        const generatedImage = await page.$('canvas');
        await generatedImage.screenshot(puppeteerOptions);
        // await generatedImage.screenshot({
        //     path: `${imgPath}/${config}.png`,
        //     // omitBackground: true,
        // });
        console.log(`Generated ${fileName}`);

        if(format.type === 'webp') {
            try {
                const webpFilename = `${imgPath}/${config}-${width}w.webp`;
                await cwebpPromise(puppeteerOptions.path, webpFilename, format.quality);
                // Delete source
                fs.unlinkSync(puppeteerOptions.path);
                console.log(`Generated ${webpFilename}`);
            } catch(err) {
                console.error('err', err);
            }
        }
    }
}

async function iterateSizesAndFormats(imgPath, options, configs, page) {
    for({width, height} of options.sizes) {
        console.log(`Rendering at ${width}x${height}`);
        page.setViewport({ width, height });

        // console.log('  *** part 1', configs);
        for(let config of configs) {
            await iterateFormats(imgPath, options, config, page, width);
        }
    }
}

async function sendConfigsToBrowser(imgPath, options, configs) {
    // Set up browser and page.
    const browser = await puppeteer.launch({headless: options.headless});
    const page = await browser.newPage();

    try {
        await iterateSizesAndFormats(imgPath, options, configs, page);

        await browser.close();

        // Needed because the server keeps the process running
        if(!options.keepOpen) {
            await process.exit(1);
        }
        return { status: 'ok' };
    } catch(err) {
        console.error(err);
        return { status: 'failed' };
    }
}

module.exports = function convert(imgPath, options, configs) {
    const newOptions = Object.assign({}, {
        // default options
        keepOpen: false,
        headless: true,
        formats: [
            {
                type: 'png',
                quality: 100        
            }
        ],
        sizes: [
            {
                width: 1222,
                height: 300
            }
        ]
    }, options);
    startServer();
    return sendConfigsToBrowser(imgPath, newOptions, configs);
}
