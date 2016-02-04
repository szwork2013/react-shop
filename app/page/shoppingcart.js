/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-18 14:40:24
 * @version $Id$
 */
'use strict';
var store = require('react-native-simple-store');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var React = require('react-native');
var Util = require('../util/util');
var Global = require('../util/global');
var API = require('../network/api');
var Loading = require('./loading');

var api = require('../api');

var {
  	StyleSheet,
  	View,
    Text,
    Image,
    ListView,
    TouchableHighlight,
    ScrollView
} = React;

var ShoppingCart = React.createClass({
  getInitialState: function() {
    return {
      user: null,
      cartList:{
        dataSource:new ListView.DataSource({rowHasChanged:(row1,row2) =>row1!==row2}),
        loaded:false,
      },
    };
  },

  componentDidMount: function() {
    store.get('user').then((user)=>{
      this.setState({user: user});
      if (user && user.username != 'dummyUser') {
        this._fetchData();
      } else {
        RCTDeviceEventEmitter.emit('user.login', false);
      }
    });
    
  },

  _fetchData:function(){
    var thiz = this;
    var thizDataSource = thiz.state.cartList.dataSource;
    var options = {
        queries: {
          'inline-relation-depth': 1
        }
    };
    api.users.getCartDetail(this.state.user.user_id, options, function (ret){
      if(ret && ret.code == 200 && ret.data.length > 0){
        thiz.setState({
          cartList:{
            dataSource: thizDataSource.cloneWithRows(ret.data),
            loaded:true,
          },
        });
      }
    });
  },

  gotoCasher: function(){
    console.log('去结算')
  },

  _renderCartList:function(rowData, sectionID, rowID){
    var products = [rowData] //.products;
    var procuctsView = [];
    //console.log(products)
    for(var i = 0; i < products.length; i++){
      var good = products[i].good;
      procuctsView.push(
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: good.default_image }} />
            <View style={{flex:1}}>
              <Text style={{flex:1}}>{good.name}</Text>
              <View style={{flexDirection:'row',alignItems:'flex-end',}}>
                <Text style={{color:'#f28006',flex:1, fontSize: 20}}>{good.market_price} 元</Text>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                  <Image style={{height:25,width:25}} source={require("image!ic_goods_reduce")}/>
                  <Text style={{color:'#f28006',paddingLeft:10,paddingRight:10}}>{products[i].amount}</Text>
                  <Image style={{height:25,width:25}} source={require("image!ic_goods_add")}/>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.line}/>
        </View>
        );
    };
    return(
      <View style={{marginBottom:15,backgroundColor:'#ffffff'}}>
        <View style={styles.line}/>
        <View style={{justifyContent:'center',height:45,paddingLeft:15}}>
          <Text style={{color:'#333333'}}>{rowData.good.supplier.name}</Text>
        </View>
        <View style={styles.line}/>
        {procuctsView}
      </View>
      );
  },

  render: function() {
    if(!this.state.cartList.loaded){
        return <Loading loadingtext='正在购物车数据...'/>
    };
    
    return (
      <View style={styles.container}>
        <ListView
          style={{flex: .85, marginBottom:0}}
          dataSource={this.state.cartList.dataSource}
          renderRow={this._renderCartList}/>
        <View style={{flex: .15, borderTopWidth: 1, borderTopColor: '#dadce2', marginTop: 0}}>
          <TouchableHighlight
            underlayColor='#ff3636'
            style={{ justifyContent: 'center',alignItems: 'center',height: 50, backgroundColor:'#ff3636'}}
            onPress={() => this.gotoCasher()}>
            <Text style={{fontSize:18,color:'white'}}>去结算</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#eef0f3',
    paddingBottom:68,
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
    height:90,
    justifyContent: 'center',
  },
  line:{
    backgroundColor:'#eef0f3',
    height:1,
  },
});

module.exports = ShoppingCart;