var API = require('./api/index');
var config = require('./config');

var api = new API({
  api_endpoint: config.api,
  authorization_endpoint: config.oauth2,
  use_authorization_header: true,
  client_id: config.clientId,
  secret: config.secret
})

module.exports = api;