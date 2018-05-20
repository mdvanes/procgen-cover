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

async function sendConfigsToBrowser(imgPath, keepOpen, headless, configs) {
    // Set up browser and page.
    const browser = await puppeteer.launch({headless});
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    // console.log('  *** part 1', configs);
    for(let config of configs) {
        await page.goto(`http://localhost:${port}?${config}`);
        await page.waitForSelector('canvas');

        const generatedImage = await page.$('canvas');
        await generatedImage.screenshot({
            path: `${imgPath}/${config}.png`,
            // omitBackground: true,
        });
        console.log(`generated ${config}.png`);
    }

    await browser.close();

    // Needed because the server keeps the process running
    if(!keepOpen) {
        await process.exit(1);
    }
}

module.exports = function convert(imgPath, keepOpen, headless, configs) {
    startServer();
    sendConfigsToBrowser(imgPath, keepOpen, headless, configs);
}
