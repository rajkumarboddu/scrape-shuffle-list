process.env.NODE_ENV = 'test';

const expect = require('expect');
const request = require('supertest');
const req = require('request');
const fs = require('fs');

const {app, port, host} = require('./app');
const {origin_img_path, shuffle_img_path} = require('./images');

describe('Shuffle images', () => {

	it('should shuffle the scraped images', (done) => {
		request(app)
		    .get('/shuffle_images')
		    .expect(200)
		    .expect((res) => {
		    	expect(res.text).toEqual('Images have been shuffled successfully.');
				expect(fs.readdirSync(origin_img_path).length).toEqual(fs.readdirSync(shuffle_img_path).length);
		    })
		    .end(done);
	});

});

describe('List images on a web page', () => {

	it('should show the web page with shuffled images', (done) => {
		req.get({
	    	url: `http://${host}/`,
	    	time: true
	    })
	    .on('response', (response) => {
	    	console.log(`    Response Time : ${response.request.timings.response}`);
	        expect(response.statusCode).toEqual(200);
	        done();
	      })
		.on('error', (err) => {
		    done(err);
		 });
	});

});