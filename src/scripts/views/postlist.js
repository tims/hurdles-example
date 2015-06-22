'use strict';

var _ = require('lodash');
var React = require('react');
var Post = require('./post');


module.exports = React.createClass({
  query: function (queryParams) {
    return {
      'posts[]': _.extend({
        _: {user_id: queryParams.user_id}
      }, Post.prototype.query(queryParams))
    }
  },

  render: function () {
    var posts = _.map(this.props.posts, function (post, i) {
      return <Post key={i} {...post}/>;
    });

    return <div className="posts">
      {posts}
    </div>

  }
});
