'use strict';

var Bacon = require('baconjs');
var _ = require('lodash');
var streams = {};


function newBus(type) {
  var b = new Bacon.Bus();
  b.onValue(function(e) {
    console.log(type, 'bus received event', e);
  });
  return b;
}

function bus(type) {
  streams[type] = streams[type] || newBus(type);
  return streams[type];
}

function register(type, dependencies) {
  var stream = bus(type);

  if (!_.isEmpty()) {
    var depStreams = _.map(dependencies, bus);
    var notify = _.reduce(depStreams, function (stream, depStream) {
      return stream.merge(depStream);
    }, new Bacon.Bus()).map(function () {
      return {
        type: type,
        reload: true
      };
    });
    var unregister = stream.plug(notify);
  }
  return stream;
  // TODO unregister type.
}

function unregister(key) {

}

function dispatch(action) {
  if (!streams[action.type]) {
    console.log('no registered streams for type', action.type, action);
  } else {
    console.log('dispatching', action);
    streams[action.type].push(action);
  }
}

function subscribe(type, callback) {
  if (!streams[type]) {
    console.log('no registered streams for type', type);
  } else {
    console.log('subscribing to', type);
    return streams[type].onValue(callback);
  }
};

module.exports = {
  register: register,
  dispatch: dispatch,
  subscribe: subscribe,
  streams: streams
};