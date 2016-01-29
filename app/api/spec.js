var Collection = require('./collection');

var Specs = function(api) {
    this.api = api;
    this.collection = 'specs';
};

Specs.prototype = new Collection();

module.exports = Specs;