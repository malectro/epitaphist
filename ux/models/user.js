(function () {

  var User = UX.Model.User = Backbone.Model.extend({

    idAttribute: '_id'

  });

  var Users = UX.List.User = Backbone.Collection.extend({

  });

}).call(this);

