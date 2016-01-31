var Collection = require('./collection'), 
    Modules = require('./module'), 
    Fragments = require('./fragment'),
    Goods = require('./good'),
    Users = require('./user'),
    Orders = require('./order'),
    Addresses = require('./address'), 
    Carts = require('./cart'),
    Stores = require('./store'),
    Coupons = require('./coupon'), 
    Cats = require('./cat'), 
    Specs = require('./spec');

var api = function(api_endpoint, options) {
    options = options || {};
    this.api_endpoint = api_endpoint || options.api_endpoint;
    this.authorization_endpoint = options.authorization_endpoint || null;
    this.use_authorization_header = options.use_authorization_header || true;

    this.token = options.token || null;
    this.scopes = options.scopes || null;
    this.redirect_uri = options.redirect_uri || null;
    this.client_id = options.client_id || 'reactnative';
    this.response_type = options.response_type || 'token';
    this.goods = new Goods(this);
    this.users = new Users(this);
    this.orders = new Orders(this);
    this.addresses = new Addresses(this);
    this.carts = new Carts(this);
    this.stores = new Stores(this);
    this.coupons = new Coupons(this);
    this.cats = new Cats(this);
    this.specs = new Specs(this);

    this.fragments = new Fragments(this);
    this.modules = new Modules(this);

    this.initialize();
};

var makeErrorMessageFromResponse = function(res) {
    var response_body = res.body;
    if (typeof response_body !== 'string') {
        try {
            response_body = JSON.stringify(response_body);
        } catch (e) {
            /* eat it */
        }
    }
    return 'Status: ' + res.status_code + '. Response: ' + response_body;
};
var makeResponseError = function(err, res) {
    if (!err) {
        err = new Error(makeErrorMessageFromResponse(res));
    }
    err.status_code = res ? res.status_code : 0;
    return err;
};
api.prototype.initialize = function() {
    /* faux-constructor to use as an extension point for derived clients */
};
api.prototype.initializeGenericCollections = function() {
    var self = this;
    generic_collections.forEach(function(collection_name) {
        var collection = new Collection();
        collection.collection = collection_name;
        collection.api = self;
        self[collection_name] = collection;
    });
};
api.prototype.makeAuthorizationHeader = function() {
    return 'bearer ' + this.token;
};
api.prototype.addAuthorizationHeaderToOptions = function(options) {
    options.headers['Authorization'] = this.makeAuthorizationHeader();
};
api.prototype.normalizeOptions = function(options) {
    options = options || {};
    options.headers = options.headers || {};
    options.global = typeof options.global === 'undefined' ? true : options.global;
    if (this.token && options.use_authorization_header) {
        this.addAuthorizationHeaderToOptions(options);
    }
    return options;
};
api.prototype.getAuthorizationEndpoint = function(done) {
    var self = this;
    if (this.authorization_endpoint) {
        //setTimeout(function() {
        done(null, self.authorization_endpoint)
        //}, 1);
    } else {
        this.get('/info', {
            status_code: 200
        }, function(err, res) {
            if (err) {
                return done(err);
            }
            self.authorization_endpoint = res.body.authorization_endpoint;
            done(null, self.authorization_endpoint);
        });
    }
};
api.prototype.authorize = function(options, res, done) {
    if (typeof window !== 'undefined') {
        this.authorizeBrowser(options, res, done);
    } else {
        this.authorizeNodejs(options, res, done);
    }
};
api.prototype.authorizeBrowser = function(options, res, done) {
    if (this.authorizing) {
        return;
    }
    var self = this;
    this.token = null;
    this.authorizing = true;
    // If response_type is 'code' then assume redirect_uri points to a backend that will handle the authorization
    // grant OAuth2 flow on behalf of the browser client. Typically used to avoid exposing the OAuth2 token to
    // the browser (e.g. backend will issue a session cookie etc. instead of raw token).
    if (this.response_type === 'code') {
        window.location = this.redirect_uri;
    } else {
        this.getAuthorizationEndpoint(function(err, authorization_endpoint) {
            var oauth_url = authorization_endpoint + '/oauth/authorize?' 
                        + 'response_type=' + encodeURIComponent(self.response_type) + '&' 
                        + 'client_id=' + encodeURIComponent(self.client_id) + '&' 
                        + 'redirect_uri=' + encodeURIComponent(self.redirect_uri);
            if (self.scopes) {
                oauth_url = oauth_url + '&scope=' + encodeURIComponent(self.scopes);
            }
            window.location = oauth_url;
        });
    }
};

