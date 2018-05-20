// https://intoli.com/blog/saving-images/

const puppeteer = require('puppeteer');
const server = require('node-http-server');

function startServer() {
  // Serve the HTML that will generate the cover with WebGL
  server.deploy(
    {
        port:8082,
        root:'./public/'
    }
  );
}

async function sendConfigsToBrowser(configs) {
  // Set up browser and page.
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to this blog post and wait a bit.
  //await page.goto('https://intoli.com/blog/saving-images/');
  //await page.waitForSelector('#svg');

  // Select the #svg img element and save the screenshot.
  /*const svgImage = await page.$('#svg');
  await svgImage.screenshot({
    path: 'logo-screenshot.png',
    omitBackground: true,
  });*/
  //console.log('part 1');

  for(let config of configs) {
    await page.goto(`http://localhost:8082?${config}`);
    await page.waitForSelector('canvas');
  
    const generatedImage = await page.$('canvas');
    await generatedImage.screenshot({
      path: `${config}.png`,
      // omitBackground: true,
    });
    console.log(`generated ${config}.png`);
  }

  await browser.close();

  // Needed because the server keeps the process running
  await process.exit(1);  
}

// // Capture the generated image to a PNG
// (async () => {
//   // Set up browser and page.
//   const browser = await puppeteer.launch({headless: true});
//   const page = await browser.newPage();
//   page.setViewport({ width: 1280, height: 926 });

//   // Navigate to this blog post and wait a bit.
//   //await page.goto('https://intoli.com/blog/saving-images/');
//   //await page.waitForSelector('#svg');

//   // Select the #svg img element and save the screenshot.
//   /*const svgImage = await page.$('#svg');
//   await svgImage.screenshot({
//     path: 'logo-screenshot.png',
//     omitBackground: true,
//   });*/
//   //console.log('part 1');

//   await page.goto('http://localhost:8082?fad4e1c67a2d28fced849ee1bb76e7391b93eb12');
//   await page.waitForSelector('canvas');

//   const generatedImage = await page.$('canvas');
//   await generatedImage.screenshot({
//     path: 'cover.png',
//     // omitBackground: true,
//   });
//   //console.log('part 2');

//   await browser.close();

//   // Needed because the server keeps the process running
//   await process.exit(1);
// })();

module.exports = function convert(configs) {
  startServer();
  sendConfigsToBrowser(configs);
}
