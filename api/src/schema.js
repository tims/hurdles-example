var _ = require('lodash');
var chance = require('chance')();
var moment = require('moment');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});


var initTables = {
  users: {
    table: function () {
      return knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('name');
        table.timestamps();
      });
    },
    data: function () {
      return knex('users').insert({name: 'Tim'});
    }
  },
  posts: {
    table: function () {
      return knex.schema.createTable('posts', function (table) {
        table.increments();
        table.string('text');
        table.integer('user_id').references('id').inTable('users');
        table.timestamps();
      });
    },
    data: function () {
      return Promise.all([
        knex('posts').insert({user_id: 1, text: 'First!'}),
        knex('posts').insert({user_id: 1, text: 'Second!'}),
        knex('posts').insert({user_id: 1, text: 'Third!'})
      ]);
    }
  },
  tags: {
    table: function () {
      return knex.schema.createTable('tags', function (table) {
        table.increments();
        table.string('name');
        table.integer('post_id').references('id').inTable('posts');
        table.timestamps();
      })
    },
    data: function () {
      var tags = [
        {post_id: 1, name: 'example'},
        {post_id: 1, name: 'hmm'},
        {post_id: 2, name: 'basic'},
        {post_id: 3, name: 'trivial'},
        {post_id: 2, name: 'wat'}
      ];
      return Promise.all(_.map(tags, function(tag) {
        console.log('inserting data', tag);
        return knex('tags').insert(tag);
      }));
    }
  }
};

function init() {
  var dataFuncs = [];
  Promise.all(_.map(initTables, function (initFuncs, tableName) {
    return knex(tableName).catch(function (e) {
      console.error(e);
      console.log('Initialising schema for ' + tableName);
      dataFuncs.push({tableName: tableName, data: initFuncs.data});
      return initFuncs.table()
    })
  })).then(function() {
    Promise.all(_.map(dataFuncs, function(d) {
      console.log('Initialising data for ' + d.tableName);
      return d.data();
    }));
  }).then(function () {
    console.log('done');
  }).catch(function () {
    process.exit();
  }).then(function() {
    _.each(initTables, function(v, tableName) {
      knex(tableName).columnInfo().then(function(info){
        initTables[tableName].columns = _.keys(info);
      });
    });
  });
}
module.exports = {
  init: init,
  db: knex
};

