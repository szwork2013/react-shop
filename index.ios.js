/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var store = require('react-native-simple-store');

var Login = require('./app/page/login');
var Index = require('./app/page/index');
var config = require('./app/config');
var aes = require('./app/util/aes');
var API = require('./app/api/index');
var config = require('./app/config')

var api = new API({
  api_endpoint: config.api,
  authorization_endpoint: config.oauth2,
  use_authorization_header: true,
  client_id: config.clientId
})

var {
  AppRegistry,
} = React;

// StatusBarIOS.setStyle('light-content');

var app = React.createClass({
  getInitialState: function() {
    return{
      logined:false,
    };
  },

  componentDidMount: function() {
    store.get('user').then((userdata)=>{
      console.log(userdata);
      this.setState({
        logined:userdata.user_name,
    })});
  },

  _renderLogin:function(){
    return (
        <Login loginResult={(userData)=>this._loginSucc(userData)}/>
      );
  },

  _loginSucc:function(userData){
    store.save('user', userData);
    this.setState({
      logined:true,
    });
  },

  _renderIndex:function(){
    return (
        <Index/>
      );
  },

  render: function() {
    if(this.state.logined){
        return this._renderIndex();
    }else{
        return this._renderLogin();
    }
  },

});

AppRegistry.registerComponent('bqseller', () => app);
