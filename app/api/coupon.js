var Collection = require('./collection');

var Coupons = function(api) {
    this.api = api;
    this.collection = 'coupons';
};

Coupons.prototype = new Collection();

module.exports = Coupons;
