var Collection = require('./collection');

var Orders = function(api) {
    this.api = api;
    this.collection = 'orders';
};

Orders.prototype = new Collection();

module.exports = Orders;