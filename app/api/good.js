var Collection = require('./collection');

var Goods = function(api) {
    this.api = api;
    this.collection = 'goods';
};

Goods.prototype = new Collection();

module.exports = Goods;