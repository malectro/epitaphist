(function () {

  var root = this;

  var App;
  if (typeof exports !== 'undefined') {
    App = global.UX = exports;
  } else {
    App = root.App = {};
  }

  var Backbone = root.Backbone;
  if (!Backbone && (typeof require !== 'undefined')) {
    Backbone = global.Backbone = require('backbone');
  }

  App.View = {};
  App.Model = {};
  App.List = {};


  App.View.App = Backbone.View.extend({

    initialize: function () {
      console.log('initialized main view');
    }

  });

}).call(this);

