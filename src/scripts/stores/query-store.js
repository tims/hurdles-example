var _ = require('lodash');
var Bacon = require('baconjs');

var API_HOST = 'http://localhost:3000/';

function get(path, data) {
  return new Promise(function(resolve, reject){
    $.ajax({
      url: API_HOST + path,
      type: 'get',
      contentType: 'application/json',
      data: data,
      success: function(response) {
        resolve(response);
      },
      error: reject
    });
  });
}

var hurdles = require('hurdles')({
  posts: function(shape, queryParams) {
    return get('posts', {s:shape, q:queryParams});
  },
  user: function(shape, queryParams) {
    return get('user', {s:shape, q:queryParams});
  },
  tags: function(shape, queryParams) {
    return get('tags', {s:shape, q:queryParams});
  }
});

var stream = new Bacon.Bus();
var property = stream.toProperty({});
var _query;

function refresh() {
  hurdles.run(_query).then(function (output) {
    console.log('Query', JSON.stringify(_query, null, " "));
    stream.push(output);
    console.log('Output', JSON.stringify(output, null, " "));
  });
}

module.exports = {
  subscribeToQuery: function (query, callback) {
    _query = query;
    var unsubscribe = property.onValue(function (output) {
      callback(output);
    });
    refresh();
    return unsubscribe;
  }
};

