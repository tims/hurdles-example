'use strict';

var React = require('react');

module.exports = React.createClass({

  query: function () {
    return {
      name: null
    }
  },

  render: function () {
    return <div className="post__tag">{this.props.name}</div>
  }
});
