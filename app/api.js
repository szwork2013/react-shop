var API = require('./api/index');
var config = require('./config');

var api = new API({
  api_endpoint: config.api,
  authorization_endpoint: config.oauth2,
  use_authorization_header: true,
  client_id: config.clientId,
  token: '5a504e6357c56ee0c11e4d26f84a5863981bdfa1',
  secret: config.secret
})

module.exports = api;