'use strict';

var _ = require('lodash');
var moment = require('moment');
var React = require('react');
var Remarkable = require('remarkable');

var markdown = new Remarkable('commonmark', {html: false});

var Tag = require('./tag');

module.exports = React.createClass({

  query: function (queryParams) {
    return {
      id: null,
      text: null,
      'user()': {
        _: {id: queryParams.user_id},
        name: null
      },
      'tags[]': _.extend({_: {posts: null}}, Tag.prototype.query())
    }
  },

  render: function () {
    var text;
    if (this.props.text) {
      var innerHtml = {__html: markdown.render(this.props.text)};
      text = <div className="post__text" dangerouslySetInnerHTML={innerHtml}></div>
    }

    var tags = _.map(this.props.tags, function (tag, i) {
      return <Tag key={i} {...tag} />
    });

    return <div className="post">
      <div className="post__tags">
        {tags}
      </div>
      {text}
      <small>by {this.props.user.name}</small>
    </div>

  }
});
