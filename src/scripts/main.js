'use strict';

var React = require('react');
var $ = require('jquery');
var dispatcher = require('./dispatcher');
var locationStore = require('./stores/location');
var _ = require('lodash');
var Bacon = require('baconjs');
_.assign(window, {$:$, _:_, require: require, Bacon: Bacon});

var routes = {
  '/': require('./views/home'),
  '/examples': require('./views/examples')
};

var Layout = require('./views/layouts/default');

locationStore.onValue(function(location) {
  console.log('location', location);
  var view;
  var View = routes[location.route];
  if (View) {
    view = <View />
  } else {
    view = <div>wat!</div>
  }

  React.render(
    <Layout>{view}</Layout>,
    $('#app').get(0)
  );
});

window.dispatcher = dispatcher;
