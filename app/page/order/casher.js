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
var Util = require('../../util/util');
var Loading = require('../loading');
var api = require('../../api');

var {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableHighlight,
    ScrollView
} = React;

var Casher = React.createClass({
  getInitialState: function() {
    return {
      user: null,
      cartList:{
        dataSource:new ListView.DataSource({rowHasChanged:(row1,row2) =>row1!==row2})
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
    thiz.setState({
      cartItems: thiz.props.data,
      cartList:{
        dataSource: thizDataSource.cloneWithRows(thiz.props.data)
      },
    });
  },

  createOrder: function(){

  },

  _renderItemList:function(rowData, sectionID, rowID){
    var products = [rowData] //.products;
    var procuctsView = [];
    for(var i = 0; i < products.length; i++){
      var good = products[i].good;
      procuctsView.push(
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: good.default_image }} />
            <View style={{flex:1}}>
              <Text style={{flex:1}}>{good.name}</Text>
              <View style={{flexDirection:'row',alignItems:'flex-end',}}>
                <Text style={{color:'#f28006',flex:1, fontSize: 12}}>{good.market_price} 元</Text>
              </View>
            </View>
          </View>
          <View style={styles.line}/>
        </View>
        );
    };
    return(
      <View>
        {procuctsView}
      </View>
      );
  },

  render: function() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.cartList.dataSource}
          renderRow={this._renderItemList}/>
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

module.exports = Casher;