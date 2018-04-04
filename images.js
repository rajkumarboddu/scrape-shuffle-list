const path = require('path');
const axios = require('axios');
const fs = require('fs');

const public_path = path.join(__dirname, '/public');
const origin_img_path = path.join(public_path, '/origin_images');
const shuffle_img_path = path.join(public_path, '/active_images');

const bing_img_search_key = '0deab592cb7c417ba393b107b990bee5';

class Images {

	constructor() {
		this.deleteFiles(origin_img_path);
		this.deleteFiles(shuffle_img_path);
	}

	deleteFiles(dir_path) {
	  if(fs.existsSync(dir_path)) {
	    fs.readdirSync(dir_path).forEach((file, index) => {
	      const cur_path = path.join(dir_path, '/', file);
	      fs.unlinkSync(cur_path);
	    });
	  } else{
	  	fs.mkdirSync(dir_path);
	  }
	};

	scrapeImages(query_string, no_of_imgs) {
		/*
		Bing Image Search API
		Endpoint : https://api.cognitive.microsoft.com/bing/v7.0/images
		Key 1 : 0deab592cb7c417ba393b107b990bee5
		Key 2 : c5b73e5f2aff4736ba5af1ae3279bd1e
		*/
		
		query_string = encodeURIComponent(query_string);

		axios.get(`https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${query_string}&count=${no_of_imgs}`, {
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
						const img_name = path.join(origin_img_path, `/${i}.${img_obj.encodingFormat}`);
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
	}

	shuffle() {
		return new Promise((resolve, reject) => {
			try{
				this.deleteFiles(shuffle_img_path);

				fs.readdirSync(origin_img_path).forEach((file, index) => {
					const cur_path = path.join(origin_img_path, '/', file);
					
					if(fs.lstatSync(cur_path).isFile()) {
						const link_path = path.join(shuffle_img_path, '/', parseInt(Math.random()*1000) + path.extname(file));
						fs.symlinkSync(cur_path, link_path);
					}
				});
				resolve();
			} catch(err){
				reject(err);
			}
		});
	}

	getActiveImages() {
		return new Promise((resolve, reject) => {
			try{
				let images = [];
				fs.readdirSync(shuffle_img_path).forEach((file, index) => {
					const cur_path = path.join(shuffle_img_path, '/', file);
					images.push(`/active_images/${file}`);
				});
				resolve(images);
			} catch(err){
				reject(err);
			}
		});
	}
}

module.exports = {Images};