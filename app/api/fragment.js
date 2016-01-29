var Collection = require('./collection');

var Fragments = function(api) {
    this.api = api;
    this.collection = 'fragments';
};

Fragments.prototype = new Collection();

module.exports = Fragments;
