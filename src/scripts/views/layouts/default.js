'use strict';

var React = require('react');
var site = require('../../site');

module.exports = React.createClass({
  componentWillMount: function () {
  },
  render: function () {
    return <div id="layout">
      <div>
        <h1>Hurdles Example</h1>
      </div>
      {this.props.children}
    </div>;
  }
});
