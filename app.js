const express = require('express');
const path = require('path');

const {Images} = require('./images');

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));

let images = new Images();
images.scrapeImages('nature', 100);

app.get('/', function(req, res) {
	images.getActiveImages()
	.then((images) => {
		res.render('index', {images});
	})
	.catch((err) => {
		res.send('Something went wrong!');
		// res.send(err);
	});
});

app.get('/shuffle_images', function(req, res) {
	images.shuffle()
	.then(() => {
		res.send('Images have been shuffled successfully.');
	})
	.catch((err) => {
		res.send('Something went wrong!');
		// res.send(err);
	});
});

app.listen(port, function() {
	console.log(`Server started on port ${port}`);
});