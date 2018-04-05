const path = require('path');

const env = process.env.NODE_ENV || 'development';
const host = '127.0.0.1';
const port = process.env.PORT || 3000;
const query_string = 'nature';
const images_max_limit = 200;
const public_path = path.join(__dirname, '/public');
const origin_images_dir_name = 'origin_images';
const active_images_dir_name = 'active_images';
const bing_img_search_key = '0deab592cb7c417ba393b107b990bee5';

module.exports = {env, host, port, query_string, images_max_limit, public_path, origin_images_dir_name, active_images_dir_name};