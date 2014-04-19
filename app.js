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
  this.setUpAuth();
};


// auth setup
App.setUpAuth = function () {

  // user methods
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Models.User.findById(id, done);
  });

  // initialize twitter authentication via passport.
  passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: '/auth/twitter/callback'
    },
    function (token, tokenSecret, twitterUser, done) {
      Models.User.findByTwitterId(twitterUser.id, function (err, user) {
        if (err) {
          // Error handling.
          return done(err);
        }
        if (!user) {
          // User with this twitter Id doesn't exist.
          user = addUser(twitterUser);
        }

        user.generateToken(twitterUser, function (error) {
          done(null, user);
        });
      });
    }
  ));

  // Set up session storage and cookieParser.
  app.use(express.bodyParser())
     .use(express.cookieParser('jfoielnflcikdieflsli1383'))
     .use(express.session())
     .use(passport.initialize())
     .use(passport.session());
};


// middleware
App.middleware = function () {

  // attempt to recover user from auth_token
  app.use(function (req, res, next) {
    if (!req.user && req.cookies.auth_token) {
      var tokenData = JSON.parse(req.cookies.auth_token);

      Models.User.authWithParams(tokenData, function (error, user) {
        if (user) {
          req.user = user;
          req.session.auth = req.session.auth || {};
          req.session.auth.userId = user.id;
          req.session.auth.loggedIn = true;
        }

        res.clearCookie('auth_token');

        next();
      });
    } else {
      next();
    }
  });

  // clean up cookies for logged in users
  app.use(function (req, res, next) {
    if (req.user) {
      if (req.cookies.auth_token) {
        var tokenData = JSON.parse(req.cookies.auth_token);
        if (tokenData.token !== req.user.token) {
          req.cookies.auth_token = null;
        }
      }

      if (!req.cookies.auth_token) {
        res.cookie('auth_token', req.user.tokenParams(), {
          expires: new Date(Date.now() + (Models.User.TOKEN_EXPIRE_TIME - 0)),
          path: '/'
        });
      }
    }
    next();
  });
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

