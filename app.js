const express = require('express');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));

const {Images} = require('./images');
const {env, host, port, query_string, images_max_limit} = require('./config');
let images = new Images();

// skip scraping in test env
if(env !== 'test') {
	images.scrapeImages(query_string, images_max_limit);
}

// dynamically generate web page with the images from active_images directory
app.get('/', function(req, res) {
	images.getActiveImages()
	.then((images) => {
		res.status(200).render('index', {images});
	})
	.catch((err) => {
		res.status(500).send('Something went wrong!');
		// res.send(err);
	});
});

// REST API to shuffle images by creating symbolic links to the images from origin_images directory
app.get('/shuffle_images', function(req, res) {
	images.shuffle()
	.then(() => {
		res.status(200).send('Images have been shuffled successfully.');
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send('Something went wrong!');
		// res.send(err);
	});
});

app.listen(port, host, function() {
	console.log(`Server started on http://${host}:${port}\n\n`);
});

module.exports = {app, port, host};