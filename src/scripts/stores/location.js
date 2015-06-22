var dispatcher = require('../dispatcher');
var $ = require('jquery');

var initLocation = {
  route: function () {
    var hash = window.location.hash.match(/#(.*)/);
    var route = (hash ? hash[1] : null) || '/';
    return route;
  }()
};

module.exports = dispatcher.register('location').map(function (payload) {
  console.log('Payload', payload);
  window.location.hash = payload.route;
  return {
    route: payload.route
  };
}).toProperty(initLocation);

$(window).on('hashchange', function () {
  var hash = window.location.hash.match(/#(.*)/);
  var route = (hash ? hash[1] : null) || '/';
  dispatcher.dispatch({type: 'location', route: route});
});