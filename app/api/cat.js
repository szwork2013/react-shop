var Collection = require('./collection');

var Cats = function(api) {
    this.api = api;
    this.collection = 'cats';
};

Cats.prototype = new Collection();

module.exports = Cats;
