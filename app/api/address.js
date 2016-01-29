var Collection = require('./collection');

var Addresses = function(api) {
    this.api = api;
    this.collection = 'addresses';
};

Addresses.prototype = new Collection();

module.exports = Addresses;
