# WebPageScraper
## How to run
### Option 1 - NodeJS (Local Machine)
1. Install NodeJS (Version 16 and above) from https://nodejs.org/en/download/
2. Go into the root directory and run ```npm install```
3. Run the program with syntax
```node index.js [metadata] [arguments]```
     **metadata**: optional argument to instruct the program to show the metadata of the downloaded websites
        **arguments**: a space separated list of valid website URLs for the program
        Example: 
    1. ```node index.js metadata https://google.com https://autify.com```
    2. ```node index.js https://google.com```
### Option 2 - Docker
1. Go into the root directory. There will be a Dockerfile provided
2. Build the docker image using the Dockerfile. Example docker build command 
```docker build --rm --pull -f "path_to_dockerfile" -t "webpagescraper:latest" "path_to_project_root"```
3. Start the docker container using command
```docker run -d  webpagescraper:latest tail -f /dev/null ```
**PS: the ***tail -f /dev/null*** argument is needed as to keep the container running. Without the argument present, the NodeJS script will fire and close the container as it's just a script without a foreground running process. This is a workaround to keep the container running so that we can access the web page files**
4. There is already a pre set command ```CMD ["node", "index.js", "metadata","https://google.com", "https://autify.com"]``` in the Dockerfile so there would already be some test data but you can also run the program by accessing the container using ```docker exec -it container_name /bin/sh```. You can find the container name by running ```docker ps``` 
5. Once you are in the container, you should be able to run the program using the syntax below 
```node index.js [metadata] [arguments]```
     **metadata**: optional argument to instruct the program to show the metadata of the downloaded websites
        **arguments**: a space separated list of valid website URLs for the program
        Example: 
    1. ```node index.js metadata https://google.com https://autify.com```
    2. ```node index.js https://google.com```

## Plugins Used
1. [cheerio](https://cheerio.js.org/) - JQuery for NodeJS 
2. [request-promise](https://www.npmjs.com/package/request-promise) - Simple request library to get HTML contents 
3. [fs](https://nodejs.org/api/fs.html) - NodeJS built-in file system library to read and write to files
4. [url](https://nodejs.org/api/url.html) - NodeJS built-in URL library. Mainly used for checking whether an URL is valid or not
5. [puppeteer](https://github.com/puppeteer/puppeteer) - Headless JS library to scrape web assets
6. [https](https://nodejs.org/api/https.html) - NodeJS built-in https library used to download web assets
7. [path](https://nodejs.org/api/path.html) - NodeJS built in path library to handle directory recursion for web assets
