'use strict';

var App = {};

// requirements
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var assetManager = require('connect-assetmanager');
var fs = require('fs');

var _ = require(__dirname + '/wonderscore.js');


// constants
if (_.isUndefined(process)) {
  var process = {env: {}};
}
var PORT = process.env.PORT || 3000;
var TITLE = 'Epitaphist';


// app
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/' + TITLE.toLowerCase();
var db = mongoose.createConnection(mongoUri);
var app = express();


// app methods
App.init = function () {

  // use variable namespace for quicker rendering
  _.templateSettings.variable = 't';

  // compile templates
  fs.readdir(__dirname + '/client/tmpl', function (err, files) {
    files.forEach(function (file) {
      fs.readFile(__dirname + '/client/tmpl/' + file, function (err, data) {
        App._tmpls[file.split('.')[0]] = _.template(data.toString());
      });
    });
  });

  app.set('title', TITLE).

    // template engine
    engine('html', App.templateEngine).
    set('view engine', 'html').

    // index folder
    set('views', __dirname + '/client/views').

    // static files
    use('/js', express.static(__dirname + '/client/js')).
    use('/less', express.static(__dirname + '/client/less')).
    use('/img', express.static(__dirname + '/client/img')).

    // set template minifier.
    use('/tmpl', assetManager({
      js: {
        route: /tmpl.js\.*/,
        path: __dirname + '/client/tmpl/',
        dataType: 'javascript',
        files: ['*'],
        preManipulate: {
          '^': function (file, path, index, isLast, callback) {
            var name = path.split('/').pop().split('.')[0];
            callback(null, "Tmpl." + name + " = " + App._tmpls[name].source + ";\n");
          }
        },
        postManipulate: {
          '^': function (file, path, index, isLast, callback) {
            callback(null, 'window.Tmpl=window.Tmpl||{};' + file);
          }
        }
      }
    }), express.static(__dirname + '/client/tmpl'));

  this.routes();
};


// routes
App.routes = function () {

  // home
  app.get('/', function (req, res) {
    res.render('index', {});
  });

};


// templating
App._tmpls = {};

App.templateEngine = function (path, options, callback) {
  var name = path.split('/').pop().split('.')[0];
  callback(null, App._partial(name, options));
};

App._partial = function (name, options) {
  options._partial = App._partial;
  return App._tmpls[name](options);
};


// run server
App.init();
app.listen(PORT);
console.log('Listening on port ' + PORT);

