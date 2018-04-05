# scrape-shuffle-list
A simple Node app to scrape images, shuffle and list them

## Installation
Use `npm install` command to install dependencies.

## Scrape Images
Use `node app.js` command to start the application and as soon as the application starts `100` images will be automatically scraped using Bing Search API and will be saved in `origin_images` directory.

## Shuffle Images
Access http://localhost:3000/shuffle_images REST API to create symbolic links for the scraped image in `active_images` directory.

## List Images
Access http://localhost:3000/ URL to view the images that will be displayed using the symbolic link files created in `active_images` directory.

## Tests
Run tests using `npm test` command
