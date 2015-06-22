'use strict';

var express = require('express');
var http = require('http');
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser');
var moment = require('moment');
var _ = require('lodash');
var chance = require('chance')();

var schema = require('./schema');
schema.init();
var knex = schema.db;

var app = express();
app
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }));

var always200 = function (req, res) {
  res.send('OK');
};

var always400 = function (req, res) {
  setTimeout(function () {
    res.status(400);
    res.send({message: 'Not OK!'});
  }, 0);
};

function handleResponse(promise, res) {
  promise.then(function (output) {
    console.log('OUTPUT', JSON.stringify(output));
    res.send(output);
  }).catch(function (e) {
    console.error('error', e.stack);
    res.status(400);
    res.send(e.message + '\n');
  });
}

app.post('/', function (req, res) {
  var query = req.body;
  console.log('QUERY', query);
  handleResponse(hurdles.run(query), res);
});

app.get('/', function (req, res) {
  console.log('/', JSON.stringify(req.query));
  var query = {};
  if (req.query.q) {
    query = JSON.parse(req.query.q);
  }
  console.log('QUERY', query);
  handleResponse(hurdles.run(query), res);
});


function getFirst(table, where) {
  return knex(table).select('*').where(where).first();
}

function getAll(table, where) {
  return knex(table).select('*').where(where);
}

function insert(table, data) {
  return knex(table).insert(data).then(function (ids) {
    return {id: ids[0]};
  });
}

app.get('/tags', function (req, res) {
  var post_id = req.query.q.post_id || (req.query.q.post || {}).id || (req.query.q.posts || {}).id;
  handleResponse(getAll('tags', {post_id: post_id}), res);
});

app.get('/posts', function (req, res) {
  handleResponse(getAll('posts', {user_id: req.query.q.user_id}), res);
});

app.get('/post', function (req, res) {
  handleResponse(getFirst('posts', {id: req.query.q.id}), res);
});

app.get('/user', function (req, res) {
  var promise = knex('users').columnInfo().then(function(info) {
    var columns = _.intersection(_.keys(info), _.keys(req.query.s))
    return getFirst('users', {id: req.query.q.id}).first().then(function (user) {
      return knex('posts').select(columns).where('user_id', user.id).then(function (posts) {
        user.post_count = posts.length;
        return user;
      });
    });
  });

  handleResponse(promise, res);
});

module.exports = http.createServer(app);
