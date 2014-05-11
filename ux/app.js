(function () {

  var root = this;

  var UX;
  if (typeof exports !== 'undefined') {
    UX = global.UX = exports;
  } else {
    UX = root.UX = {};
  }

  var Backbone = root.Backbone;
  if (!Backbone && (typeof require !== 'undefined')) {
    Backbone = global.Backbone = require('backbone');
  }

  UX.View = {};
  UX.Model = {};
  UX.List = {};


  UX.View.App = Backbone.View.extend({

    initialize: function (options) {
      this.user = new UX.Model.User(options.user);

      if (this.user.id) {

      }

      console.log('initialized main view');
    }

  });

  UX.init = function () {
    UX.app = new UX.View.App(UX.env);
  };

  require([
    'ux/models/user',
    'ux/models/epitaph'
  ], false, UX.init);

}).call(this);

