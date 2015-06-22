'use strict';

var React = require('react');
var _ = require('lodash');
var hurdlesFactory = require('hurdles');
var chance = require('chance')();

var examples = [
  {
    query: {
      'user()': {
        id: null,
        name: null,
        post_count: null
      }
    },
    handlers: {
      user: {id: 1, name: "Tim", post_count: 3}
    }
  },
  {
    query: {
      'user()': {
        id: null,
        name: null,
        post_count: null,
        magic_number: 7
      }
    },
    handlers: {
      user: {id: 1, name: "Tim", post_count: 3}
    }
  },
  {
    query: {
      foo: {
        'user()': {
          id: null,
          name: null,

        }
      },
      bar: {
        'user()': {
          post_count: null
        }
      }
    },
    handlers: {
      user: {id: 1, name: "Tim", post_count: 3}
    }
  },
  {
    query: {
      'user()': {
        id: null,
        name: null,
        'posts[]': {
          text: null
        }
      }
    },
    handlers: {
      user: {id: 1, name: "Tim", post_count: 3},
      posts: [{text: 'first'}, {text: 'second'}]
    }
  },
  {
    query: {
      'user()': {
        id: null,
        name: null,
        'posts[]': {
          _: {user: null},
          text: null
        }
      }
    },
    handlers: {
      user: {id: 1, name: "Tim", post_count: 3},
      posts: function(shape, queryParams) {
        if (queryParams.user.id === 1) {
          return Promise.resolve([{text: 'first'}, {text: 'second'}]);
        } else { Promise.reject(':(')}
      }
    }
  },
  {
    query: {
      'tag()': {
        _: {post_id: 1},
        post_id: null,
        name: null
      }
    },
    handlers: {
      tag: function (shape, queryParams) {
        return Promise.resolve({post_id: queryParams.post_id, name: chance.word()});
      },
    }
  },
  {
    query: {
      'posts[]': {
        id: null,
        'tags[]': {
          _: {posts: null},
          post_id: null,
          name: null
        }
      }
    },
    handlers: {
      posts: [{id: 1}, {id: 2}, {id: 3}],
      tags: function (shape, queryParams) {
        return Promise.resolve([
          {post_id: queryParams.posts.id, name: chance.word()},
          {post_id: queryParams.posts.id, name: chance.word()}
        ]);
      },
    }
  }
];


module.exports = React.createClass({
  getInitialState: function () {
    return {examples: examples};
  },

  handleRunExample: function (example) {
    var self = this;
    var handlers = {};
    _.each(example.handlers, function (value, key) {
      if (_.isFunction(value)) {
        handlers[key] = value;
      } else {
        handlers[key] = function () {
          var v = _.cloneDeep(value);
          return Promise.resolve(v)
        };
      }
    });
    var hurdles = hurdlesFactory(handlers);
    hurdles.run(example.query).then(function (output) {
      example.output = output;
      console.log(output);
      self.setState(self.state);
    }).catch(function (e) {
      example.error = e.stack;
      self.setState(self.state);
    });
  },

  render: function () {
    var self = this;
    var rows = _.map(this.state.examples, function (example, i) {
      var input = JSON.stringify(example.query, null, ' ');
      var handler = function () {
        self.handleRunExample(example)
      };

      var handlers = _.map(example.handlers, function (handler, key) {
        if (_.isFunction(handler)) {
          return <pre>
            {key}: {handler.toString()}
          </pre>
        } else {
          return <pre>
            {key}: function() {'{'} return Promise.resolve({JSON.stringify(handler)}); {'}'}
          </pre>
        }
      });
      var error = example.error ? <pre>ERROR: {example.error}</pre> : '';

      return <div>
        <div className="example__handlers">
          <h3>Handlers</h3>
          <pre>{handlers}</pre>
        </div>
        <div key={i} className="example">
          <div className="example__input">
            <h3>Input</h3>
            <pre>{input}</pre>
            <button onClick={handler}>Run</button>
          </div>

          <div className="example__output">
            <h3>Output</h3>
            <pre>{JSON.stringify(example.output, null, ' ')}</pre>
          </div>
        </div>
        {error}
        <br/>
        <br/>
        <br/>
      </div>
    });


    function doThings(input, handlers) {
      // setup
      var hurdles = require('hurdles')(handlers);

      // run a query
      hurdles.run(input).then(function (output) {
        console.log(output);
      });
    }

    return <div>
      <h2>Usage:</h2>
      <pre>{doThings.toString()}</pre>

      {rows}
    </div>
  }
});
