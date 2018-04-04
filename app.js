const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const port = process.env.PORT || 3000;
const public_path = path.join(__dirname, '/public');
const app = express();

app.set('view engine', 'hbs');
app.use(express.static(public_path));

// Scrape 100 images
const original_img_path = path.join(public_path, '/original_images');
if(!fs.existsSync(original_img_path)) {
	fs.mkdirSync(original_img_path);
}

/*
Bing Image Search API
Endpoint : https://api.cognitive.microsoft.com/bing/v7.0/images
Key 1 : 0deab592cb7c417ba393b107b990bee5
Key 2 : c5b73e5f2aff4736ba5af1ae3279bd1e
*/
const bing_img_search_key = '0deab592cb7c417ba393b107b990bee5';
const query_string = encodeURIComponent('nature');

axios.get(`https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${query_string}&count=1`, {
	headers: {
		'Ocp-Apim-Subscription-Key' : bing_img_search_key
	}
})
.then(function(res) {
	if(res.status === 200) {
		res.data.value.forEach((img_obj, i) => {
			axios.get(img_obj.contentUrl, {
				responseType: 'stream'
			})
			.then((res) => {
				console.log(res.data);
				const img_name = path.join(original_img_path, `/${i}.${img_obj.encodingFormat}`);
				res.data.pipe(fs.createWriteStream(img_name));
			})
			.catch((err) => {
				console.log(err);
			})
		});
	}
})
.catch(function(error) {
	console.log(error);
});

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(port, function() {
	console.log(`Server started on port ${port}`);
});