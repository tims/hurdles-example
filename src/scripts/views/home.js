'use strict';

var React = require('react');
var _ = require('lodash');
var moment = require('moment');

var PostList = require('./postlist');

var queryStore = require('../stores/query-store');

module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },

  componentDidMount: function () {
    var self = this;
    this.unsubscribe = queryStore.subscribeToQuery(this.query(), function (output) {
      self.setState(output);
    });
  },

  componentWillUnmount: function () {
    this.unsubscribe();
  },

  query: function () {
    return {
      'user()': {_: {id: 1}, name:null, post_count: null},
      'postlist': PostList.prototype.query({user_id: 1})
    };
  },

  render: function () {
    var user = this.state.user || {};

    return <div>
      <h2>{user.post_count} posts by {user.name}</h2>
      <PostList {...this.state.postlist}/>
    </div>
  }
});
