var _ = require(__dirname + '/../wonderscore.js');

var Schema = {};
var Model = exports;

var models = [
  'User'
];

_.each(models, function (model) {
  Schema[model] = require(__dirname + '/' + model.toLowerCase() + '.js').Schema;
});

Model.init = function (db) {
  for (var name in Schema) {
    Model[name] = db.model(name, Schema[name]);
  }
};

