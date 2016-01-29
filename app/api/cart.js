var Collection = require('./collection');

var Carts = function(api) {
    this.api = api;
    this.collection = 'carts';
};

Carts.prototype = new Collection();

module.exports = Carts;
