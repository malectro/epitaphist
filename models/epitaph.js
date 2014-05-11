var _ = require(__dirname + '/../util/wonderscore.js');
var mongoose = require('mongoose');


var Epitaph = exports;


var Schema = Epitaph.Schema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: String,
  x: Number,
  y: Number
});

Schema.index({user: 1}, {unique: true});

