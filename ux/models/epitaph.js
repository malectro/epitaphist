(function () {

  var Epitaph = UX.Model.Epitaph = Backbone.Model.extend({

    idAttribute: '_id'

  });

  var Epitaphs = UX.List.Epitaphs = Backbone.Collection.extend({

    model: Epitaph

  });

}).call(this);

