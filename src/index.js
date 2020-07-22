import Post from '@app/post';
import * as $ from 'jquery';
import './styles/styles.scss';

import vueLogo from './assets/img/vue-png.png';
// import json from './assets/json';
// import xml from './assets/data.xml';
// import csv from './assets/file.csv';


const post = new Post('Webpack post title', vueLogo);
$('pre').html(post.toString());

// console.log('File: index.js, Line: 3, post.toString()():', post.toString());
// console.log('JSON:', json);
// console.log('XML', xml);
// console.log('csv', csv);

async function start() {
  await Promise.resolve('async is working!');
}

start().then(console.log('async is working!'));

class User {
  static id = Date.now();
}

console.log('User id:', User.id);
