var rp = require('request-promise'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    URL = require('url').URL,
    puppeteer = require('puppeteer'),
    https = require('https'),
    path = require('path')

const args = process.argv.slice(2) //get URL arguments. First 2 arg in Nodejs are process arg

async function downloadWeb(args){
    let requireMetadata = false
    if(args[0] === 'metadata'){
        requireMetadata = true
        args = args.slice(1)
    }
    if(args && args.length > 0){ //dont process if no arguments passed
        let metadata = ''
        try {
            metadata = fs.readFileSync('metadata.json'); //read metadata from json file
        } catch (err){ //if file does not exist, init empty metadata
            metadata = ''
        }
        const scraperPromises = await args.map(async (arg) => {
            if(isValidURL(arg)){ //dont process if not valid url
                const res = await rp(arg) //get html from url
                await downloadAssets(arg)
                let filename = arg.split('://')[1].replace('/','') //process url name to be more readable as filename
                fs.writeFileSync(`${filename}.html`, res)
                if(!requireMetadata){
                    return
                }
                const $ = cheerio.load(res);
                const links = $('a'); //get all links from html
                const images = $('img'); // get all images from html
                let currentDate = new Date().toDateString()
                let lastFetchDate = currentDate
                if(metadata.length > 0){ //if no previous metadata, add current date as last fetched date for URL else get previous fetched date for logging and update with new date
                    metadata = JSON.parse(metadata)
                    if(metadata[arg]){
                        lastFetchDate = metadata[arg]
                    } else {
                        lastFetchDate = currentDate
                    }
                    metadata[arg] = currentDate
                    
                } else {
                    metadata[arg] = currentDate
                    lastFetchDate = currentDate
                }
                
                console.log('site :', filename)
                console.log('num_links : ', links.length)
                console.log('images : ', images.length)
                console.log('last_fetch : ', lastFetchDate)
            }
        })
        await Promise.all(scraperPromises)
        fs.unlinkSync('metadata.json') //delete old metadata file and update with new metadata
        fs.writeFileSync('metadata.json', JSON.stringify(metadata))
    }
}

const download = (url, destination) => new Promise((resolve, reject) => {
    let directoryArray = destination.split('/')
    let filename = directoryArray.pop()
    const directory = directoryArray.join('/')
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory, { recursive: true })
    }
    const file = fs.createWriteStream(path.join(directory, filename)) //write stream to pipe img data to file
  
    https.get(url, response => {
      response.pipe(file)
  
      file.on('finish', () => {
        file.close(resolve(true))
      })
    }).on('error', error => {
      fs.unlink(destination)
  
      reject(error.message)
    })
  })
  
async function downloadAssets(arg) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(arg);

    const images = await page.evaluate(() => Array.from(document.images, e => e.src)) //scrape all images

    for (let i = 0; i < images.length; i++) {
        if(images[i].includes('https') || images[i].includes('http')){
            result = await download(images[i], images[i].replace(arg, ''))
            if (result !== true) {
                console.error(result)
            }
        }
    }
    await browser.close();
}


const isValidURL = (s) => { //function to check if an URL is a valid URL path
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
}

downloadWeb(args).then((res) => { //invoke the main download function
})