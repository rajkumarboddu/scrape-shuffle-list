const path = require('path');
const axios = require('axios');
const fs = require('fs');

const {public_path, origin_images_dir_name, active_images_dir_name, bing_img_search_key} = require('./config');
const origin_img_path = path.join(public_path, `/${origin_images_dir_name}`);
const shuffle_img_path = path.join(public_path, `/${active_images_dir_name}`);

class Images {

	deleteFiles(dir_path, force) {
	  if(fs.existsSync(dir_path)) {
	  	if(force){
	  		fs.readdirSync(dir_path).forEach((file, index) => {
	  		  const cur_path = path.join(dir_path, '/', file);
	  		  fs.unlinkSync(cur_path);
	  		});
	  	}
	  } else{
	  	fs.mkdirSync(dir_path);
	  }
	};

	scrapeImages(query_string, no_of_imgs) {
		this.deleteFiles(origin_img_path);
		/*
		Bing Image Search API
		Endpoint : https://api.cognitive.microsoft.com/bing/v7.0/images
		Key 1 : 0deab592cb7c417ba393b107b990bee5
		Key 2 : c5b73e5f2aff4736ba5af1ae3279bd1e
		*/
		if(fs.readdirSync(origin_img_path).length===0) {
			query_string = encodeURIComponent(query_string);
			let failed_downloads = 0;
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
							// console.log(err);
							failed_downloads++;
							console.log(`${failed_downloads}. Unable to download image from URL: ${img_obj.contentUrl}`);
						})
					});
				} else{
					throw new Error('Unable to connect to server');
				}
			})
			.catch(function(error) {
				// console.log(error);
				console.log('Unable to scrape images');
			});
		}
	}

	shuffle() {
		return new Promise((resolve, reject) => {
			try{
				this.deleteFiles(shuffle_img_path, true);

				fs.readdirSync(origin_img_path).forEach((file, index) => {
					const cur_path = path.join(origin_img_path, '/', file);
					
					if(fs.lstatSync(cur_path).isFile()) {
						const link_path = path.join(shuffle_img_path, '/', parseInt(Math.random()*1000000) + path.extname(file));
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

module.exports = {Images, origin_img_path, shuffle_img_path};