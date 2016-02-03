/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Styles = require('./style');

var API = require('../../network/api');
var Util = require('../../util/util');
var Global = require('../../util/global');
var Loading = require('../loading');
var Web = require('../web');

//自定义组件
var Slider = require('./slidebanner');
var ADViews = require('./adview');
var BqService = require('./bqservice');
var HotGoods = require('./hotgoods');

var api = require('../../api');

//下拉刷新
var {
  RefresherListView,
  LoadingBarIndicator
} = require('react-native-refresher');

var {
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  TouchableHighlight,
} = React;

var home = React.createClass({
  getInitialState: function() {
    return {
      user: null,
      store_id: 8805,
      loaded:false,
      banners:[],
      services:[],
      hotgoods:[],
      advs:[],
    };
  },

  componentDidMount: function() {
    this.getStoreMenu();
  },

  getStoreMenu:function(){
    var self = this;
    var options = {
        queries: {
          'inline-relation-depth': 1
        },
        filters: {}
    };
    //首页闪图模块
    api.modules.get(1, options, function (ret){
       if(ret && ret.code == 200){
          self.setState({
            banners:ret.data.fragments,
            loaded:true,
          });
          //服务模块
          api.modules.get(10, options, function (ret){
             if(ret && ret.code == 200){
                self.setState({
                  services:ret.data.fragments,
                  loaded:true,
                });
                //ad模块
                api.modules.get(3, options, function (ret){
                   if(ret && ret.code == 200){
                      self.setState({
                        advs:ret.data.fragments,
                        loaded:true,
                      });
                   }
                });
             }
          });
       }
    });
    
    
  },

  getRecommendation:function(){
    var storeid = this.state.store_id;
    var url = "https://api.bqmart.cn/goods/relatedrecommend.json?store_id=8805&type=seckill&page=1&limit=40";
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          hotgoods:responseData.result,
        });
      }).done();
  },

  renderContent: function() {
    if(!this.state.loaded){
      return (<Text style={Styles.hottitle}> LOADING </Text>);
    }
  	return (
  		<ScrollView style={[Styles.container]}>
            <Slider banners={this.state.banners} navigator={this.props.navigator}/>
            <BqService
                collumnNum={3}
                services = {this.state.services}/>
            <ADViews advs={this.state.advs} navigator={this.props.navigator}/>
            <View style={[Styles.row,Styles.center]}>
                <View style={[Styles.hotLine,Styles.flex1]}/>
                <Text style={Styles.hottitle}> 精品推荐 </Text>
                <View style={[Styles.hotLine,Styles.flex1]}/>
            </View>
            <HotGoods
              collumnNum={2}
              navigator={this.props.navigator}
              hotgoods ={this.state.hotgoods}/>
  		</ScrollView>
  	);
  },

  render: function() {
  	 if(!this.state.loaded){
        return <Loading loadingtext='正在加载首页...'/>
      }
  	return this.renderContent();
  },
});

module.exports = home;
