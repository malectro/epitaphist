var _ = require(__dirname + '/../wonderscore.js');
var mongoose = require('mongoose');


var Epitaph = exports;


var Schema = Epitaph.Schema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: String,
  x: Number,
  y: Number
});