api.prototype.authorizeNodejs = function (options, res, done) {

   /**
    * 1. first, trigger a refresh token attempt 
    * 2. then try to re-authenticate using client credentials
    * 3. report 401 error to user
    */
    var self = this;
    //如果是access_token过期导致
    this.getAuthorizationEndpoint(function(err, authorization_endpoint) {
        var oauth_url = authorization_endpoint + '/oauth/token?';
        var bearer = 'czZCaGRSa3F0MzpnWDFmQmF0M2JW';
        self.getAccessToken({url: oauth_url, username: '15824121675', password:'123456'}, function(response){
            //保存用户新的 refresh_token 和 access_token
            //使用新的 access_token 重试上一次请求，成功后返回正确的结果给用户
            //如果仍然失败，返回失败错误信息给用户
            var fetchOptions = {
              method:  options.verb,
              headers: options.headers,
              body: JSON.stringify(options.data)
            };
            fetch(url, fetchOptions)
                .then((response) => response.text())
                .then((responseText) => {
                    if (responseText.code === 401) {
                        done && done(new Error(makeErrorMessageFromResponse(responseText)), responseText);
                    } else {
                        done && done(null, responseText);
                    }
                }).done();
        })
    })
};


api.prototype.processResponse = function(options, res, done) {

    if (res.code === 401 && !options.ignore_unauthorized && typeof window !== 'undefined') {
        return this.authorizeBrowser();
    }
    if (res.code === 401 && !options.ignore_unauthorized && typeof window === 'undefined') {
        return this.authorizeNodejs(options, res, done);
    }
    return done(res);  
};

api.prototype.marshalRequest = function(url, options, done) {
    /* this is effectively a no-op implementation. derived clients can use it to modify the request. */
    var self = this;
    //setTimeout(function() {
    done.call(self, null, url, options);
    //}, 1);
};
api.prototype.executeRequest = function(path, options, done) {
    // Allow the special case where api components may need to talk to the UAA with it's own host.
    var prepend_host = true;
    if (path.indexOf('http') !== -1) {
        prepend_host = false;
    }
    var self = this;
    this.marshalRequest(path, options, function(err, path, options) {
        if (err) { return done(err); }

        var url = (prepend_host ? self.api_endpoint : '') + path + (options.query ? options.query : '');

        /* judge global and fetch API is avaliable**/
        if ( global && typeof fetch === 'function') {
            var fetchOptions = {
              method:  options.verb,
              headers: options.headers,
              body: JSON.stringify(options.data)
            };
            fetch(url, fetchOptions)
                .then((response) => response.text())
                .then((responseText) => {
                    self.processResponse(options, responseText, done);
                }).done();
        } else if ( window && typeof window === 'object' ) {
            $.ajax({
                url: url,
                type: options.verb,
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(options.data),
                success: function(res) {
                    self.processResponse(options, res, done);
                }
            })
        }
    });
};

api.prototype.get = function(path, options, done) {
    options = this.normalizeOptions(options);
    options.verb = 'GET';
    options.path = path;

    this.executeRequest(path, options, done);
};
api.prototype.del = function(path, options, done) {
    options = this.normalizeOptions(options);
    options.verb = 'DELETE';
    options.path = path;

    this.executeRequest(path, options, done);
};
api.prototype.put = function(path, options, done) {
    options = this.normalizeOptions(options);
    options.verb = 'PUT';
    options.path = path;

    this.executeRequest(path, options, done);
};
api.prototype.post = function(path, options, done) {
    options = this.normalizeOptions(options);
    options.verb = 'POST';
    options.path = path;

    this.executeRequest(path, options, done);
};

api.prototype.getInfo = function(){

}

/** HTTPS **/
api.prototype.getAccessToken = function(credentials, done){
    credentials = credentials || {};
    //var bearer = config.clientId + ':' + apiSecret;
    //bearer = new Buffer(bearer).toString('base64'); 
    var bearer = 'czZCaGRSa3F0MzpnWDFmQmF0M2JW';

    var fetchOptions = {
        method:  'POST',
        headers: {
            'authorization': 'Basic ' + bearer,
            'Accept': 'application/json',
            'contentType': 'application/x-www-form-urlencoded'
        },
        body: 'username=' + credentials.username +  '&password=' + credentials.password + '&grant_type=password'
    };
    
    var oauth_url = 'http://oauth2.ttjinhuo.com' + '/oauth/token?';
    console.log(oauth_url)
    fetch(oauth_url, fetchOptions)
        .then((response) => response.json())
        .then((responseText) => {
            console.log(responseText)
            done(responseText);
        }).done();

    
}

module.exports = api;

